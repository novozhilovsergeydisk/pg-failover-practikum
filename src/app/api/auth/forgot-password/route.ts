import { NextResponse } from "next/server";
import crypto from "crypto";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email обязателен" }, { status: 400 });
  }

  const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  
  // Always return success to prevent email enumeration
  if (result.rows.length === 0) {
    return NextResponse.json({ success: true, message: "Если аккаунт существует, письмо отправлено" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetExpiry = new Date(Date.now() + 3600000); // 1 hour

  await pool.query(
    "UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3",
    [resetToken, resetExpiry, email]
  );

  // In production, send email here with reset link
  // For now, just log it
  console.log(`Password reset token for ${email}: ${resetToken}`);
  console.log(`Reset link: ${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`);

  return NextResponse.json({ success: true, message: "Если аккаунт существует, письмо отправлено" });
}
