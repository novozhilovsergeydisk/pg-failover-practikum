import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [user.email]);
  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = userResult.rows[0].id;

  const progressResult = await pool.query(
    `SELECT module_id, lesson_id, completed, completed_at
     FROM user_progress
     WHERE user_id = $1 AND completed = true
     ORDER BY completed_at`,
    [userId]
  );

  const totalCompleted = progressResult.rows.length;

  const moduleStats: Record<number, { completed: number; firstDate: string; lastDate: string }> = {};
  for (const row of progressResult.rows) {
    if (!moduleStats[row.module_id]) {
      moduleStats[row.module_id] = { completed: 0, firstDate: row.completed_at, lastDate: row.completed_at };
    }
    moduleStats[row.module_id].completed++;
    if (row.completed_at < moduleStats[row.module_id].firstDate) {
      moduleStats[row.module_id].firstDate = row.completed_at;
    }
    if (row.completed_at > moduleStats[row.module_id].lastDate) {
      moduleStats[row.module_id].lastDate = row.completed_at;
    }
  }

  const streak = calculateStreak(progressResult.rows);

  const dates = progressResult.rows.map((r) => new Date(r.completed_at).toDateString());
  const uniqueDays = [...new Set(dates)].length;

  return NextResponse.json({
    totalCompleted,
    totalLessons: 30,
    totalModules: 4,
    completedModules: Object.keys(moduleStats).filter((id) => {
      const counts: Record<number, number> = { 1: 8, 2: 6, 3: 7, 4: 9 };
      return moduleStats[parseInt(id)].completed >= counts[parseInt(id)];
    }).length,
    moduleStats,
    streak,
    activeDays: uniqueDays,
    recentActivity: progressResult.rows.slice(-10).reverse().map((r) => ({
      moduleId: r.module_id,
      lessonId: r.lesson_id,
      completedAt: r.completed_at,
    })),
  });
}

function calculateStreak(rows: { completed_at: string }[]): number {
  if (rows.length === 0) return 0;

  const dates = [...new Set(rows.map((r) => new Date(r.completed_at).toDateString()))].sort().reverse();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const current = new Date(dates[i]);
    const prev = new Date(dates[i + 1]);
    const diffDays = (current.getTime() - prev.getTime()) / 86400000;

    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
