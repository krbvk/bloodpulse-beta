import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateOTP } from "@/lib/otp";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

type RequestBody = {
  email: string;
}

export async function POST(req: Request) {
  const { email }: RequestBody = await req.json();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  const code = await generateOTP(email); 

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "",
    to: email,
    subject: "Your BloodPulse OTP",
    text: `Your login code is ${code}. It expires in 5 minutes.`,
  });

  return NextResponse.json({ success: true });
}
