"use client";

import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { User, BookOpen, Clock, Award, Settings, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { userName, userEmail, logout } = useAuth();
  const router = useRouter();

  const user = {
    name: userName || "Пользователь",
    email: userEmail || "user@example.com",
    role: "Студент",
    joinDate: "15 января 2024",
    lastActive: "Сейчас",
  };

  const stats = [
    { label: "Модулей завершено", value: "0 из 4", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Уроков пройдено", value: "0 из 30", icon: <Award className="w-5 h-5" /> },
    { label: "Время обучения", value: "0 часов", icon: <Clock className="w-5 h-5" /> },
    { label: "Текущий streak", value: "0 дней", icon: <Award className="w-5 h-5" /> },
  ];

  const recentActivity: { module: string; lesson: string; date: string; status: string }[] = [];

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
            <div className="w-16 h-16 rounded-full bg-[var(--accent-green)] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
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
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[var(--text-primary)]">Основы потоковой репликации</span>
                    <span className="text-sm text-[var(--text-muted)]">0%</span>
                  </div>
                  <Progress value={0} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[var(--text-primary)]">Физические слоты репликации</span>
                    <span className="text-sm text-[var(--text-muted)]">0%</span>
                  </div>
                  <Progress value={0} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[var(--text-primary)]">TLS и безопасность</span>
                    <span className="text-sm text-[var(--text-muted)]">0%</span>
                  </div>
                  <Progress value={0} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[var(--text-primary)]">Failover и pg_rewind</span>
                    <span className="text-sm text-[var(--text-muted)]">0%</span>
                  </div>
                  <Progress value={0} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Последняя активность</CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">Пока нет активности</p>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Модуль</TableHead>
                    <TableHead>Урок</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <span className="text-sm text-[var(--text-primary)]">{activity.module}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[var(--text-secondary)]">{activity.lesson}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          activity.status === "completed" ? "green" :
                          activity.status === "in-progress" ? "orange" : "blue"
                        }>
                          {activity.status === "completed" ? "Завершено" :
                           activity.status === "in-progress" ? "В процессе" : "Доступно"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              )}
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

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] z-50">
        <div className="flex justify-around py-2">
          <a href="/" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--text-muted)]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Практикум</span>
          </a>
          <a href="/modules" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--text-muted)]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Модули</span>
          </a>
          <a href="/reference" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--text-muted)]">
            <User className="w-5 h-5" />
            <span className="text-xs">Профиль</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
