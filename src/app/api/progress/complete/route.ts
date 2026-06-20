import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId, lessonId } = await request.json();

  if (!moduleId || !lessonId) {
    return NextResponse.json({ error: "moduleId and lessonId required" }, { status: 400 });
  }

  const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [user.email]);
  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = userResult.rows[0].id;

  await pool.query(
    `INSERT INTO user_progress (user_id, module_id, lesson_id, completed, completed_at)
     VALUES ($1, $2, $3, true, CURRENT_TIMESTAMP)
     ON CONFLICT (user_id, module_id, lesson_id)
     DO UPDATE SET completed = true, completed_at = CURRENT_TIMESTAMP`,
    [userId, moduleId, lessonId]
  );

  const stats = await pool.query(
    `SELECT
       COUNT(*) as total,
       COUNT(*) FILTER (WHERE completed) as completed
     FROM user_progress
     WHERE user_id = $1 AND module_id = $2`,
    [userId, moduleId]
  );

  return NextResponse.json({
    success: true,
    moduleProgress: {
      total: parseInt(stats.rows[0].total),
      completed: parseInt(stats.rows[0].completed),
    },
  });
}
