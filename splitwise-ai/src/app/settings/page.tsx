"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { toast } from "@/components/ui/sonner";

export default function SettingsPage() {
  const { currentUser } = useRealtimeData();
  const [language, setLanguage] = useState(currentUser.preferredLanguage);
  const [budget, setBudget] = useState(currentUser.monthlyBudget.toString());
  const [newsletter, setNewsletter] = useState(true);
  const [voiceHints, setVoiceHints] = useState(true);

  const handleSave = () => {
    toast.success("Preferences saved. Gemini will adapt future insights.");
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Personal preferences</CardTitle>
            <CardDescription>Set budgets, languages, and communication cadence.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-white/60">Preferred language</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60">Monthly budget</label>
              <Input value={budget} onChange={(event) => setBudget(event.target.value)} />
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <span>AI newsletter</span>
              <Switch checked={newsletter} onCheckedChange={setNewsletter} />
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              <span>Voice assistant hints</span>
              <Switch checked={voiceHints} onCheckedChange={setVoiceHints} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button onClick={handleSave}>Save changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Connected services</CardTitle>
            <CardDescription>Overview of Clerk, Convex, Inngest, and Resend configuration.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p>• Clerk authenticates members with passkeys and OAuth.</p>
            <p>• Convex streams expense updates and handles serverless functions.</p>
            <p>• Inngest orchestrates budgets, while Resend delivers emails.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
