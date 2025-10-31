export type SplitType = "equal" | "percentage" | "exact";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferredLanguage: string;
  monthlyBudget: number;
}

export interface GroupMember {
  userId: string;
  role: "owner" | "admin" | "member";
  sharePercentage?: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  memberIds: string[];
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
}

export interface Expense {
  id: string;
  groupId?: string;
  payerId: string;
  title: string;
  amount: number;
  currency: string;
  category: string;
  notes?: string;
  createdAt: string;
  splits: ExpenseSplit[];
  receiptUrl?: string;
  tags?: string[];
  location?: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
  currency: string;
}

export interface AiInsight {
  id: string;
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  createdAt: string;
  actions: string[];
}

export interface BudgetAlert {
  id: string;
  userId: string;
  groupId?: string;
  message: string;
  severity: "info" | "warning" | "critical";
  projectedOverspend: number;
  createdAt: string;
}

export interface AutoReport {
  id: string;
  groupId?: string;
  title: string;
  summary: string;
  highlights: string[];
  settlements: Settlement[];
  totalSpend: number;
  generatedAt: string;
  downloadUrl?: string;
}

export interface ReceiptExtraction {
  merchant: string;
  total: number;
  currency: string;
  date: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  notes?: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}
