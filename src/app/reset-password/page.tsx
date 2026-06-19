"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Terminal, Shield, GitBranch, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Токен не найден");
    }
  }, [token]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка сброса пароля");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Ошибка подключения к серверу");
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--accent-red)] mb-4">Недействительная ссылка для сброса пароля</p>
        <Link href="/forgot-password">
          <Button variant="secondary">Запросить новую ссылку</Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-[var(--accent-green)] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          Пароль обновлён
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Теперь вы можете войти с новым паролем.
        </p>
        <Link href="/login">
          <Button>Войти</Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm">
          {error}
        </div>
      )}
      <Input
        label="Новый пароль"
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
      <Button type="submit" className="w-full" disabled={loading || !token}>
        {loading ? "Сохранение..." : "Сохранить пароль"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
              Новый пароль
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Введите новый пароль для вашего аккаунта.
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

          {/* Right side - Reset Password Form */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Сброс пароля</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="text-center py-8">Загрузка...</div>}>
                  <ResetPasswordForm />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
