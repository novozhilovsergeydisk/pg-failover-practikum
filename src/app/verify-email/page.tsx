"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Terminal, Shield, GitBranch, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Токен не найден в URL");
      return;
    }

    const verifyEmail = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Ошибка верификации");
        } else {
          setSuccess(true);
        }
      } catch {
        setError("Ошибка подключения к серверу");
      }
      setLoading(false);
    };

    verifyEmail();
  }, [token]);

  if (!token) {
    return (
      <div className="text-center py-8">
        <XCircle className="w-16 h-16 text-[var(--accent-red)] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          Токен не найден
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Ссылка для верификации содержит ошибку.
        </p>
        <Link href="/login">
          <Button>Вернуться к входу</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-[var(--accent-green)] border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-sm text-[var(--text-secondary)]">Подтверждение email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <XCircle className="w-16 h-16 text-[var(--accent-red)] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          Ошибка верификации
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">{error}</p>
        <Link href="/login">
          <Button>Вернуться к входу</Button>
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-[var(--accent-green)] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
          Email подтверждён
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-6">
          Теперь вы можете войти в свой аккаунт.
        </p>
        <Link href="/login">
          <Button>Войти</Button>
        </Link>
      </div>
    );
  }

  return null;
}

export default function VerifyEmailPage() {
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
              Подтверждение email
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Проверяем ваш email адрес для завершения регистрации.
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

          {/* Right side - Verify Email Form */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Верификация email</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div className="text-center py-8">Загрузка...</div>}>
                  <VerifyEmailForm />
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
