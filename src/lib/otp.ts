import { db } from "@/server/db";

const OTP_EXPIRY_MS = 5 * 60 * 1000; // limang minuto expired

export async function generateOTP(email: string) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await db.oTP.upsert({
    where: { email },
    update: { code, expiresAt: new Date(Date.now() + OTP_EXPIRY_MS) },
    create: { email, code, expiresAt: new Date(Date.now() + OTP_EXPIRY_MS) },
  });

  return code;
}

export async function verifyOTP(email: string, code: string) {
  const record = await db.oTP.findUnique({ where: { email } });
  if (!record) return false;

  const valid = record.code === code && record.expiresAt > new Date();

  if (valid) {
    await db.oTP.delete({ where: { email } }); // one time use only
  }

  return valid;
}
