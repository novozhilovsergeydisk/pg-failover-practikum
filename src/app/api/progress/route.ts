import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await pool.query(
    "SELECT module_id, lesson_id, completed, completed_at FROM user_progress WHERE user_id = (SELECT id FROM users WHERE email = $1)",
    [user.email]
  );

  const progress: Record<number, { total: number; completed: number; lessons: Record<number, boolean> }> = {};

  for (const row of result.rows) {
    if (!progress[row.module_id]) {
      progress[row.module_id] = { total: 0, completed: 0, lessons: {} };
    }
    progress[row.module_id].total++;
    progress[row.module_id].lessons[row.lesson_id] = row.completed;
    if (row.completed) {
      progress[row.module_id].completed++;
    }
  }

  return NextResponse.json({ progress });
}
