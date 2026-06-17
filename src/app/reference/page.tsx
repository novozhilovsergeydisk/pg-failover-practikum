"use client";

import { Header, NavLink } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandBlock } from "@/components/practicum/command-block";
import { CodeBlock } from "@/components/ui/code-block";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Database, Shield, GitBranch, Search, BookOpen, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function ReferencePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const commands = [
    {
      category: "Управление кластером",
      icon: <Database className="w-4 h-4" />,
      items: [
        {
          name: "pg_lsclusters",
          description: "Показать список кластеров PostgreSQL",
          command: "pg_lsclusters",
          output: "Ver Cluster Port Status Owner Data directory               Log file\n16  training 5433 online postgres /var/lib/postgresql/16/training /var/log/postgresql/postgresql-16-training.log",
        },
        {
          name: "pg_ctlcluster",
          description: "Управление кластером (старт/стоп/рестарт)",
          command: "sudo pg_ctlcluster 16 training start",
        },
        {
          name: "pg_createcluster",
          description: "Создание нового кластера",
          command: "sudo pg_createcluster 16 training -- --auth-local=peer --auth-host=md5",
        },
        {
          name: "pg_dropcluster",
          description: "Удаление кластера",
          command: "sudo pg_dropcluster 16 training --stop",
        },
      ],
    },
    {
      category: "Репликация",
      icon: <GitBranch className="w-4 h-4" />,
      items: [
        {
          name: "pg_basebackup",
          description: "Создание базовой копии для реплики",
          command: "sudo -u postgres pg_basebackup -h MASTER_HOST -p 5433 -D /var/lib/postgresql/16/training -U replicator -Fp -Xs -P -R",
        },
        {
          name: "pg_rewind",
          description: "Синхронизация узла после failover",
          command: "sudo -u postgres pg_rewind --target-pgdata=/var/lib/postgresql/16/training --source-server='host=NEW_MASTER port=5433 user=replicator dbname=postgres' --progress",
        },
        {
          name: "pg_stat_replication",
          description: "Просмотр состояния репликации на мастере",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn FROM pg_stat_replication;\"",
        },
        {
          name: "pg_stat_wal_receiver",
          description: "Просмотр состояния WAL-приёмника на реплике",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT status, receive_start_lsn, received_lsn, last_msg_send_time FROM pg_stat_wal_receiver;\"",
        },
        {
          name: "Проверка подключения к реплике",
          description: "Тест подключения к реплике через psql",
          command: "sudo -u postgres psql -h REPLICA_HOST -p 5433 -U replicator -c \"SELECT pg_is_in_recovery();\"",
          output: " pg_is_in_recovery \n---------------------\n t\n(1 row)",
        },
        {
          name: "Тест записи на мастере",
          description: "Проверка записи данных на мастере",
          command: "sudo -u postgres psql -p 5433 -c \"INSERT INTO repl_demo(note) VALUES ('test record'); SELECT * FROM repl_demo;\"",
        },
        {
          name: "Проверка чтения на реплике",
          description: "Проверка чтения данных на реплике",
          command: "sudo -u postgres psql -h REPLICA_HOST -p 5433 -c \"SELECT * FROM repl_demo;\"",
          output: " id |    note     |          created_at          \n----+-------------+------------------------------\n  1 | test record | 2024-01-15 10:30:00+00\n(1 row)",
        },
        {
          name: "Проверка записи на реплике",
          description: "Попытка записи на реплику (должна вернуть ошибку)",
          command: "sudo -u postgres psql -h REPLICA_HOST -p 5433 -c \"INSERT INTO repl_demo(note) VALUES ('should fail');\"",
          output: "ERROR:  cannot execute INSERT in a read-only transaction",
        },
      ],
    },
    {
      category: "Безопасность",
      icon: <Shield className="w-4 h-4" />,
      items: [
        {
          name: "Создание роли репликации",
          description: "Создание роли с атрибутом REPLICATION",
          command: "sudo -u postgres psql -p 5433 -c \"CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'your_password';\"",
        },
        {
          name: "Создание слота",
          description: "Создание физического слота репликации",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT pg_create_physical_replication_slot('training_slot');\"",
        },
        {
          name: "Просмотр слотов",
          description: "Проверка активности слотов репликации",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT slot_name, active, restart_lsn FROM pg_replication_slots;\"",
        },
        {
          name: "Настройка pg_hba.conf",
          description: "Добавление правила для репликации",
          command: "echo 'hostssl replication replicator REPLICA_HOST/32 scram-sha-256' | sudo tee -a /etc/postgresql/16/training/pg_hba.conf",
        },
        {
          name: "Генерация самоподписанного сертификата",
          description: "Создание TLS-сертификата для шифрования",
          command: "sudo -u postgres openssl req -new -x509 -days 365 -nodes -text -out server.crt -keyout server.key -subj \"/CN=MASTER_HOST\"",
        },
        {
          name: "Проверка сертификата",
          description: "Просмотр информации о сертификате",
          command: "sudo -u postgres openssl x509 -in server.crt -text -noout | head -20",
        },
        {
          name: "Копирование сертификата на реплику",
          description: "Передача сертификата мастера на реплику",
          command: "scp /var/lib/postgresql/16/training/server.crt REPLICA_HOST:/tmp/master-server.crt",
        },
        {
          name: "Проверка прав доступа",
          description: "Просмотр правил pg_hba.conf",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT type, database, user_name, address, method FROM pg_hba_file_rules WHERE type = 'host';\"",
        },
      ],
    },
    {
      category: "Мониторинг",
      icon: <Search className="w-4 h-4" />,
      items: [
        {
          name: "Проверка WAL",
          description: "Просмотр сегментов WAL",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT * FROM pg_ls_waldir() ORDER BY modification DESC LIMIT 10;\"",
        },
        {
          name: "Проверка размера БД",
          description: "Просмотр размера базы данных",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) FROM pg_database ORDER BY pg_database_size(pg_database.datname) DESC;\"",
        },
        {
          name: "Просмотр конфигурации",
          description: "Проверка параметров репликации",
          command: "sudo -u postgres psql -p 5433 -c \"SHOW wal_level; SHOW max_wal_senders; SHOW hot_standby;\"",
        },
        {
          name: "Логи репликации",
          description: "Просмотр логов кластера",
          command: "tail -f /var/log/postgresql/postgresql-16-training.log",
        },
        {
          name: "Проверка отставания реплики",
          description: "Расчет отставания реплики в секундах",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT CASE WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0 ELSE EXTRACT(EPOCH FROM now() - pg_last_xact_replay_timestamp())::int END AS lag_seconds;\"",
          output: " lag_seconds \n-------------\n           0\n(1 row)",
        },
        {
          name: "Просмотр активных запросов",
          description: "Мониторинг активных соединений",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT pid, usename, application_name, state, query_start, left(query, 50) AS query FROM pg_stat_activity WHERE state = 'active';\"",
        },
        {
          name: "Проверка размера WAL",
          description: "Просмотр текущего размера WAL",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), '0/0')) AS wal_size;\"",
        },
        {
          name: "Проверка replication slots",
          description: "Детальная информация о слотах",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT slot_name, plugin, slot_type, database, active, xmin, catalog_xmin, restart_lsn, confirmed_flush_lsn FROM pg_replication_slots;\"",
        },
        {
          name: "Проверка конфигурации",
          description: "Просмотр всех параметров репликации",
          command: "sudo -u postgres psql -p 5433 -c \"SELECT name, setting, unit, category FROM pg_settings WHERE name IN ('wal_level', 'max_wal_senders', 'wal_keep_size', 'hot_standby', 'wal_log_hints', 'max_replication_slots');\"",
        },
      ],
    },
  ];

  const filteredCommands = commands.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.items.length > 0);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header>
        <NavLink href="/">Практикум</NavLink>
        <NavLink href="/modules">Модули</NavLink>
        <NavLink href="/reference" active>Справочник</NavLink>
        <NavLink href="/glossary">Глоссарий</NavLink>
        <NavLink href="/help">Справка</NavLink>
        <NavLink href="/admin">Управление</NavLink>
      </Header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Справочник команд
          </h1>
          <p className="text-[var(--text-secondary)]">
            Все команды PostgreSQL для практикума по репликации
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Поиск команд..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>

        {/* Command Categories */}
        <div className="space-y-8">
          {filteredCommands.map((category, index) => (
            <section key={index}>
              <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                {category.icon}
                {category.category}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {category.items.map((item, itemIndex) => (
                  <Card key={itemIndex} hover>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <Badge variant="blue">{item.command.split(" ")[0]}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[var(--text-secondary)] mb-4">
                        {item.description}
                      </p>
                      <CommandBlock
                        command={item.command}
                        output={item.output}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* SQL Reference */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[var(--accent-green)]" />
            Полезные SQL-запросы
          </h2>
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="replication" className="w-full">
                <div className="border-b border-[var(--border-primary)] px-4">
                  <TabsList className="h-12">
                    <TabsTrigger value="replication" className="text-sm">Репликация</TabsTrigger>
                    <TabsTrigger value="monitoring" className="text-sm">Мониторинг</TabsTrigger>
                    <TabsTrigger value="management" className="text-sm">Управление</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="replication" className="p-4">
                  <CodeBlock language="sql">
{`-- Проверка состояния репликации на мастере
SELECT
  client_addr,
  state,
  sent_lsn,
  write_lsn,
  flush_lsn,
  replay_lsn,
  (sent_lsn - replay_lsn) AS replication_lag
FROM pg_stat_replication;

-- Просмотр слотов репликации
SELECT
  slot_name,
  active,
  restart_lsn,
  confirmed_flush_lsn
FROM pg_replication_slots;

-- Создание тестовой таблицы для проверки
CREATE TABLE repl_demo (
  id SERIAL PRIMARY KEY,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Проверка роли репликации
SELECT rolname, rolsuper, rolinherit, rolreplication, rolcanlogin
FROM pg_roles
WHERE rolname = 'replicator';

-- Проверка pg_hba.conf для репликации
SELECT type, database, user_name, address, method
FROM pg_hba_file_rules
WHERE type = 'host' AND user_name = 'replicator';

-- Проверка WAL уровня
SHOW wal_level;
-- Должно быть: replica

-- Проверка максимального числа WAL-отправителей
SHOW max_wal_senders;
-- Рекомендуется: 10 или больше

-- Проверка hot_standby (для чтения на реплике)
SHOW hot_standby;
-- Должно быть: on`}
                  </CodeBlock>
                </TabsContent>
                <TabsContent value="monitoring" className="p-4">
                  <CodeBlock language="sql">
{`-- Размер базы данных
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) AS size
FROM pg_database
ORDER BY pg_database_size(datname) DESC;

-- Активные соединения
SELECT
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start
FROM pg_stat_activity
WHERE backend_type = 'client backend';

-- Статус WAL
SELECT
  pg_current_wal_lsn() AS current_lsn,
  pg_walfile_name(pg_current_wal_lsn()) AS current_wal_file;

-- Проверка отставания реплики (на реплике)
SELECT
  CASE
    WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0
    ELSE EXTRACT(EPOCH FROM now() - pg_last_xact_replay_timestamp())::int
  END AS lag_seconds;

-- Проверка размера WAL-директории
SELECT
  count(*) AS wal_files,
  pg_size_pretty(sum(size)) AS total_size
FROM pg_ls_waldir();

-- Проверка использования памяти
SELECT
  datname,
  pg_size_pretty(pg_database_size(datname)) AS database_size,
  pg_size_pretty(pg_total_relation_size(relid)) AS total_size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 10;`}
                  </CodeBlock>
                </TabsContent>
                <TabsContent value="management" className="p-4">
                  <CodeBlock language="sql">
{`-- Перезагрузка конфигурации
SELECT pg_reload_conf();

-- Проверка параметра
SHOW wal_level;
SHOW max_wal_senders;
SHOW hot_standby;

-- Просмотр конфигурационных файлов
SHOW config_file;
SHOW hba_file;
SHOW data_directory;

-- Создание слота репликации
SELECT pg_create_physical_replication_slot('my_slot');

-- Удаление слота репликации
SELECT pg_drop_replication_slot('my_slot');

-- Проверка версии PostgreSQL
SELECT version();

-- Проверка времени работы сервера
SELECT now() - pg_postmaster_start_time() AS uptime;

-- Просмотр используемых расширений
SELECT * FROM pg_extension;`}
                  </CodeBlock>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] z-50">
        <div className="grid grid-cols-6 py-2">
          <a href="/" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--text-muted)]">
            <Database className="w-4 h-4" />
            <span className="text-[10px]">Практикум</span>
          </a>
          <a href="/modules" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--text-muted)]">
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px]">Модули</span>
          </a>
          <a href="/reference" className="flex flex-col items-center gap-1 px-1 py-2 text-[var(--accent-green)]">
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
            <Shield className="w-4 h-4" />
            <span className="text-[10px]">Управление</span>
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
