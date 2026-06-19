import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Токен и пароль обязательны" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Пароль должен быть не менее 6 символов" }, { status: 400 });
  }

  const result = await pool.query(
    "SELECT id FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()",
    [token]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Недействительный или истёкший токен" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(
    "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2",
    [hashedPassword, token]
  );

  return NextResponse.json({ success: true, message: "Пароль успешно обновлён" });
}
