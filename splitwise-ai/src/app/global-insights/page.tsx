import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe2 } from "lucide-react";

const languages = [
  {
    code: "en",
    label: "English",
    sample:
      "Mission Loft groceries are trending 12% above budget. Consider switching to a weekly meal prep plan.",
  },
  {
    code: "es",
    label: "Español",
    sample:
      "Los gastos de comestibles de Mission Loft están un 12% por encima del presupuesto. Considera un plan semanal de comidas.",
  },
  {
    code: "fr",
    label: "Français",
    sample:
      "Les courses de Mission Loft dépassent le budget de 12 %. Pensez à un plan de repas hebdomadaire.",
  },
  {
    code: "pt",
    label: "Português",
    sample:
      "As compras do Mission Loft estão 12% acima do orçamento. Experimente um plano semanal de refeições.",
  },
];

export default function GlobalInsightsPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Globe2 className="h-5 w-5" /> Multi-language insights
            </CardTitle>
            <CardDescription>Gemini localises insights per member preferences.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {languages.map((language) => (
              <div key={language.code} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
                <Badge variant="outline" className="mb-2">
                  {language.label}
                </Badge>
                <p>{language.sample}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Why it matters</CardTitle>
            <CardDescription>Cross-border teams get personalised reminders and reports.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-white/70">
            <p>• Gemini dynamically switches tone to suit each locale.</p>
            <p>• Resend templates include bilingual fallback text.</p>
            <p>• Voice assistant responds using the same language detected from the user.</p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
