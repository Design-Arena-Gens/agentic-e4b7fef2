"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type PropsWithChildren,
} from "react";
import { nanoid } from "@/lib/nanoid";
import {
  type AiInsight,
  type AutoReport,
  type BudgetAlert,
  type Expense,
  type Group,
  type Settlement,
  type UserProfile,
} from "@/types";
import { toast } from "@/components/ui/sonner";
import { DEFAULT_USER, SAMPLE_DATA } from "@/providers/sample-data";

type DataState = {
  currentUser: UserProfile;
  groups: Group[];
  expenses: Expense[];
  insights: AiInsight[];
  reports: AutoReport[];
  budgetAlerts: BudgetAlert[];
  settlements: Settlement[];
  isLoading: boolean;
};

type Action =
  | { type: "INITIALIZE"; payload: Partial<DataState> }
  | { type: "ADD_GROUP"; payload: Group }
  | { type: "UPDATE_GROUP"; payload: Group }
  | { type: "ADD_EXPENSE"; payload: Expense }
  | { type: "SET_INSIGHTS"; payload: AiInsight[] }
  | { type: "ADD_REPORT"; payload: AutoReport }
  | { type: "SET_ALERTS"; payload: BudgetAlert[] }
  | { type: "SET_SETTLEMENTS"; payload: Settlement[] }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: DataState = {
  currentUser: DEFAULT_USER,
  groups: SAMPLE_DATA.groups,
  expenses: SAMPLE_DATA.expenses,
  insights: SAMPLE_DATA.insights,
  reports: SAMPLE_DATA.reports,
  budgetAlerts: SAMPLE_DATA.alerts,
  settlements: SAMPLE_DATA.settlements,
  isLoading: false,
};

function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case "INITIALIZE":
      return { ...state, ...action.payload };
    case "ADD_GROUP":
      return { ...state, groups: [action.payload, ...state.groups] };
    case "UPDATE_GROUP":
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.id === action.payload.id ? action.payload : group,
        ),
      };
    case "ADD_EXPENSE":
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case "SET_INSIGHTS":
      return { ...state, insights: action.payload };
    case "ADD_REPORT":
      return { ...state, reports: [action.payload, ...state.reports] };
    case "SET_ALERTS":
      return { ...state, budgetAlerts: action.payload };
    case "SET_SETTLEMENTS":
      return { ...state, settlements: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface RealtimeDataContextValue extends DataState {
  addGroup: (input: Omit<Group, "id" | "createdAt" | "updatedAt">) => void;
  addExpense: (input: Omit<Expense, "id" | "createdAt">) => void;
  refreshAiInsights: () => Promise<void>;
  generateReport: (groupId?: string) => Promise<void>;
  optimizeSettlements: () => void;
}

const RealtimeDataContext = createContext<RealtimeDataContextValue | null>(
  null,
);

export function RealtimeDataProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const channel = new BroadcastChannel("splitwise-ai");
    channel.onmessage = (event) => {
      const { type, payload } = event.data ?? {};
      if (!type) return;
      dispatch({ type, payload });
    };
    return () => channel.close();
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem("splitwise-ai-state");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<DataState>;
        dispatch({ type: "INITIALIZE", payload: parsed });
      } catch (error) {
        console.error("Failed to restore state", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("splitwise-ai-state", JSON.stringify(state));
  }, [state]);

  const broadcast = useCallback((type: Action["type"], payload: unknown) => {
    const channel = new BroadcastChannel("splitwise-ai");
    channel.postMessage({ type, payload });
    channel.close();
  }, []);

  const addGroup: RealtimeDataContextValue["addGroup"] = useCallback(
    (input) => {
      const group: Group = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...input,
      };
      dispatch({ type: "ADD_GROUP", payload: group });
      broadcast("ADD_GROUP", group);
      toast.success(`Group "${group.name}" created`);
    },
    [broadcast],
  );

  const addExpense: RealtimeDataContextValue["addExpense"] = useCallback(
    (input) => {
      const expense: Expense = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        ...input,
      };
      dispatch({ type: "ADD_EXPENSE", payload: expense });
      broadcast("ADD_EXPENSE", expense);
      toast.success(`Expense "${expense.title}" added`);
    },
    [broadcast],
  );

  const refreshAiInsights = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        body: JSON.stringify({
          groups: state.groups,
          expenses: state.expenses,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch AI insights");
      const data = (await response.json()) as AiInsight[];
      dispatch({ type: "SET_INSIGHTS", payload: data });
      broadcast("SET_INSIGHTS", data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to refresh AI insights. Showing cached results.");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [broadcast, state.expenses, state.groups]);

  const generateReport: RealtimeDataContextValue["generateReport"] = useCallback(
    async (groupId) => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const response = await fetch("/api/ai/report", {
          method: "POST",
          body: JSON.stringify({
            groupId,
            groups: state.groups,
            expenses: state.expenses,
          }),
        });
        if (!response.ok) throw new Error("Failed to generate report");
        const report = (await response.json()) as AutoReport;
        dispatch({ type: "ADD_REPORT", payload: report });
        broadcast("ADD_REPORT", report);
        toast.success("AI report generated");
      } catch (error) {
        console.error(error);
        toast.error("Could not generate report. Try again later.");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    },
    [broadcast, state.expenses, state.groups],
  );

  const optimizeSettlements =
    useCallback<RealtimeDataContextValue["optimizeSettlements"]>(() => {
      const balances = new Map<string, number>();

      for (const expense of state.expenses) {
        balances.set(
          expense.payerId,
          (balances.get(expense.payerId) ?? 0) + expense.amount,
        );
        for (const split of expense.splits) {
          balances.set(
            split.userId,
            (balances.get(split.userId) ?? 0) - split.amount,
          );
        }
      }

      const debtors: Settlement[] = [];
      const creditors: Settlement[] = [];

      balances.forEach((balance, userId) => {
        if (balance > 0.5) {
          creditors.push({
            from: "",
            to: userId,
            amount: balance,
            currency: "USD",
          });
        } else if (balance < -0.5) {
          debtors.push({
            from: userId,
            to: "",
            amount: Math.abs(balance),
            currency: "USD",
          });
        }
      });

      const settlements: Settlement[] = [];

      let debtorIndex = 0;
      let creditorIndex = 0;

      while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
        const debtor = debtors[debtorIndex];
        const creditor = creditors[creditorIndex];
        const amount = Math.min(debtor.amount, creditor.amount);

        settlements.push({
          from: debtor.from,
          to: creditor.to,
          amount: Number(amount.toFixed(2)),
          currency: "USD",
        });

        debtor.amount -= amount;
        creditor.amount -= amount;

        if (debtor.amount <= 0.01) debtorIndex += 1;
        if (creditor.amount <= 0.01) creditorIndex += 1;
      }

      dispatch({ type: "SET_SETTLEMENTS", payload: settlements });
      broadcast("SET_SETTLEMENTS", settlements);
    }, [broadcast, state.expenses]);

  const value = useMemo<RealtimeDataContextValue>(
    () => ({
      ...state,
      addGroup,
      addExpense,
      refreshAiInsights,
      generateReport,
      optimizeSettlements,
    }),
    [
      addExpense,
      addGroup,
      generateReport,
      optimizeSettlements,
      refreshAiInsights,
      state,
    ],
  );

  return (
    <RealtimeDataContext.Provider value={value}>
      {children}
    </RealtimeDataContext.Provider>
  );
}

export function useRealtimeData() {
  const context = useContext(RealtimeDataContext);
  if (!context) {
    throw new Error("useRealtimeData must be used within RealtimeDataProvider");
  }
  return context;
}
