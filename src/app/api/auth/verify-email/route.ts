import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Токен обязателен" }, { status: 400 });
  }

  const result = await pool.query(
    "UPDATE users SET email_verified = true, verification_token = NULL WHERE verification_token = $1 RETURNING id, email",
    [token]
  );

  if (result.rows.length === 0) {
    return NextResponse.json({ error: "Недействительный токен верификации" }, { status: 400 });
  }

  const user = result.rows[0];
  return NextResponse.json({
    success: true,
    message: `Email ${user.email} успешно подтверждён`,
  });
}
