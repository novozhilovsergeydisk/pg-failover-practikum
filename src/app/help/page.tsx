"use client";

import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  BookOpen, Database, Terminal, Shield, GitBranch,
  User, Settings, HelpCircle, CheckCircle, AlertTriangle
} from "lucide-react";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/glossary">Глоссарий</NavLink>
        <NavLink href="/help" active>Справка</NavLink>
      </Header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Справка по сайту
          </h1>
          <p className="text-[var(--text-secondary)]">
            Подробное руководство по использованию практикума
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--accent-green)]" />
              Быстрый старт
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-green)] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">1</div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Зарегистрируйтесь</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Перейдите на страницу регистрации, введите имя, email и пароль. Пароль должен быть не менее 6 символов.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-green)] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">2</div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Выберите модуль</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Начните с модуля «Основы потоковой репликации». Каждый модуль содержит пошаговые инструкции.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-green)] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">3</div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Выполняйте команды</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Копируйте команды и выполняйте их на своих серверах. Сравнивайте вывод с ожидаемым.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[var(--accent-green)] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">4</div>
              <div>
                <h4 className="font-medium text-[var(--text-primary)]">Отслеживайте прогресс</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  В профиле отображается ваш прогресс по модулям и урокам.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[var(--accent-blue)]" />
              Часто задаваемые вопросы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Сколько серверов нужно для практикума?</AccordionTrigger>
                <AccordionContent>
                  Минимум два сервера (или виртуальные машины) с одинаковой версией PostgreSQL. Один будет мастером, другой — репликой. Можно использовать одну машину с двумя кластерами на разных портах для обучения.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Какую версию PostgreSQL использовать?</AccordionTrigger>
                <AccordionContent>
                  Рекомендуется PostgreSQL 14 или новее. В конфигурации по умолчанию указана версия 16. Главное — одинаковая версия на обоих серверах для физической репликации.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Что такое учебный кластер «training»?</AccordionTrigger>
                <AccordionContent>
                  Это отдельный экземпляр PostgreSQL, работающий на порту 5433. Он не затрагивает системный кластер (порт 5432) и боевые данные. Все скрипты работают только с кластером «training» благодаря предохранителям.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Можно ли повторять практику多次?</AccordionTrigger>
                <AccordionContent>
                  Да! Используйте скрипт teardown.sh для удаления учебного кластера, затем запускайте create-master.sh и create-replica.sh заново. Порядок: сначала на реплике, потом на мастере.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Как работает TLS в практикуме?</AccordionTrigger>
                <AccordionContent>
                  create-master.sh генерирует самоподписанный сертификат. Для verify-ca/verify-full нужно скопировать сертификат на реплику. Рекомендуется SSLMODE=verify-ca для защиты от MITM-атак.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger>Что делать, если реплика не подключается?</AccordionTrigger>
                <AccordionContent>
                  Проверьте: 1) Firewall — открыт ли порт 5433; 2) pg_hba.conf на мастере — есть ли правило hostssl replication; 3) Пароль роли replicator; 4) Наличие сертификата на реплике; 5) Логи в /var/log/postgresql/.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger>Как проверить отставание реплики?</AccordionTrigger>
                <AccordionContent>
                  На мастере: SELECT * FROM pg_stat_replication; — смотрите replay_lsn. На реплике: SELECT CASE WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0 ELSE EXTRACT(EPOCH FROM now() - pg_last_xact_replay_timestamp())::int END AS lag_seconds;
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8">
                <AccordionTrigger>Что такое pg_rewind и когда его использовать?</AccordionTrigger>
                <AccordionContent>
                  pg_rewind — утилита для быстрой синхронизации узла после failover. Она копирует только изменившуюся часть данных вместо полного копирования. Используется при возврате старого мастера как новой реплики. Требует wal_log_hints=on.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Navigation Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[var(--accent-orange)]" />
              Навигация по сайту
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-[var(--accent-green)]" />
                  <h4 className="font-medium text-[var(--text-primary)]">Практикум (/)</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Главная страница с обзором курса, модулями и архитектурой стенда.
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-[var(--accent-blue)]" />
                  <h4 className="font-medium text-[var(--text-primary)]">Модули (/modules)</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Список всех модулей с прогрессом. Каждый модуль содержит уроки.
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal className="w-5 h-5 text-[var(--accent-orange)]" />
                  <h4 className="font-medium text-[var(--text-primary)]">Справочник (/reference)</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Все команды PostgreSQL с примерами. Можно копировать команды.
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-[var(--accent-purple)]" />
                  <h4 className="font-medium text-[var(--text-primary)]">Профиль (/profile)</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Ваш прогресс, статистика и последняя активность.
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-[var(--accent-red)]" />
                  <h4 className="font-medium text-[var(--text-primary)]">Управление (/admin)</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Панель администратора: пользователи, модули, статус серверов.
                </p>
              </div>

              <div className="p-4 bg-[var(--bg-secondary)] rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-5 h-5 text-[var(--accent-green)]" />
                  <h4 className="font-medium text-[var(--text-primary)]">Справка (/help)</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  Это руководство. Ответы на частые вопросы и инструкции.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[var(--accent-orange)]" />
              Полезные советы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--accent-green)] shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)]">
                <strong>Используйте терминальный стиль.</strong> Сайт оформлен в стиле терминала — это помогает сосредоточиться на командах.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--accent-green)] shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)]">
                <strong>Копируйте команды.</strong> Нажимайте иконку копирования рядом с каждой командой.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--accent-green)] shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)]">
                <strong>Проверяйте вывод.</strong> Сравнивайте результат выполнения команд с ожидаемым выводом.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--accent-green)] shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)]">
                <strong>Изучайте глоссарий.</strong> Если встречается незнакомый термин — загляните в глоссарий.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[var(--accent-green)] shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--text-secondary)]">
                <strong>Не бойтесь ошибок.</strong> Учебный кластер можно пересоздать скриптом teardown.sh.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
