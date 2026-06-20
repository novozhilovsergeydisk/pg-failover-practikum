"use client";

import { useState } from "react";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Terminal, Shield, GitBranch } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password, rememberMe);
    if (result.success) {
      window.location.href = "/";
    } else {
      setError(result.error || "Ошибка входа");
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
              Добро пожаловать
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Войдите в свой аккаунт, чтобы продолжить обучение по физическому резервированию кластера PostgreSQL.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-green)] flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Потоковая репликация</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Настройка master standby</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-blue)] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Практические задания</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Реальные команды и сценарии</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-orange)] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Безопасность</h3>
                  <p className="text-sm text-[var(--text-secondary)]">TLS и pg_hba.conf</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-red)] flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium text-[var(--text-primary)]">Failover</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Отказоустойчивость и pg_rewind</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Вход в систему</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-md bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm">
                      {error}
                    </div>
                  )}
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
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--accent-green)] focus:ring-[var(--accent-green)]"
                      />
                      <span className="text-sm text-[var(--text-secondary)]">Запомнить меня</span>
                    </label>
                    <Link href="/forgot-password" className="text-sm text-[var(--accent-blue)] hover:underline">
                      Забыли пароль?
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Вход..." : "Войти"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border-primary)]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-[var(--bg-secondary)] text-[var(--text-muted)]">или</span>
                  </div>
                </div>

                <a
                  href="/api/auth/github"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-[var(--border-primary)] rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-[var(--text-primary)] font-medium">Войти через GitHub</span>
                </a>

                <div className="mt-6 text-center">
                  <p className="text-sm text-[var(--text-muted)]">
                    Нет аккаунта?{" "}
                    <Link href="/register" className="text-[var(--accent-green)] hover:underline">
                      Зарегистрироваться
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
