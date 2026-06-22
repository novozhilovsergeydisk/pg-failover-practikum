"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Circle, ArrowLeft, ArrowRight, HelpCircle, Trophy } from "lucide-react";
import { getModule, getLesson } from "@/data/modules";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
}

interface QuizResult {
  questionId: number;
  selected: number;
  correct: number;
  isCorrect: boolean;
  explanation: string;
}

interface PreviousResult {
  score: number;
  total: number;
  passed: boolean;
  created_at: string;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = parseInt(params.id as string);
  const lessonId = parseInt(params.lessonId as string);
  const { token } = useAuth();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [previousResult, setPreviousResult] = useState<PreviousResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const module = getModule(moduleId);
  const lesson = getLesson(moduleId, lessonId);

  useEffect(() => {
    if (!token || !moduleId || !lessonId) return;

    fetch(`/api/quiz?moduleId=${moduleId}&lessonId=${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.questions) {
          setQuestions(data.questions);
          setTotal(data.total);
          setPreviousResult(data.previousResult);
          setAnswers(new Array(data.questions.length).fill(null));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, moduleId, lessonId]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (!token || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ moduleId, lessonId, answers }),
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
        setScore(data.score);
        setPassed(data.passed);
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!module || !lesson) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Header>
          <NavLink href="/">Практикум</NavLink>
          <NavLink href="/modules" active>Модули</NavLink>
        </Header>
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Урок не найден</h1>
          <Button className="mt-4" onClick={() => router.push(`/modules/${moduleId}`)}>
            Вернуться к модулю
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Header>
          <NavLink href="/">Практикум</NavLink>
          <NavLink href="/modules" active>Модули</NavLink>
        </Header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="text-[var(--text-muted)]">Загрузка...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Header>
          <NavLink href="/">Практикум</NavLink>
          <NavLink href="/modules" active>Модули</NavLink>
        </Header>
        <main className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Викторина не найдена</h1>
          <p className="text-[var(--text-muted)] mt-2">Викторина для этого урока ещё не готова.</p>
          <Button className="mt-4" onClick={() => router.push(`/modules/${moduleId}/lessons/${lessonId}`)}>
            Вернуться к уроку
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === total;

  if (submitted) {
    const percentage = Math.round((score / total) * 100);
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Header>
          <NavLink href="/">Практикум</NavLink>
          <NavLink href="/modules" active>Модули</NavLink>
        </Header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-4 text-sm text-[var(--text-muted)]">
            <Link href="/modules" className="hover:text-[var(--text-primary)]">Модули</Link>
            <span className="mx-2">/</span>
            <Link href={`/modules/${moduleId}`} className="hover:text-[var(--text-primary)]">{module.title}</Link>
            <span className="mx-2">/</span>
            <Link href={`/modules/${moduleId}/lessons/${lessonId}`} className="hover:text-[var(--text-primary)]">{lesson.title}</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--text-primary)]">Результаты</span>
          </div>

          <Card className="mb-8">
            <CardContent className="py-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                passed ? "bg-[var(--accent-green)]" : "bg-[var(--accent-red)]"
              }`}>
                {passed ? (
                  <Trophy className="w-10 h-10 text-white" />
                ) : (
                  <HelpCircle className="w-10 h-10 text-white" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                {passed ? "Викторина пройдена!" : "Неудачная попытка"}
              </h1>
              <p className="text-[var(--text-secondary)] mb-4">
                {score} из {total} правильных ответов ({percentage}%)
              </p>
              <Badge variant={passed ? "green" : "red"}>
                {passed ? "Зачёт" : "Минимум 60%"}
              </Badge>
            </CardContent>
          </Card>

          <div className="space-y-4 mb-8">
            {results.map((result, index) => (
              <Card key={result.questionId}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      result.isCorrect ? "bg-[var(--accent-green)]" : "bg-[var(--accent-red)]"
                    }`}>
                      {result.isCorrect ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Circle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[var(--text-primary)] mb-2">
                        {index + 1}. {questions[index].question}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">
                        {result.explanation}
                      </p>
                      {!result.isCorrect && (
                        <p className="text-sm text-[var(--accent-green)]">
                          Правильный ответ: {questions[index].options[result.correct]}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between">
            <Link href={`/modules/${moduleId}/lessons/${lessonId}`}>
              <Button variant="secondary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                К уроку
              </Button>
            </Link>
            {!passed && (
              <Button onClick={() => {
                setSubmitted(false);
                setResults([]);
                setAnswers(new Array(total).fill(null));
                setCurrentQuestion(0);
              }}>
                Попробовать снова
              </Button>
            )}
            {passed && (
              <Link href={`/modules/${moduleId}/lessons/${lessonId}`}>
                <Button>
                  Завершить урок
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules" active>Модули</NavLink>
      </Header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-[var(--text-muted)]">
          <Link href="/modules" className="hover:text-[var(--text-primary)]">Модули</Link>
          <span className="mx-2">/</span>
          <Link href={`/modules/${moduleId}`} className="hover:text-[var(--text-primary)]">{module.title}</Link>
          <span className="mx-2">/</span>
          <Link href={`/modules/${moduleId}/lessons/${lessonId}`} className="hover:text-[var(--text-primary)]">{lesson.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--text-primary)]">Викторина</span>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-[var(--accent-blue)]" />
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Викторина: {lesson.title}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {total} вопросов &middot; Проходной балл: 60%
            </p>
          </div>
        </div>

        {previousResult && (
          <Card className="mb-6">
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">
                  Предыдущая попытка: {previousResult.score}/{previousResult.total}
                </span>
                <Badge variant={previousResult.passed ? "green" : "red"}>
                  {previousResult.passed ? "Сдано" : "Не сдано"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mb-6">
          <div className="flex justify-between text-sm text-[var(--text-muted)] mb-2">
            <span>Вопрос {currentQuestion + 1} из {total}</span>
            <span>{answeredCount} из {total} отвечено</span>
          </div>
          <div className="w-full h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent-blue)] transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQuestion, index)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    answers[currentQuestion] === index
                      ? "border-[var(--accent-blue)] bg-[var(--accent-blue)] bg-opacity-10"
                      : "border-[var(--border-primary)] bg-[var(--bg-card)] hover:border-[var(--accent-blue)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${
                      answers[currentQuestion] === index
                        ? "border-[var(--accent-blue)] bg-[var(--accent-blue)] text-white"
                        : "border-[var(--border-primary)]"
                    }`}>
                      {answers[currentQuestion] === index ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{String.fromCharCode(65 + index)}</span>
                      )}
                    </div>
                    <span className="text-[var(--text-primary)]">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="secondary"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>

          {currentQuestion < total - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              disabled={answers[currentQuestion] === null}
            >
              Далее
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
            >
              {submitting ? "Проверка..." : "Завершить"}
            </Button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
