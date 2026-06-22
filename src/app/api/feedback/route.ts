import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { sendEmail } from "@/lib/mail";

const SUBJECT_LABELS: Record<string, string> = {
  bug: "Сообщение об ошибке",
  suggestion: "Предложение по улучшению",
  question: "Вопрос по материалу",
  content: "Ошибка в контенте урока",
  other: "Другое",
};

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json();

  if (!subject) {
    return NextResponse.json({ error: "Тема обязательна" }, { status: 400 });
  }
  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Сообщение обязательно" }, { status: 400 });
  }

  const result = await pool.query(
    "INSERT INTO feedback (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id, created_at",
    [name || null, email || null, subject, message.trim()]
  );

  const row = result.rows[0];

  const subjectLabel = SUBJECT_LABELS[subject] || subject;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #3fb950;">Новое сообщение обратной связи</h2>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Тема:</td><td style="padding: 8px;">${subjectLabel}</td></tr>
        ${name ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Имя:</td><td style="padding: 8px;">${name}</td></tr>` : ""}
        ${email ? `<tr><td style="padding: 8px; font-weight: bold; color: #555;">Email:</td><td style="padding: 8px;">${email}</td></tr>` : ""}
        <tr><td style="padding: 8px; font-weight: bold; color: #555;">Дата:</td><td style="padding: 8px;">${row.created_at.toLocaleString("ru-RU")}</td></tr>
      </table>
      <div style="background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 6px; padding: 16px; margin: 16px 0;">
        <p style="white-space: pre-wrap; margin: 0;">${message.trim()}</p>
      </div>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">ID: ${row.id} | PG Practikum Feedback</p>
    </div>
  `;

  await sendEmail({
    to: process.env.ADMIN_EMAIL || "noreply@appuse.ru",
    subject: `[Feedback] ${subjectLabel}`,
    html,
  });

  return NextResponse.json({ success: true, id: row.id });
}
