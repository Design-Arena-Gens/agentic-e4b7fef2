"use client";

import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRealtimeData } from "@/providers/realtime-data-provider";
import { useState } from "react";

export default function ProfilePage() {
  const { currentUser } = useRealtimeData();
  const [bio, setBio] = useState(
    "Product designer obsessed with transparent finance. Loves surf trips and AI automation."
  );

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-white text-2xl">{currentUser.name}</CardTitle>
              <CardDescription>{currentUser.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs text-white/60">Full name</label>
              <Input defaultValue={currentUser.name} />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/60">Email</label>
              <Input defaultValue={currentUser.email} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs text-white/60">Bio</label>
              <Textarea value={bio} onChange={(event) => setBio(event.target.value)} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button>Update profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">AI focus areas</CardTitle>
            <CardDescription>Gemini tailors insights to your goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p>• Track monthly dining to stay under $500.</p>
            <p>• Optimise travel groups for fairness and minimal reimbursements.</p>
            <p>• Surface eco-friendly alternatives for shared utilities.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
