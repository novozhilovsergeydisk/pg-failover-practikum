"use client";

import { useState } from "react";
import { Header, NavLink, useAuth } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Send, CheckCircle } from "lucide-react";

const SUBJECTS = [
  { value: "bug", label: "Сообщение об ошибке" },
  { value: "suggestion", label: "Предложение по улучшению" },
  { value: "question", label: "Вопрос по материалу" },
  { value: "content", label: "Ошибка в контенте урока" },
  { value: "other", label: "Другое" },
];

export default function FeedbackPage() {
  const { userName, userEmail, token } = useAuth();
  const [name, setName] = useState(userName || "");
  const [email, setEmail] = useState(userEmail || "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!subject) {
      setError("Выберите тему обращения");
      return;
    }
    if (!message.trim()) {
      setError("Введите сообщение");
      return;
    }

    setSending(true);
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: name.trim(), email: email.trim(), subject, message: message.trim() }),
      });

      const data = await res.json();
      if (res.ok) {
        setSent(true);
      } else {
        setError(data.error || "Ошибка отправки");
      }
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/help">Справка</NavLink>
        <NavLink href="/feedback" active>Обратная связь</NavLink>
      </Header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Обратная связь
          </h1>
          <p className="text-[var(--text-secondary)]">
            Сообщите об ошибке, предложите улучшение или задайте вопрос
          </p>
        </div>

        {sent ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="w-12 h-12 text-[var(--accent-green)] mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                Сообщение отправлено
              </h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Спасибо! Мы рассмотрим ваше обращение и ответим при необходимости.
              </p>
              <Button variant="secondary" onClick={() => { setSent(false); setSubject(""); setMessage(""); }}>
                Отправить ещё
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[var(--accent-green)]" />
                Новое сообщение
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Имя
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Тема <span className="text-[var(--accent-red)]">*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)]"
                  >
                    <option value="">Выберите тему...</option>
                    {SUBJECTS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                    Сообщение <span className="text-[var(--accent-red)]">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 rounded-md border border-[var(--border-primary)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-green)] resize-y"
                    placeholder="Опишите вашу проблему, вопрос или предложение..."
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-md text-sm bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)]">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={sending || !subject || !message.trim()}>
                  {sending ? "Отправка..." : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Отправить
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
