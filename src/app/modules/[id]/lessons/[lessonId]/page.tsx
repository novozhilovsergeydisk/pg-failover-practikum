"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar, SidebarSection, SidebarLink } from "@/components/layout/sidebar";
import { CodeBlock } from "@/components/ui/code-block";
import { CommandBlock } from "@/components/practicum/command-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, Terminal, BookOpen, CheckCircle, Circle, Clock, Check, ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import { getModule } from "@/data/modules";
import { getLessonContent } from "@/data/lesson-content";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = parseInt(params.id as string);
  const lessonId = parseInt(params.lessonId as string);
  const { token } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({});
  const [completing, setCompleting] = useState(false);
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null);

  const module = getModule(moduleId);
  const lesson = module?.lessons.find((l) => l.id === lessonId);
  const content = getLessonContent(moduleId, lessonId);

  useEffect(() => {
    if (!token || !moduleId) return;

    fetch("/api/progress", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const moduleProgress = data.progress?.[moduleId];
        if (moduleProgress?.lessons) {
          setCompletedLessons(moduleProgress.lessons);
        }
      })
      .catch(() => {});
  }, [token, moduleId]);

  useEffect(() => {
    if (!token || !moduleId || !lessonId) return;

    fetch(`/api/quiz/results?moduleId=${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const result = data.results?.find(
          (r: { module_id: number; lesson_id: number; passed: boolean }) =>
            r.module_id === moduleId && r.lesson_id === lessonId
        );
        setQuizPassed(result?.passed ?? false);
      })
      .catch(() => setQuizPassed(false));
  }, [token, moduleId, lessonId]);

  const handleComplete = async () => {
    if (!token || completing) return;

    setCompleting(true);
    try {
      const res = await fetch("/api/progress/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ moduleId, lessonId }),
      });

      if (res.ok) {
        setCompletedLessons((prev) => ({ ...prev, [lessonId]: true }));
      }
    } finally {
      setCompleting(false);
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

  const completedCount = module.lessons.filter((l) => completedLessons[l.id]).length;
  const totalLessons = module.lessons.length;
  const prevLesson = lessonId > 1 ? module.lessons.find((l) => l.id === lessonId - 1) : null;
  const nextLesson = lessonId < totalLessons ? module.lessons.find((l) => l.id === lessonId + 1) : null;
  const isCompleted = !!completedLessons[lessonId];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules" active>Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/glossary">Глоссарий</NavLink>
        <NavLink href="/help">Справка</NavLink>
      </Header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar className="hidden lg:block">
            <SidebarSection title={module.title}>
              {module.lessons.map((l) => {
                const lCompleted = !!completedLessons[l.id];
                const isCurrent = l.id === lessonId;
                return (
                  <SidebarLink
                    key={l.id}
                    href={`/modules/${moduleId}/lessons/${l.id}`}
                    active={isCurrent}
                    icon={lCompleted
                      ? <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" />
                      : <Circle className="w-4 h-4" />
                    }
                  >
                    {l.title}
                  </SidebarLink>
                );
              })}
            </SidebarSection>
            <SidebarSection title="Викторина">
              <SidebarLink
                href={`/modules/${moduleId}/lessons/${lessonId}/quiz`}
                active={false}
                icon={quizPassed
                  ? <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" />
                  : <HelpCircle className="w-4 h-4" />
                }
              >
                {quizPassed ? "Викторина пройдена" : "Пройти викторину"}
              </SidebarLink>
            </SidebarSection>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Breadcrumb */}
            <div className="mb-4 text-sm text-[var(--text-muted)]">
              <Link href="/modules" className="hover:text-[var(--text-primary)]">Модули</Link>
              <span className="mx-2">/</span>
              <Link href={`/modules/${moduleId}`} className="hover:text-[var(--text-primary)]">{module.title}</Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--text-primary)]">{lesson.title}</span>
            </div>

            {/* Lesson Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isCompleted ? "bg-[var(--accent-green)]" : "bg-[var(--bg-tertiary)]"
                }`}>
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-sm font-medium text-[var(--text-muted)]">{lessonId}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    {lesson.title}
                  </h1>
                  <p className="text-[var(--text-secondary)]">
                    {lesson.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                {isCompleted && <Badge variant="green">Пройдено</Badge>}
                <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {lesson.duration}
                </span>
                <span className="text-sm text-[var(--text-muted)]">
                  Урок {lessonId} из {totalLessons}
                </span>
              </div>

              <Progress value={completedCount} max={totalLessons} showLabel />
            </div>

            {/* Lesson Content */}
            <div className="space-y-8">
              {/* Theory Section */}
              {content && content.theory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Теория
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {content.theory.map((paragraph, index) => (
                        <p key={index} className="text-[var(--text-secondary)]">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Practice Section */}
              {content && content.practice.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      Практика
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {content.practice.map((step, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                          {index + 1}. {step.title}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                          {step.description}
                        </p>
                        <CommandBlock
                          command={step.command}
                          description={step.title}
                          output={step.output}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Verification Section */}
              {content && content.verification.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Проверка
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {content.verification.map((step, index) => (
                      <div key={index}>
                        <p className="text-sm text-[var(--text-secondary)] mb-4">
                          {step.description}
                        </p>
                        <CommandBlock
                          command={step.command}
                          description="Проверка"
                          output={step.expectedOutput}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* No content placeholder */}
              {!content && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-[var(--text-muted)]">
                      Содержимое урока находится в разработке.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Complete Lesson Button */}
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-[var(--text-primary)]">
                        {quizPassed ? "Завершить этот урок" : "Пройдите викторину"}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {quizPassed
                          ? "Отметьте урок как выполненный после практики"
                          : "Для завершения урока необходимо пройти викторину"}
                      </p>
                    </div>
                    {quizPassed ? (
                      <Button
                        onClick={handleComplete}
                        disabled={isCompleted || completing}
                        variant={isCompleted ? "secondary" : "primary"}
                      >
                        {isCompleted ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Завершено
                          </>
                        ) : completing ? (
                          "Отправка..."
                        ) : (
                          "Отметить как завершённый"
                        )}
                      </Button>
                    ) : (
                      <Link href={`/modules/${moduleId}/lessons/${lessonId}/quiz`}>
                        <Button>
                          <HelpCircle className="w-4 h-4 mr-2" />
                          Пройти викторину
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                {prevLesson ? (
                  <Link href={`/modules/${moduleId}/lessons/${prevLesson.id}`}>
                    <Button variant="secondary">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      {prevLesson.title}
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
                {nextLesson ? (
                  <Link href={`/modules/${moduleId}/lessons/${nextLesson.id}`}>
                    <Button>
                      {nextLesson.title}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/modules/${moduleId}`}>
                    <Button>
                      К списку уроков
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] z-50">
        <div className="flex justify-around py-2">
          <a href="/" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--text-muted)]">
            <Database className="w-5 h-5" />
            <span className="text-xs">Практикум</span>
          </a>
          <a href="/modules" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--accent-green)]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Модули</span>
          </a>
          <a href="/reference" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--text-muted)]">
            <Terminal className="w-5 h-5" />
            <span className="text-xs">Справочник</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
