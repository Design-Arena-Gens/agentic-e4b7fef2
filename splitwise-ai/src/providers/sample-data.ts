import {
  type AiInsight,
  type AutoReport,
  type BudgetAlert,
  type Expense,
  type Group,
  type Settlement,
  type UserProfile,
} from "@/types";

export const DEFAULT_USER: UserProfile = {
  id: "user_001",
  name: "Jordan Avery",
  email: "jordan@example.com",
  avatarUrl: "https://i.pravatar.cc/150?img=32",
  preferredLanguage: "en",
  monthlyBudget: 1200,
};

const now = new Date();

export const SAMPLE_DATA: {
  groups: Group[];
  expenses: Expense[];
  insights: AiInsight[];
  reports: AutoReport[];
  alerts: BudgetAlert[];
  settlements: Settlement[];
} = {
  groups: [
    {
      id: "group_travel",
      name: "Lisbon Escape",
      description: "Friends weekend getaway to Lisbon with food, travel, and tours.",
      currency: "EUR",
      memberIds: ["user_001", "user_002", "user_003", "user_004"],
      coverImage:
        "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1400",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 45).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    },
    {
      id: "group_roommates",
      name: "Mission Loft",
      description: "Monthly shared living expenses for the Mission district apartment.",
      currency: "USD",
      memberIds: ["user_001", "user_005", "user_006"],
      coverImage:
        "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?q=80&w=1400",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 120).toISOString(),
      updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
  ],
  expenses: [
    {
      id: "expense_001",
      groupId: "group_travel",
      payerId: "user_001",
      title: "Airbnb - Alfama Loft",
      amount: 640,
      currency: "EUR",
      category: "Lodging",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      splits: [
        { userId: "user_001", amount: 160 },
        { userId: "user_002", amount: 160 },
        { userId: "user_003", amount: 160 },
        { userId: "user_004", amount: 160 },
      ],
      notes: "3 nights in Lisbon. Paid through credit card.",
      tags: ["travel", "lodging"],
    },
    {
      id: "expense_002",
      groupId: "group_travel",
      payerId: "user_003",
      title: "Seafood Dinner - Cervejaria Ramiro",
      amount: 280,
      currency: "EUR",
      category: "Dining",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      splits: [
        { userId: "user_001", amount: 70 },
        { userId: "user_002", amount: 70 },
        { userId: "user_003", amount: 70 },
        { userId: "user_004", amount: 70 },
      ],
      notes: "Included oysters, lobster, and desserts.",
      tags: ["foodie"],
    },
    {
      id: "expense_003",
      groupId: "group_roommates",
      payerId: "user_005",
      title: "February Rent",
      amount: 4200,
      currency: "USD",
      category: "Housing",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
      splits: [
        { userId: "user_001", amount: 1400 },
        { userId: "user_005", amount: 1400 },
        { userId: "user_006", amount: 1400 },
      ],
      tags: ["rent"],
    },
    {
      id: "expense_004",
      groupId: "group_roommates",
      payerId: "user_001",
      title: "Groceries - Rainbow Grocery",
      amount: 189.45,
      currency: "USD",
      category: "Groceries",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      splits: [
        { userId: "user_001", amount: 63.15 },
        { userId: "user_005", amount: 63.15 },
        { userId: "user_006", amount: 63.15 },
      ],
      tags: ["food"],
      notes: "Weekly groceries including pantry restock.",
    },
  ],
  insights: [
    {
      id: "insight_001",
      title: "Lisbon Escape trending 18% above planned budget",
      description:
        "Travel dining costs surged due to two premium seafood dinners. Consider setting a dining cap or using local markets for upcoming meals.",
      impact: "high",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      actions: [
        "Limit future group meals to 40 EUR per person.",
        "Enable Smart Settlements after each major spend to reduce outstanding balances.",
      ],
    },
    {
      id: "insight_002",
      title: "Mission Loft utilities forecasted to exceed budget by $42",
      description:
        "Heating usage increased during the cold snap. Gemini recommends nudging roommates with efficiency tips and scheduling a Resend reminder.",
      impact: "medium",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      actions: [
        "Trigger a Budget Alert when utilities reach 80% of budget.",
        "Share last month's efficiency tips via Resend email automation.",
      ],
    },
    {
      id: "insight_003",
      title: "Jordan's personal dining spend spiked by 36% this month",
      description:
        "Gemini spotted three extra takeout orders. Consider setting a weekly voice check-in to log meals and receive lower-cost alternatives.",
      impact: "medium",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      actions: [
        "Enable voice quick-add to capture impromptu meals.",
        "Review AI meal plan suggestions for the next two weeks.",
      ],
    },
  ],
  reports: [
    {
      id: "report_001",
      groupId: "group_travel",
      title: "Lisbon Escape Highlights",
      summary:
        "The group spent €1,280 over 6 days. Lodging represented 50% of all expenses while dining added 30%. Gemini optimized settlements requiring two payments instead of six.",
      highlights: [
        "Top categories: Lodging (€640), Dining (€384), Experiences (€120).",
        "Jordan overspent personal budget by €84 – set a weekend cap.",
        "Recommend locking favorable EUR to USD rate before next transfer.",
      ],
      settlements: [
        { from: "user_002", to: "user_001", amount: 90, currency: "EUR" },
        { from: "user_004", to: "user_003", amount: 20, currency: "EUR" },
      ],
      totalSpend: 1280,
      generatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      downloadUrl: "#",
    },
  ],
  alerts: [
    {
      id: "alert_001",
      userId: "user_001",
      groupId: "group_roommates",
      message:
        "Heads up! Mission Loft groceries are at 78% of the monthly budget with 9 days remaining.",
      severity: "warning",
      projectedOverspend: 48,
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
  ],
  settlements: [
    { from: "user_002", to: "user_001", amount: 90, currency: "EUR" },
    { from: "user_004", to: "user_003", amount: 20, currency: "EUR" },
  ],
};
