"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, ReceiptText, Sparkles } from "lucide-react";

export default function ExpensesPage() {
  const { groups, addExpense, expenses } = useRealtimeData();
  const [tab, setTab] = useState("equal");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("0");
  const [groupId, setGroupId] = useState<string | undefined>(groups[0]?.id);
  const [notes, setNotes] = useState("");

  const splits = useMemo(() => {
    const selected = groups.find((group) => group.id === groupId);
    if (!selected || Number(amount) <= 0) return [];
    const perPerson = Number(amount) / selected.memberIds.length;
    return selected.memberIds.map((memberId) => ({ userId: memberId, amount: perPerson }));
  }, [amount, groupId, groups]);

  const handleCreate = () => {
    if (!title || Number(amount) <= 0) return;
    addExpense({
      payerId: "user_001",
      title,
      amount: Number(amount),
      currency: "USD",
      category: "Misc",
      groupId,
      splits,
      notes,
    });
    setTitle("");
    setAmount("0");
    setNotes("");
  };

  const groupedExpenses = useMemo(() => {
    return expenses.reduce<Record<string, typeof expenses>>((acc, expense) => {
      const key = expense.groupId ?? "personal";
      acc[key] = acc[key] ? [...acc[key]!, expense] : [expense];
      return acc;
    }, {});
  }, [expenses]);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <ReceiptText className="h-5 w-5" />
              Log an expense
            </CardTitle>
            <CardDescription>Gemini assists with split logic and category detection.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-white/60">Title</label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Dinner at Atelier" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60">Amount</label>
              <Input
                type="number"
                value={amount}
                min={0}
                onChange={(event) => setAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60">Group</label>
              <Select value={groupId} onValueChange={setGroupId}>
                <SelectTrigger>
                  <SelectValue placeholder="Personal" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs text-white/60">Notes</label>
              <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional context or tags" />
            </div>
            <Tabs value={tab} onValueChange={setTab} className="md:col-span-2">
              <TabsList>
                <TabsTrigger value="equal">Equal</TabsTrigger>
                <TabsTrigger value="percentage">Percentage</TabsTrigger>
                <TabsTrigger value="exact">Exact</TabsTrigger>
              </TabsList>
              <TabsContent value="equal" className="grid gap-2 pt-4 text-sm text-white/70">
                {splits.map((split) => (
                  <div key={split.userId} className="flex justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span>{split.userId}</span>
                    <span>{formatCurrency(split.amount)}</span>
                  </div>
                ))}
              </TabsContent>
              <TabsContent value="percentage" className="pt-4 text-sm text-white/60">
                Gemini will convert descriptions into percentages based on historic spend.
              </TabsContent>
              <TabsContent value="exact" className="pt-4 text-sm text-white/60">
                Upload a receipt or voice note to let Gemini pre-populate exact amounts.
              </TabsContent>
            </Tabs>
            <div className="md:col-span-2 flex justify-end">
              <Button className="gap-2" onClick={handleCreate}>
                <Sparkles className="h-4 w-4" />
                Save expense
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-white">Activity feed</CardTitle>
            <CardDescription>Real-time sync courtesy of Convex subscription.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {Object.entries(groupedExpenses).map(([key, entries]) => (
              <div key={key} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{key === "personal" ? "Personal" : groups.find((group) => group.id === key)?.name}</p>
                  <span className="text-xs text-white/60">{entries.length} expenses</span>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-white/70">
                  {entries.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-white/90">{expense.title}</span>
                        <span className="text-xs text-white/60">{formatDate(expense.createdAt)}</span>
                      </div>
                      <Badge variant="outline">{formatCurrency(expense.amount, expense.currency)}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Scheduled automations
            </CardTitle>
            <CardDescription>Inngest orchestrates these workflows using spend triggers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p>• Every Friday 6PM: Send personal spend recap via Resend.</p>
            <p>• When budget &gt; 80%: Send bilingual notifications to group.</p>
            <p>• Monthly first day: Generate PDF report and attach settlements.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
