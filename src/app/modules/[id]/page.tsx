"use client";

import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Sidebar, SidebarSection, SidebarLink } from "@/components/layout/sidebar";
import { CodeBlock } from "@/components/ui/code-block";
import { CommandBlock } from "@/components/practicum/command-block";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StepIndicator } from "@/components/ui/step-indicator";
import { StatusIndicator } from "@/components/ui/status-indicator";
import { Database, Terminal, BookOpen, CheckCircle, Circle, Clock } from "lucide-react";

export default function ModulePage() {
  const steps = [
    { id: 1, title: "Подготовка", completed: true },
    { id: 2, title: "Мастер", completed: true },
    { id: 3, title: "Реплика", current: true },
    { id: 4, title: "Проверка", completed: false },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules" active>Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/glossary">Глоссарий</NavLink>
        <NavLink href="/help">Справка</NavLink>
      </Header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <Sidebar className="hidden lg:block">
            <SidebarSection title="Основы потоковой репликации">
              <SidebarLink href="/modules/1" icon={<Circle className="w-4 h-4" />}>
                Введение
              </SidebarLink>
              <SidebarLink href="/modules/2" icon={<CheckCircle className="w-4 h-4" />}>
                Подготовка серверов
              </SidebarLink>
              <SidebarLink href="/modules/3" active icon={<Clock className="w-4 h-4" />}>
                Настройка мастера
              </SidebarLink>
              <SidebarLink href="/modules/4" icon={<Circle className="w-4 h-4" />}>
                Настройка реплики
              </SidebarLink>
              <SidebarLink href="/modules/5" icon={<Circle className="w-4 h-4" />}>
                Проверка репликации
              </SidebarLink>
            </SidebarSection>
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Module Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--accent-green)] flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                    Настройка мастера
                  </h1>
                  <p className="text-[var(--text-secondary)]">
                    Модуль 1: Основы потоковой репликации
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <Badge variant="green">Продвинутый</Badge>
                <StatusIndicator status="online" label="Активен" />
                <span className="text-sm text-[var(--text-muted)]">
                  <Clock className="w-4 h-4 inline mr-1" />
                  45 мин
                </span>
              </div>

              <Progress value={60} showLabel className="mb-4" />

              <StepIndicator steps={steps} />
            </div>

            {/* Lesson Content */}
            <div className="space-y-8">
              {/* Theory Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Теория</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--text-secondary)] mb-4">
                    Мастер (primary) — это основной сервер PostgreSQL, на котором выполняются 
                    все операции записи. Для настройки потоковой репликации необходимо:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                    <li>Включить запись WAL (Write-Ahead Log) на уровне репликации</li>
                    <li>Создать роль для репликации с атрибутом REPLICATION</li>
                    <li>Настроить物理ический слот репликации</li>
                    <li>Настроить pg_hba.conf для подключения реплики</li>
                    <li>Сгенерировать сертификат TLS для шифрования</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Practice Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Практика</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step 1 */}
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                      1. Подготовка конфигурации
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      Скопируйте шаблон конфигурации и отредактируйте его под ваши серверы:
                    </p>
                    <CommandBlock
                      command="cp config.env.example config.env"
                      description="Копирование шаблона конфигурации"
                    />
                  </div>

                  {/* Step 2 */}
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                      2. Создание учебного мастера
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      Запустите скрипт создания мастера на сервере-источнике:
                    </p>
                    <CommandBlock
                      command="sudo ./master/create-master.sh"
                      description="Создание учебного мастера"
                      output="[i] Загрузка конфигурации...
[i] Проверка предохранителей...
[i] Создание кластера training на порту 5433...
[i] Настройка postgresql.conf...
[i] Создание роли replicator...
[i] Создание слота training_slot...
[i] Генерация сертификата TLS...
[i] Настройка pg_hba.conf...
[+] Мастер успешно создан!"
                    />
                  </div>

                  {/* Step 3 */}
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                      3. Проверка конфигурации мастера
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      Убедитесь, что мастер работает корректно:
                    </p>
                    <CommandBlock
                      command="sudo pg_lsclusters"
                      description="Проверка списка кластеров"
                      output="Ver Cluster Port Status Owner Data directory               Log file
16  training 5433 online postgres /var/lib/postgresql/16/training /var/log/postgresql/postgresql-16-training.log"
                    />
                  </div>

                  {/* Step 4 */}
                  <div>
                    <h3 className="text-lg font-medium text-[var(--text-primary)] mb-3">
                      4. Проверка настроек репликации
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      Проверьте параметры репликации в postgresql.conf:
                    </p>
                    <CodeBlock language="sql" filename="postgresql.conf">
{`-- Проверка параметров репликации
SHOW wal_level;
-- replica

SHOW max_wal_senders;
-- 10

SHOW wal_keep_size;
-- 1024

SHOW hot_standby;
-- on`}
                    </CodeBlock>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Проверка</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Выполните команду проверки, чтобы убедиться, что мастер настроен правильно:
                  </p>
                  <CommandBlock
                    command="sudo ./verify.sh"
                    description="Проверка состояния стенда"
                    output="[i] Проверка мастера (порт 5433)...
[+] Кластер training: online
[+] Роль replicator: существует
[+] Слот training_slot: active=t
[+] pg_hba.conf: настроен для репликации
[+] TLS: сертификат сгенерирован"
                  />
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button variant="secondary">
                  ← Предыдущий урок
                </Button>
                <Button>
                  Следующий урок →
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] z-50">
        <div className="flex justify-around py-2">
          <a href="/" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--text-muted)]">
            <Database className="w-5 h-5" />
            <span className="text-xs">Практикум</span>
          </a>
          <a href="/modules" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--accent-green)]">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Модули</span>
          </a>
          <a href="/reference" className="flex flex-col items-center gap-1 px-3 py-2 text-[var(--text-muted)]">
            <Terminal className="w-5 h-5" />
            <span className="text-xs">Справочник</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
