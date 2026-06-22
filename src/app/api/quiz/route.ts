import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { getQuizContent } from "@/data/quiz-content";

export async function GET(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const moduleId = parseInt(searchParams.get("moduleId") || "0");
  const lessonId = parseInt(searchParams.get("lessonId") || "0");

  if (!moduleId || !lessonId) {
    return NextResponse.json({ error: "moduleId and lessonId required" }, { status: 400 });
  }

  const quiz = getQuizContent(moduleId, lessonId);
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const questionsWithoutAnswers = quiz.questions.map(({ correctIndex, explanation, ...q }) => q);

  const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [user.email]);
  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = userResult.rows[0].id;
  const existingResult = await pool.query(
    "SELECT score, total, passed, created_at FROM quiz_results WHERE user_id = $1 AND module_id = $2 AND lesson_id = $3",
    [userId, moduleId, lessonId]
  );

  return NextResponse.json({
    questions: questionsWithoutAnswers,
    total: quiz.questions.length,
    previousResult: existingResult.rows[0] || null,
  });
}

export async function POST(request: Request) {
  const user = requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { moduleId, lessonId, answers } = await request.json();

  if (!moduleId || !lessonId || !answers) {
    return NextResponse.json({ error: "moduleId, lessonId, and answers required" }, { status: 400 });
  }

  const quiz = getQuizContent(moduleId, lessonId);
  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  const PASS_THRESHOLD = 0.6;

  let score = 0;
  const results = quiz.questions.map((q, i) => {
    const isCorrect = answers[i] === q.correctIndex;
    if (isCorrect) score++;
    return {
      questionId: q.id,
      selected: answers[i],
      correct: q.correctIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const total = quiz.questions.length;
  const passed = score / total >= PASS_THRESHOLD;

  const userResult = await pool.query("SELECT id FROM users WHERE email = $1", [user.email]);
  if (userResult.rows.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const userId = userResult.rows[0].id;

  await pool.query(
    `INSERT INTO quiz_results (user_id, module_id, lesson_id, score, total, passed, answers)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id, module_id, lesson_id)
     DO UPDATE SET score = $4, total = $5, passed = $6, answers = $7, created_at = CURRENT_TIMESTAMP`,
    [userId, moduleId, lessonId, score, total, passed, JSON.stringify(results)]
  );

  return NextResponse.json({
    score,
    total,
    passed,
    results,
  });
}
