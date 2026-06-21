import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ACHIEVEMENTS, checkAchievements } from "@/data/achievements";

const MODULE_LESSONS: Record<number, number> = { 1: 8, 2: 6, 3: 7, 4: 9 };

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
    `SELECT module_id, lesson_id, completed_at
     FROM user_progress
     WHERE user_id = $1 AND completed = true
     ORDER BY completed_at`,
    [userId]
  );

  const totalCompleted = progressResult.rows.length;
  const totalLessons = 30;
  const percent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const moduleCompleted: Record<number, number> = {};
  for (const row of progressResult.rows) {
    moduleCompleted[row.module_id] = (moduleCompleted[row.module_id] || 0) + 1;
  }

  const completedModules = Object.keys(moduleCompleted)
    .filter((id) => moduleCompleted[parseInt(id)] >= MODULE_LESSONS[parseInt(id)])
    .map(Number);

  const streak = calculateStreak(progressResult.rows);

  const earnedIds = checkAchievements({
    completedLessons: totalCompleted,
    completedModules,
    streak,
    percent,
  });

  const achievements = ACHIEVEMENTS.map((a) => ({
    ...a,
    earned: earnedIds.includes(a.id),
  }));

  const earnedCount = earnedIds.length;

  return NextResponse.json({
    achievements,
    earnedCount,
    totalCount: ACHIEVEMENTS.length,
    streak,
    percent,
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
