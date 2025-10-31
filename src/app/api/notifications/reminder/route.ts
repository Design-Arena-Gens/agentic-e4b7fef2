import { NextResponse } from "next/server";
import { Resend } from "resend";

interface Payload {
  to: string;
  amount: number;
  note?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as Payload;
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: "Splitwise AI <noreply@splitwise-ai.dev>",
      to: body.to,
      subject: "Friendly reminder to settle up",
      html: `<p>Hey there! Gemini spotted an outstanding balance of <strong>$${body.amount.toFixed(
        2,
      )}</strong>.</p><p>${body.note ?? "Settle when it's convenient."}</p>`,
    });
    return NextResponse.json({ ok: true, delivered: true });
  } catch (error) {
    console.error("Resend reminder failed", error);
    return NextResponse.json({ ok: false, delivered: false }, { status: 200 });
  }
}
