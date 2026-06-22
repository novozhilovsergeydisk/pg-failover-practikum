import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get("moduleId");

  const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [user.email]);
  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = userResult.rows[0].id;

  let query = "SELECT module_id, lesson_id, score, total, passed, created_at FROM quiz_results WHERE user_id = $1";
  const params: (string | number)[] = [userId];

  if (moduleId) {
    query += " AND module_id = $2";
    params.push(parseInt(moduleId));
  }

  query += " ORDER BY module_id, lesson_id";

  const result = await pool.query(query, params);

  return NextResponse.json({ results: result.rows });
}
