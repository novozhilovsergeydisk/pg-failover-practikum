"use client";

import { useState } from "react";
import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Database, Terminal, Shield, GitBranch, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка отправки");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Ошибка подключения к серверу");
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
              Восстановление пароля
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Введите email, указанный при регистрации. Мы отправим ссылку для сброса пароля.
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

          {/* Right side - Forgot Password Form */}
          <div className="order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle>Сброс пароля</CardTitle>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-[var(--accent-green)] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                      Письмо отправлено
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">
                      Если аккаунт с email <span className="font-medium">{email}</span> существует, 
                      на него будет отправлено письмо со ссылкой для сброса пароля.
                    </p>
                    <Link href="/login">
                      <Button variant="secondary">Вернуться к входу</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleForgotPassword} className="space-y-4">
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
                      <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Отправка..." : "Отправить ссылку"}
                      </Button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-[var(--text-muted)]">
                        Вспомнили пароль?{" "}
                        <Link href="/login" className="text-[var(--accent-green)] hover:underline">
                          Войти
                        </Link>
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
