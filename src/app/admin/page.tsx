"use client";

import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Terminal, Database, Users, Settings, Shield, Plus, Edit, Trash2, HelpCircle, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { isAdmin, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      router.push("/");
    }
  }, [isLoggedIn, isAdmin, router]);

  if (!isLoggedIn || !isAdmin) {
    return null;
  }
  const users = [
    { id: 1, name: "Иван Петров", email: "ivan@example.com", role: "student", status: "active", lastActive: "2 мин назад" },
    { id: 2, name: "Мария Сидорова", email: "maria@example.com", role: "student", status: "active", lastActive: "15 мин назад" },
    { id: 3, name: "Алексей Козлов", email: "alexey@example.com", role: "admin", status: "active", lastActive: "1 час назад" },
    { id: 4, name: "Елена Новикова", email: "elena@example.com", role: "student", status: "inactive", lastActive: "3 дня назад" },
  ];

  const modules = [
    { id: 1, title: "Основы потоковой репликации", lessons: 8, status: "published" },
    { id: 2, title: "Физические слоты репликации", lessons: 6, status: "published" },
    { id: 3, title: "TLS и безопасность", lessons: 7, status: "draft" },
    { id: 4, title: "Failover и pg_rewind", lessons: 9, status: "draft" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/glossary">Глоссарий</NavLink>
        <NavLink href="/help">Справка</NavLink>
        <NavLink href="/admin" active>Управление</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Панель управления
          </h1>
          <p className="text-[var(--text-secondary)]">
            Управление пользователями, модулями и настройками практикума
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-green)] flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">24</p>
                  <p className="text-xs text-[var(--text-muted)]">Студентов</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue)] flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">4</p>
                  <p className="text-xs text-[var(--text-muted)]">Модулей</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange)] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">30</p>
                  <p className="text-xs text-[var(--text-muted)]">Уроков</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-purple)] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[var(--text-primary)]">12</p>
                  <p className="text-xs text-[var(--text-muted)]">Завершили</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Пользователи</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Имя</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{user.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "purple" : "blue"}>
                          {user.role === "admin" ? "Админ" : "Студент"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator
                          status={user.status === "active" ? "online" : "offline"}
                          label={user.lastActive}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Modules Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Модули</CardTitle>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Создать
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Уроки</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>
                        <p className="font-medium text-[var(--text-primary)]">{module.title}</p>
                      </TableCell>
                      <TableCell>
                        <span className="text-[var(--text-secondary)]">{module.lessons}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={module.status === "published" ? "green" : "orange"}>
                          {module.status === "published" ? "Опубликован" : "Черновик"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Server Status */}
        <section className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Состояние серверов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-[var(--text-primary)]">Master (PRIMARY)</h3>
                    <StatusIndicator status="online" label="Online" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Хост:</span>
                      <span className="text-[var(--text-secondary)]">146.185.235.231</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Порт:</span>
                      <span className="text-[var(--text-secondary)]">5433</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Кластер:</span>
                      <span className="text-[var(--text-secondary)]">training</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Слот:</span>
                      <span className="text-[var(--accent-green)]">active</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-[var(--text-primary)]">Replica (STANDBY)</h3>
                    <StatusIndicator status="online" label="Streaming" />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Хост:</span>
                      <span className="text-[var(--text-secondary)]">89.127.200.68</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Порт:</span>
                      <span className="text-[var(--text-secondary)]">5433</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Кластер:</span>
                      <span className="text-[var(--text-secondary)]">training</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Отставание:</span>
                      <span className="text-[var(--accent-green)]">0 сек</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <MobileNav activePage="/admin" />
      <Footer />
    </div>
  );
}
