"use client";

import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ModuleCard } from "@/components/practicum/practicum-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Database, Terminal, Shield, GitBranch, BookOpen, Clock, CheckCircle, HelpCircle } from "lucide-react";

export default function ModulesPage() {
  const modules = [
    {
      id: 1,
      title: "Основы потоковой репликации",
      description: "Настройка мастера и реплики, проверка синхронизации",
      lessonsCount: 8,
      completedLessons: 0,
      difficulty: "intermediate",
      duration: "4 часа",
      icon: <Database className="w-6 h-6 text-[var(--accent-green)]" />,
    },
    {
      id: 2,
      title: "Физические слоты репликации",
      description: "Создание и управление слотами, мониторинг активности",
      lessonsCount: 6,
      completedLessons: 0,
      difficulty: "advanced",
      duration: "3 часа",
      icon: <Terminal className="w-6 h-6 text-[var(--accent-blue)]" />,
    },
    {
      id: 3,
      title: "TLS и безопасность",
      description: "Настройка шифрования, сертификаты, pg_hba.conf",
      lessonsCount: 7,
      completedLessons: 0,
      difficulty: "advanced",
      duration: "3.5 часа",
      icon: <Shield className="w-6 h-6 text-[var(--accent-orange)]" />,
    },
    {
      id: 4,
      title: "Failover и pg_rewind",
      description: "Повышение реплики, возврат старого мастера",
      lessonsCount: 9,
      completedLessons: 0,
      difficulty: "advanced",
      duration: "5 часов",
      icon: <GitBranch className="w-6 h-6 text-[var(--accent-red)]" />,
    },
  ];

  const totalLessons = modules.reduce((acc, m) => acc + m.lessonsCount, 0);
  const completedLessons = modules.reduce((acc, m) => acc + m.completedLessons, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules" active>Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/glossary">Глоссарий</NavLink>
        <NavLink href="/help">Справка</NavLink>
        <NavLink href="/admin">Управление</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Модули практикума
          </h1>
          <p className="text-[var(--text-secondary)]">
            Полный курс по физическому резервированию кластера PostgreSQL
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                  Общий прогресс
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {completedLessons} из {totalLessons} уроков завершено
                </p>
              </div>
              <Badge variant="blue">
                {Math.round((completedLessons / totalLessons) * 100)}%
              </Badge>
            </div>
            <Progress value={completedLessons} max={totalLessons} showLabel />
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => (
            <Card key={module.id} hover className="cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                      {module.icon}
                    </div>
                    <div>
                      <CardTitle>{module.title}</CardTitle>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant={
                    module.difficulty === "beginner" ? "green" :
                    module.difficulty === "intermediate" ? "orange" : "red"
                  }>
                    {module.difficulty === "beginner" ? "Начальный" :
                     module.difficulty === "intermediate" ? "Средний" : "Продвинутый"}
                  </Badge>
                  <span className="text-sm text-[var(--text-muted)] flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {module.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] mb-3">
                  <span>{module.completedLessons}/{module.lessonsCount} уроков</span>
                  <span>{Math.round((module.completedLessons / module.lessonsCount) * 100)}%</span>
                </div>

                <Progress value={module.completedLessons} max={module.lessonsCount} />

                <div className="mt-4 pt-4 border-t border-[var(--border-primary)]">
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.lessonsCount} уроков</span>
                    <span className="mx-2">•</span>
                    <CheckCircle className="w-4 h-4" />
                    <span>{module.completedLessons} завершено</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <section className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>О практикуме</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-green)] flex items-center justify-center mx-auto mb-3">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">Потоковая репликация</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Настройка master standby с физическим слотом
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-blue)] flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">Безопасность</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    TLS шифрование и настройка pg_hba.conf
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-orange)] flex items-center justify-center mx-auto mb-3">
                    <GitBranch className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-[var(--text-primary)] mb-1">Отказоустойчивость</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Failover и pg_rewind для восстановления
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] z-50">
        <div className="grid grid-cols-6 py-2">
          <a href="/" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--text-muted)]">
            <Database className="w-4 h-4" />
            <span className="text-[10px]">Практикум</span>
          </a>
          <a href="/modules" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--accent-green)]">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px]">Модули</span>
          </a>
          <a href="/reference" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--text-muted)]">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px]">Справочник</span>
          </a>
          <a href="/glossary" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--text-muted)]">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px]">Глоссарий</span>
          </a>
          <a href="/help" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--text-muted)]">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px]">Справка</span>
          </a>
          <a href="/admin" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--text-muted)]">
            <Shield className="w-4 h-4" />
            <span className="text-[10px]">Управление</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
