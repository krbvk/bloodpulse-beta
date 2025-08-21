import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/utils/otp";

export async function POST(req: Request) {
  try {
    const { email } = await req.json() as { email?: string };
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    await sendOtpEmail(email);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in request-otp:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
