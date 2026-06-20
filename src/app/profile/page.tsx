"use client";

import { useState, useEffect } from "react";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { User, BookOpen, Clock, Award, Settings, LogOut } from "lucide-react";

const MODULES = [
  { id: 1, title: "Основы потоковой репликации", lessonsCount: 8 },
  { id: 2, title: "Физические слоты репликации", lessonsCount: 6 },
  { id: 3, title: "TLS и безопасность", lessonsCount: 7 },
  { id: 4, title: "Failover и pg_rewind", lessonsCount: 9 },
];

const TOTAL_LESSONS = MODULES.reduce((acc, m) => acc + m.lessonsCount, 0);

interface ProgressData {
  [moduleId: number]: {
    total: number;
    completed: number;
    lessons: { [lessonId: number]: boolean };
  };
}

export default function ProfilePage() {
  const { userName, userEmail, userAvatar, token, logout } = useAuth();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/progress", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProgress(data.progress || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const totalCompleted = Object.values(progress).reduce(
    (acc, m) => acc + (m.completed || 0),
    0
  );

  const completedModules = MODULES.filter((module) => {
    const moduleProgress = progress[module.id];
    return moduleProgress && moduleProgress.completed >= module.lessonsCount;
  }).length;

  const stats = [
    { label: "Модулей завершено", value: `${completedModules} из ${MODULES.length}`, icon: <BookOpen className="w-5 h-5" /> },
    { label: "Уроков пройдено", value: `${totalCompleted} из ${TOTAL_LESSONS}`, icon: <Award className="w-5 h-5" /> },
    { label: "Прогресс", value: `${TOTAL_LESSONS > 0 ? Math.round((totalCompleted / TOTAL_LESSONS) * 100) : 0}%`, icon: <Clock className="w-5 h-5" /> },
    { label: "Текущий streak", value: "0 дней", icon: <Award className="w-5 h-5" /> },
  ];

  const user = {
    name: userName || "Пользователь",
    email: userEmail || "user@example.com",
    avatar: userAvatar,
    role: "Студент",
    lastActive: "Сейчас",
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/admin">Управление</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--accent-green)] flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {user.name}
              </h1>
              <p className="text-[var(--text-secondary)]">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="blue">{user.role}</Badge>
                <StatusIndicator status="online" label={user.lastActive} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--accent-green)]">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{stat.value}</p>
                    <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Прогресс по модулям</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">Загрузка...</p>
              ) : (
                <div className="space-y-4">
                  {MODULES.map((module) => {
                    const moduleProgress = progress[module.id];
                    const completed = moduleProgress?.completed || 0;
                    const percent = module.lessonsCount > 0 ? Math.round((completed / module.lessonsCount) * 100) : 0;

                    return (
                      <div key={module.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-[var(--text-primary)]">{module.title}</span>
                          <span className="text-sm text-[var(--text-muted)]">{percent}%</span>
                        </div>
                        <Progress value={completed} max={module.lessonsCount} />
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          {completed} из {module.lessonsCount} уроков
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Общий прогресс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="var(--border-primary)"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="var(--accent-green)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - totalCompleted / TOTAL_LESSONS)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-[var(--text-primary)]">
                      {TOTAL_LESSONS > 0 ? Math.round((totalCompleted / TOTAL_LESSONS) * 100) : 0}%
                    </span>
                  </div>
                </div>
                <p className="text-lg font-medium text-[var(--text-primary)]">
                  {totalCompleted} из {TOTAL_LESSONS} уроков
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {completedModules} из {MODULES.length} модулей завершено
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Настройки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary">
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки профиля
                </Button>
                <Button variant="secondary">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Мои сертификаты
                </Button>
                <Button variant="danger" onClick={() => { logout(); router.push("/"); }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
}
