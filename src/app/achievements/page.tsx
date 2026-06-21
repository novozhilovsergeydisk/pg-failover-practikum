"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Lock, ArrowRight } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "progress" | "streak" | "module" | "special";
  requirement: string;
  earned: boolean;
}

interface AchievementsData {
  achievements: Achievement[];
  earnedCount: number;
  totalCount: number;
  streak: number;
  percent: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  progress: "Прогресс",
  module: "Модули",
  streak: "Серия",
  special: "Особые",
};

export default function AchievementsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/achievements", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const filtered = data?.achievements.filter(
    (a) => filter === "all" || (filter === "earned" ? a.earned : !a.earned)
  ) || [];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/stats">Статистика</NavLink>
        <NavLink href="/achievements" active>Достижения</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Достижения
          </h1>
          <p className="text-[var(--text-secondary)]">
            Собирайте бейджи за прохождение курса
          </p>
        </div>

        {loading ? (
          <p className="text-[var(--text-muted)] text-center py-8">Загрузка...</p>
        ) : !data ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-[var(--text-muted)] mb-4">Войдите, чтобы видеть достижения</p>
              <Link href="/login">
                <Button>Войти</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Overview */}
            <Card className="mb-8">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-[var(--text-primary)]">
                      Ваш прогресс
                    </h2>
                    <p className="text-sm text-[var(--text-muted)]">
                      {data.earnedCount} из {data.totalCount} достижений получено
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[var(--accent-green)]">{data.earnedCount}</p>
                      <p className="text-xs text-[var(--text-muted)]">Получено</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[var(--text-muted)]">{data.totalCount - data.earnedCount}</p>
                      <p className="text-xs text-[var(--text-muted)]">Осталось</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 h-3 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-green)] rounded-full transition-all"
                    style={{ width: `${(data.earnedCount / data.totalCount) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: "all", label: "Все" },
                { key: "earned", label: "Полученные" },
                { key: "locked", label: "Заблокированные" },
                ...Object.entries(CATEGORY_LABELS).map(([key, label]) => ({ key, label })),
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    filter === item.key
                      ? "bg-[var(--accent-green)] text-white"
                      : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`transition-all ${
                    achievement.earned
                      ? "border-[var(--accent-green)]/30 bg-[var(--accent-green)]/5"
                      : "opacity-60"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                        achievement.earned
                          ? "bg-[var(--accent-green)]/10"
                          : "bg-[var(--bg-tertiary)]"
                      }`}>
                        {achievement.earned ? achievement.icon : <Lock className="w-5 h-5 text-[var(--text-muted)]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-[var(--text-primary)]">
                            {achievement.title}
                          </h3>
                          {achievement.earned && <Badge variant="green">✓</Badge>}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {CATEGORY_LABELS[achievement.category]}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filtered.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-[var(--text-muted)]">
                    {filter === "earned" ? "Пока нет полученных достижений" : "Все достижения получены!"}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Continue Learning */}
            <div className="mt-8 text-center">
              <Link href="/modules">
                <Button size="lg">
                  Продолжить обучение
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
