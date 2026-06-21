"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Award, Calendar, TrendingUp, Target, Flame, ArrowRight } from "lucide-react";

const MODULES = [
  { id: 1, title: "Основы потоковой репликации", lessonsCount: 8 },
  { id: 2, title: "Физические слоты репликации", lessonsCount: 6 },
  { id: 3, title: "TLS и безопасность", lessonsCount: 7 },
  { id: 4, title: "Failover и pg_rewind", lessonsCount: 9 },
];

interface Stats {
  totalCompleted: number;
  totalLessons: number;
  totalModules: number;
  completedModules: number;
  moduleStats: Record<number, { completed: number; firstDate: string | null; lastDate: string | null }>;
  streak: number;
  activeDays: number;
  recentActivity: { moduleId: number; lessonId: number; completedAt: string }[];
}

export default function StatsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const percent = stats ? Math.round((stats.totalCompleted / stats.totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/stats" active>Статистика</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Статистика обучения
          </h1>
          <p className="text-[var(--text-secondary)]">
            Ваш прогресс и достижения
          </p>
        </div>

        {loading ? (
          <p className="text-[var(--text-muted)] text-center py-8">Загрузка...</p>
        ) : !stats ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--text-muted)] mb-4">Войдите, чтобы видеть статистику</p>
              <Link href="/login">
                <Button>Войти</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-green)]/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-[var(--accent-green)]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{percent}%</p>
                      <p className="text-xs text-[var(--text-muted)]">Общий прогресс</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue)]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[var(--accent-blue)]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalCompleted}/{stats.totalLessons}</p>
                      <p className="text-xs text-[var(--text-muted)]">Уроков пройдено</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange)]/10 flex items-center justify-center">
                      <Flame className="w-5 h-5 text-[var(--accent-orange)]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.streak}</p>
                      <p className="text-xs text-[var(--text-muted)]">Дней подряд</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple)]/10 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[var(--accent-purple)]" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{stats.activeDays}</p>
                      <p className="text-xs text-[var(--text-muted)]">Активных дней</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progress by Module */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Прогресс по модулям
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MODULES.map((module) => {
                      const moduleProgress = stats.moduleStats[module.id];
                      const completed = moduleProgress?.completed || 0;
                      const modulePercent = module.lessonsCount > 0 ? Math.round((completed / module.lessonsCount) * 100) : 0;
                      const isCompleted = completed >= module.lessonsCount;

                      return (
                        <div key={module.id}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[var(--text-primary)]">
                                {module.title}
                              </span>
                              {isCompleted && <Badge variant="green">Завершён</Badge>}
                            </div>
                            <span className="text-sm text-[var(--text-muted)]">
                              {completed}/{module.lessonsCount} ({modulePercent}%)
                            </span>
                          </div>
                          <div className="h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isCompleted ? "bg-[var(--accent-green)]" : "bg-[var(--accent-blue)]"
                              }`}
                              style={{ width: `${modulePercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Последняя активность
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentActivity.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] text-center py-4">
                      Пока нет активности
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {stats.recentActivity.map((activity, index) => {
                        const module = MODULES.find((m) => m.id === activity.moduleId);
                        const lesson = module?.lessonsCount ? `Урок ${activity.lessonId}` : "";
                        const date = new Date(activity.completedAt);
                        const timeStr = date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
                        const dateStr = date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

                        return (
                          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-tertiary)]">
                            <div>
                              <p className="text-sm font-medium text-[var(--text-primary)]">
                                {module?.title || `Модуль ${activity.moduleId}`}
                              </p>
                              <p className="text-xs text-[var(--text-muted)]">
                                Урок {activity.lessonId}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-[var(--text-muted)]">{dateStr}</p>
                              <p className="text-xs text-[var(--text-muted)]">{timeStr}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Overall Progress Bar */}
            <Card className="mt-8">
              <CardContent className="py-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-[var(--text-primary)]">
                      Общий прогресс курса
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {stats.totalCompleted} из {stats.totalLessons} уроков завершено
                    </p>
                  </div>
                  <Badge variant={percent === 100 ? "green" : "blue"}>
                    {percent}%
                  </Badge>
                </div>
                <div className="h-4 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percent === 100 ? "bg-[var(--accent-green)]" : "bg-[var(--accent-blue)]"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {percent === 100 && (
                  <p className="mt-4 text-sm text-[var(--accent-green)]">
                    Поздравляем! Вы завершили весь курс!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Continue Learning */}
            {percent < 100 && (
              <div className="mt-8 text-center">
                <Link href="/modules">
                  <Button size="lg">
                    Продолжить обучение
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
