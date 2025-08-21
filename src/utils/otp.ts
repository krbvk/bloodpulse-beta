import crypto from "crypto";
import nodemailer from "nodemailer";

type OtpEntry = {
  code: string;
  expiresAt: number;
};

const otpStore: Record<string, OtpEntry> = {};

// ✅ Gmail transporter with proper SMTP setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.EMAIL_USER || "", // Gmail address
    pass: process.env.EMAIL_PASS || "", // App Password (16 chars, not Gmail login)
  },
  tls: {
    rejectUnauthorized: false, // Fixes dev SSL issues
  },
});

// ✅ Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Nodemailer config error:", error);
  } else {
    console.log("✅ Nodemailer transporter is ready to send emails");
  }
});

/**
 * Generate a random OTP and store it in memory
 */
export function generateOtp(email: string): string {
  const code = crypto.randomInt(100000, 999999).toString();

  otpStore[email] = {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  return code;
}

/**
 * Verify an OTP for an email
 */
export function verifyOtp(email: string, code: string): boolean {
  const entry = otpStore[email];
  if (!entry) return false;

  const isValid = entry.code === code && Date.now() < entry.expiresAt;

  if (isValid) {
    delete otpStore[email]; // remove used OTP
  }

  return isValid;
}

/**
 * Send OTP email via Gmail
 */
export async function sendOtpEmail(email: string) {
  const code = generateOtp(email);

  try {
    await transporter.sendMail({
      from: `"BloodPulse" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your BloodPulse OTP Code",
      text: `Your OTP is: ${code}. It expires in 5 minutes.`,
      html: `<p>Your OTP is: <b>${code}</b></p><p>It expires in 5 minutes.</p>`,
    });

    console.log(`✅ OTP email sent to ${email}`);
    return code;
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Failed to send OTP email. Please try again.");
  }
}
