"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { formatDate } from "@/lib/format";
import { Users, PlusCircle, MapPinned } from "lucide-react";

export default function GroupsPage() {
  const { groups, addGroup, expenses } = useRealtimeData();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState("USD");

  const handleCreate = () => {
    if (!name) return;
    addGroup({
      name,
      description,
      currency,
      memberIds: ["user_001"],
    });
    setName("");
    setDescription("");
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Create a new group
            </CardTitle>
            <CardDescription>Spin up a workspace for a trip, home, or side project.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Group name</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Bali Surf Retreat" />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Currency</label>
              <Input value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase())} placeholder="USD" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs uppercase tracking-wide text-white/60">Description</label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Optional context. Gemini uses this to tailor insights."
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button className="gap-2" onClick={handleCreate} disabled={!name}>
                <Users className="h-4 w-4" />
                Create group
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {groups.map((group) => {
            const groupExpenses = expenses.filter((expense) => expense.groupId === group.id);
            const total = groupExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            return (
              <Card key={group.id} className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-white">
                    <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white/10">
                      <MapPinned className="h-5 w-5" />
                    </span>
                    {group.name}
                  </CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                  <Badge variant="outline">{group.currency}</Badge>
                  <span>{group.memberIds.length} members</span>
                  <span>Total spend: ${total.toFixed(2)}</span>
                  <span>Updated {formatDate(group.updatedAt)}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">How Gemini helps</CardTitle>
            <CardDescription>Each group streams real-time changes via Convex and can trigger automations.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm text-white/70">
            <p>• Smart settlements proposed when imbalance exceeds $25.</p>
            <p>• AI summaries delivered weekly via Resend with multilingual support.</p>
            <p>• Inngest orchestrates reminders whenever someone falls behind.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
