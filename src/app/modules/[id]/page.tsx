"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar, SidebarSection, SidebarLink } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Database, Terminal, BookOpen, CheckCircle, Circle, Clock, Check, ChevronRight } from "lucide-react";
import { getModule } from "@/data/modules";

export default function ModulePage() {
  const params = useParams();
  const moduleId = parseInt(params.id as string);
  const { token } = useAuth();
  const [completedLessons, setCompletedLessons] = useState<Record<number, boolean>>({});

  const module = getModule(moduleId);

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

  if (!module) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Header>
          <NavLink href="/">Практикум</NavLink>
          <NavLink href="/modules" active>Модули</NavLink>
          <NavLink href="/reference">Справочник</NavLink>
        </Header>
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Модуль не найден</h1>
          <Button className="mt-4" onClick={() => window.location.href = "/modules"}>
            Вернуться к модулям
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const completedCount = Object.values(completedLessons).filter(Boolean).length;
  const totalLessons = module.lessons.length;

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
              {module.lessons.map((lesson) => {
                const isCompleted = !!completedLessons[lesson.id];
                return (
                  <SidebarLink
                    key={lesson.id}
                    href={`/modules/${moduleId}?lesson=${lesson.id}`}
                    icon={isCompleted
                      ? <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" />
                      : <Circle className="w-4 h-4" />
                    }
                  >
                    {lesson.title}
                  </SidebarLink>
                );
              })}
            </SidebarSection>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Module Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-green)] flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    {module.title}
                  </h1>
                  <p className="text-[var(--text-secondary)]">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <Badge variant={
                  module.difficulty === "beginner" ? "green" :
                  module.difficulty === "intermediate" ? "orange" : "red"
                }>
                  {module.difficulty === "beginner" ? "Начальный" :
                   module.difficulty === "intermediate" ? "Средний" : "Продвинутый"}
                </Badge>
                <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  {completedCount}/{totalLessons} уроков
                </span>
                <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {module.duration}
                </span>
              </div>

              <Progress value={completedCount} max={totalLessons} showLabel />
            </div>

            {/* Lessons List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Список уроков
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {module.lessons.map((lesson, index) => {
                    const isCompleted = !!completedLessons[lesson.id];
                    return (
                      <Link
                        key={lesson.id}
                        href={`/modules/${moduleId}/lessons/${lesson.id}`}
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                          isCompleted
                            ? "border-[var(--accent-green)]/30 bg-[var(--accent-green)]/5"
                            : "border-[var(--border-primary)] hover:border-[var(--accent-green)]/50 hover:bg-[var(--bg-tertiary)]"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isCompleted
                            ? "bg-[var(--accent-green)]"
                            : "bg-[var(--bg-tertiary)]"
                        }`}>
                          {isCompleted ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-sm font-medium text-[var(--text-muted)]">
                              {index + 1}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-[var(--text-primary)]">
                              {lesson.title}
                            </h3>
                            {isCompleted && (
                              <Badge variant="green" className="text-xs">Пройдено</Badge>
                            )}
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] line-clamp-1">
                            {lesson.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {lesson.duration}
                          </span>
                          <ChevronRight className="w-5 h-5 text-[var(--text-muted)]" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
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
