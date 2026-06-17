"use client";

import { useState } from "react";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Terminal, Shield, GitBranch } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      return;
    }

    setLoading(true);

    const result = await register(name, email, password);
    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error || "Ошибка регистрации");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Info */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
              Создайте аккаунт
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Зарегистрируйтесь, чтобы начать изучение физического резервирования кластера PostgreSQL.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-green)] flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">30+ практических заданий</h3>
                  <p className="text-sm text-[var(--text-secondary)]">От базовых до продвинутых сценариев</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue)] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Интерактивная среда</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Выполняйте команды прямо в браузере</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange)] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Прогресс и сертификаты</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Отслеживайте прогресс и получайте награды</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-red)] flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Реальные сценарии</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Failover, pg_rewind, безопасность</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Register Form */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Регистрация</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-md bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm">
                      {error}
                    </div>
                  )}
                  <Input
                    label="Имя"
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    label="Пароль"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Input
                    label="Подтвердите пароль"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-[var(--text-muted)]">
                    Уже есть аккаунт?{" "}
                    <Link href="/login" className="text-[var(--accent-green)] hover:underline">
                      Войти
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
