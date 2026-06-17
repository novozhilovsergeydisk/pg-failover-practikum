"use client";

import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PracticumCard, ModuleCard } from "@/components/practicum/practicum-card";
import { Terminal, BookOpen, Database, Shield, GitBranch, Settings, HelpCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/" active>Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/glossary">Глоссарий</NavLink>
        <NavLink href="/help">Справка</NavLink>
        <NavLink href="/admin">Управление</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-green)] flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                PostgreSQL Practikum
              </h1>
              <p className="text-[var(--text-secondary)]">
                Физическое резервирование кластера
              </p>
            </div>
          </div>
          <p className="text-lg text-[var(--text-secondary)] max-w-3xl">
            Учебный стенд для отработки физического резервирования кластера PostgreSQL 
            с одного сервера (мастер, источник) на другой (реплика, standby) через 
            потоковую репликацию с физическим слотом и TLS.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[var(--accent-green)]" />
            Быстрый старт
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PracticumCard
              title="Установка стенда"
              description="Подготовка серверов и запуск учебного кластера PostgreSQL"
              difficulty="beginner"
              status="available"
              icon={<Settings className="w-5 h-5 text-[var(--accent-blue)]" />}
            />
            <PracticumCard
              title="Настройка репликации"
              description="Создание мастера, реплики и настройка потоковой репликации"
              difficulty="intermediate"
              status="available"
              icon={<GitBranch className="w-5 h-5 text-[var(--accent-orange)]" />}
            />
            <PracticumCard
              title="Failover и резервирование"
              description="Отказоустойчивость и автоматическое переключение"
              difficulty="advanced"
              status="available"
              icon={<Shield className="w-5 h-5 text-[var(--accent-red)]" />}
            />
          </div>
        </section>

        {/* Modules */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[var(--accent-blue)]" />
            Модули практикума
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModuleCard
              title="Основы потоковой репликации"
              description="Настройка мастера и реплики, проверка синхронизации"
              lessonsCount={8}
              completedLessons={0}
              icon={<Database className="w-6 h-6 text-[var(--accent-green)]" />}
            />
            <ModuleCard
              title="Физические слоты репликации"
              description="Создание и управление слотами, мониторинг активности"
              lessonsCount={6}
              completedLessons={0}
              icon={<Terminal className="w-6 h-6 text-[var(--accent-blue)]" />}
            />
            <ModuleCard
              title="TLS и безопасность"
              description="Настройка шифрования, сертификаты, pg_hba.conf"
              lessonsCount={7}
              completedLessons={0}
              icon={<Shield className="w-6 h-6 text-[var(--accent-orange)]" />}
            />
            <ModuleCard
              title="Failover и pg_rewind"
              description="Повышение реплики, возврат старого мастера"
              lessonsCount={9}
              completedLessons={0}
              icon={<GitBranch className="w-6 h-6 text-[var(--accent-red)]" />}
            />
          </div>
        </section>

        {/* Architecture Diagram */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">
            Архитектура стенда
          </h2>
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-6 overflow-x-auto">
            <div className="font-mono text-xs sm:text-sm text-[var(--text-secondary)] min-w-[500px]">
              <pre className="m-0">
{`┌─────────────────────────────┐         ┌─────────────────────────────┐
│   MASTER (источник)         │         │   REPLICA (приёмник)         │
│   Кластер: training         │         │   Кластер: training         │
│   Порт: 5433                │  TLS    │   Порт: 5433                │
│   Слот: training_slot       │ ──────▶ │   pg_basebackup             │
│                             │         │   Стриминг WAL              │
└─────────────────────────────┘         └─────────────────────────────┘`}
              </pre>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] z-50">
        <div className="grid grid-cols-6 py-2">
          <a href="/" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--accent-green)]">
            <Database className="w-4 h-4" />
            <span className="text-[10px]">Практикум</span>
          </a>
          <a href="/modules" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--text-muted)]">
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
            <Settings className="w-4 h-4" />
            <span className="text-[10px]">Управление</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
