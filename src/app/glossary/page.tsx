"use client";

import { useState } from "react";
import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, BookOpen, Database, Terminal, Shield, GitBranch } from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: "basic" | "replication" | "security" | "commands";
}

const glossaryTerms: GlossaryTerm[] = [
  // Basic
  {
    term: "PostgreSQL",
    definition: "Свободная объектно-реляционная система управления базами данных (СУБД). Одна из самых функциональных и популярных СУБД в мире.",
    category: "basic",
  },
  {
    term: "Кластер PostgreSQL",
    definition: "Набор файлов данных и конфигурационных файлов, работающий как единый экземпляр PostgreSQL. Один сервер может управлять несколькими кластерами на разных портах.",
    category: "basic",
  },
  {
    term: "Порт",
    definition: "Сетевой порт, на котором слушает PostgreSQL. Стандартный порт — 5432. В нашем практикуме используется 5433 для учебного кластера.",
    category: "basic",
  },
  {
    term: "Роль (Role)",
    definition: "Именованный объект в PostgreSQL, который может представлять пользователя или группу. Роли имеют привилегии для доступа к базам данных и выполнения операций.",
    category: "basic",
  },
  {
    term: "pg_hba.conf",
    definition: "Файл конфигурации аутентификации PostgreSQL (Host-Based Authentication). Определяет, кто может подключаться, с каких адресов и каким методом аутентификации.",
    category: "basic",
  },
  {
    term: "postgresql.conf",
    definition: "Основной файл конфигурации PostgreSQL. Содержит параметры производительности, репликации, безопасности и другие настройки сервера.",
    category: "basic",
  },

  // Replication
  {
    term: "Репликация",
    definition: "Процесс копирования данных с одного сервера (мастер) на другой (реплика) для обеспечения отказоустойчивости и балансировки нагрузки на чтение.",
    category: "replication",
  },
  {
    term: "Мастер (Primary)",
    definition: "Основной сервер PostgreSQL, на котором выполняются все операции записи (INSERT, UPDATE, DELETE). Также называется master или primary.",
    category: "replication",
  },
  {
    term: "Реплика (Standby)",
    definition: "Резервный сервер PostgreSQL, получающий данные с мастера через репликацию. Используется для чтения и как запасной сервер при отказе мастера. Также называется replica или standby.",
    category: "replication",
  },
  {
    term: "Потоковая репликация",
    definition: "Тип репликации, при котором реплика подключается к мастеру и получает WAL-сегменты в реальном времени по сети. Обеспечивает минимальное отставание (lag).",
    category: "replication",
  },
  {
    term: "WAL (Write-Ahead Log)",
    definition: "Журнал предзаписи. Все изменения данных сначала записываются в WAL-файл, затем применяются к основным данным. Обеспечивает целостность данных и возможность репликации.",
    category: "replication",
  },
  {
    term: "pg_basebackup",
    definition: "Утилита для создания полной базовой копии кластера PostgreSQL. Используется для начальной синхронизации реплики с мастером.",
    category: "replication",
  },
  {
    term: "pg_rewind",
    definition: "Утилита для быстрой синхронизации узла после failover. Копирует только изменившуюся часть данных вместо полного копирования.",
    category: "replication",
  },
  {
    term: "Слот репликации",
    definition: "Именованный объект на мастере, отслеживающий позицию реплики в WAL-журнале. Гарантирует, что мастер не удалит WAL-сегменты, пока реплика их не получит.",
    category: "replication",
  },
  {
    term: "Failover",
    definition: "Процесс переключения на резервный сервер при отказе основного. При failover реплика повышается до мастера и начинает принимать записи.",
    category: "replication",
  },
  {
    term: "Failback",
    definition: "Процесс возврата старого мастера в кластер после его восстановления. Обычно выполняется через pg_rewind или повторное создание реплики.",
    category: "replication",
  },
  {
    term: "Lag (отставание)",
    definition: "Разница во времени или объёме данных между мастером и репликой. Измеряется в секундах (time lag) или байтах (byte lag).",
    category: "replication",
  },
  {
    term: "hot_standby",
    definition: "Параметр PostgreSQL, разрешающий выполнение запросов на чтение на реплике во время репликации. Должен быть включен для активного использования реплики.",
    category: "replication",
  },

  // Security
  {
    term: "TLS/SSL",
    definition: "Протоколы шифрования для защиты сетевого трафика. В PostgreSQL используется для шифрования соединений между мастером и репликой.",
    category: "security",
  },
  {
    term: "Сертификат",
    definition: "Электронный документ, подтверждающий право владения ключом шифрования. Используется для аутентификации серверов при TLS-соединениях.",
    category: "security",
  },
  {
    term: "SSLMODE",
    definition: "Параметр подключения PostgreSQL, определяющий уровень проверки сертификата: disable, allow, prefer, require, verify-ca, verify-full.",
    category: "security",
  },
  {
    term: "Self-signed certificate",
    definition: "Самоподписанный сертификат, созданный без участия центра сертификации (CA). Подходит для учебных и тестовых сред.",
    category: "security",
  },
  {
    term: "hostssl",
    definition: "Тип правила в pg_hba.conf, разрешающий подключения только по зашифрованному соединению (TLS/SSL).",
    category: "security",
  },
  {
    term: "REPLICATION",
    definition: "Атрибут роли PostgreSQL, разрешающий подключение для репликации. Роль с этим атрибутом может создавать слоты и получать WAL-данные.",
    category: "security",
  },

  // Commands
  {
    term: "pg_lsclusters",
    definition: "Команда для отображения списка всех кластеров PostgreSQL на сервере: версия, имя, порт, статус, путь к данным и логам.",
    category: "commands",
  },
  {
    term: "pg_ctlcluster",
    definition: "Команда для управления кластером PostgreSQL: запуск (start), остановка (stop), перезапуск (restart), перезагрузка конфигурации (reload).",
    category: "commands",
  },
  {
    term: "pg_createcluster",
    definition: "Команда для создания нового кластера PostgreSQL с указанием версии и имени.",
    category: "commands",
  },
  {
    term: "pg_dropcluster",
    definition: "Команда для удаления кластера PostgreSQL. Удаляет данные и конфигурацию.",
    category: "commands",
  },
  {
    term: "psql",
    definition: "Интерактивный командный интерфейс PostgreSQL для выполнения SQL-запросов и административных команд.",
    category: "commands",
  },
  {
    term: "pg_stat_replication",
    definition: "Системное представление (view) на мастере, показывающее состояние всех подключенных реплик: адрес, состояние, позицию WAL, отставание.",
    category: "commands",
  },
  {
    term: "pg_stat_wal_receiver",
    definition: "Системное представление на реплике, показывающее состояние WAL-приёмника: статус, полученные LSN, время последнего сообщения.",
    category: "commands",
  },
  {
    term: "pg_replication_slots",
    definition: "Системное представление, показывающее все слоты репликации: имя, тип, активность, позицию восстановления.",
    category: "commands",
  },
  {
    term: "SHOW",
    definition: "Команда SQL для отображения текущего значения параметра конфигурации. Например: SHOW wal_level;",
    category: "commands",
  },
  {
    term: "pg_reload_conf()",
    definition: "SQL-функция для перезагрузки конфигурации PostgreSQL без перезапуска сервера. Аналог pg_ctlcluster reload.",
    category: "commands",
  },
];

const categories = [
  { id: "all", label: "Все термины", icon: <BookOpen className="w-4 h-4" /> },
  { id: "basic", label: "Основы", icon: <Database className="w-4 h-4" /> },
  { id: "replication", label: "Репликация", icon: <GitBranch className="w-4 h-4" /> },
  { id: "security", label: "Безопасность", icon: <Shield className="w-4 h-4" /> },
  { id: "commands", label: "Команды", icon: <Terminal className="w-4 h-4" /> },
];

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/reference">Справочник</NavLink>
        <NavLink href="/glossary" active>Глоссарий</NavLink>
        <NavLink href="/help">Справка</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Глоссарий терминов
          </h1>
          <p className="text-[var(--text-secondary)]">
            Словарь основных понятий по PostgreSQL и репликации
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Поиск терминов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-[var(--accent-green)] text-white"
                    : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-primary)]"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Terms Count */}
        <div className="mb-4 text-sm text-[var(--text-muted)]">
          Найдено: {filteredTerms.length} из {glossaryTerms.length} терминов
        </div>

        {/* Glossary Terms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTerms.map((term, index) => (
            <Card key={index} hover>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{term.term}</CardTitle>
                  <span className="px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                    {categories.find((c) => c.id === term.category)?.label}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text-secondary)]">
                  {term.definition}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">
              Термины не найдены. Попробуйте изменить запрос или фильтр.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
