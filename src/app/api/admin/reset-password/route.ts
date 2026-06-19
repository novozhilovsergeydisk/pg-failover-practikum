import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(request: Request) {
  const { email, newPassword } = await request.json();

  if (!email || !newPassword) {
    return NextResponse.json(
      { error: "email и newPassword обязательны" },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "Пароль должен быть не менее 6 символов" },
      { status: 400 }
    );
  }

  const result = await pool.query(
    "UPDATE users SET password = $1 WHERE email = $2 RETURNING id",
    [newPassword, email]
  );

  if (result.rows.length === 0) {
    return NextResponse.json(
      { error: "Пользователь не найден" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Пароль для ${email} обновлён`,
  });
}
