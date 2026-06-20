export interface LessonContent {
  moduleId: number;
  lessonId: number;
  theory: string[];
  practice: PracticeStep[];
  verification: VerificationStep[];
}

export interface PracticeStep {
  title: string;
  description: string;
  command: string;
  output?: string;
}

export interface VerificationStep {
  description: string;
  command: string;
  expectedOutput: string;
}

export const LESSON_CONTENT: LessonContent[] = [
  // Module 1
  {
    moduleId: 1,
    lessonId: 1,
    theory: [
      "Потоковая репликация (streaming replication) — это механизм синхронизации данных между серверами PostgreSQL в реальном времени.",
      "Архитектура master-standby: основной сервер (master) записывает изменения в WAL (Write-Ahead Log), а реплика (standby) применяет эти изменения к себе.",
      "WAL — это журнал транзакций, который гарантирует целостность данных при сбоях.",
      "Репликация работает на уровне физических файлов, что делает её быстрой и надёжной.",
    ],
    practice: [
      {
        title: "Проверка версии PostgreSQL",
        description: "Убедитесь, что PostgreSQL установлен и работает:",
        command: "psql --version",
        output: "psql (PostgreSQL) 16.2",
      },
      {
        title: "Подключение к серверу",
        description: "Подключитесь к PostgreSQL для проверки настроек:",
        command: "psql -U postgres -c 'SELECT version();'",
        output: " PostgreSQL 16.2 on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 11.3.0-1ubuntu1~22.04) 11.3.0, 64-bit",
      },
    ],
    verification: [
      {
        description: "Проверьте, что PostgreSQL работает:",
        command: "sudo systemctl status postgresql",
        expectedOutput: "Active: active (exited)",
      },
    ],
  },
  {
    moduleId: 1,
    lessonId: 2,
    theory: [
      "Для настройки репликации необходимы минимум два сервера: мастер и реплика.",
      "Убедитесь, что на обоих серверах установлена одинаковая версия PostgreSQL.",
      "Настройте сетевое соединение между серверами (откройте порт 5432 или настроенный порт).",
      "Создайте отдельного пользователя для репликации на мастере.",
    ],
    practice: [
      {
        title: "Проверка сетевого соединения",
        description: "Убедитесь, что серверы видят друг друга:",
        command: "ping -c 3 standby-server-ip",
        output: "3 packets transmitted, 3 received, 0% packet loss",
      },
      {
        title: "Проверка порта PostgreSQL",
        description: "Убедитесь, что PostgreSQL слушает на нужном порту:",
        command: "sudo netstat -tlnp | grep 5432",
        output: "tcp 0 0 0.0.0.0:5432 0.0.0.0:* LISTEN 1234/postgres",
      },
    ],
    verification: [
      {
        description: "Проверьте подключение к PostgreSQL с другого сервера:",
        command: "psql -h master-ip -U postgres -c 'SELECT 1;'",
        expectedOutput: " ?column? \n----------\n        1",
      },
    ],
  },
  {
    moduleId: 1,
    lessonId: 3,
    theory: [
      "На мастере необходимо включить запись WAL на уровне репликации.",
      "Создайте роль replicator с атрибутом REPLICATION.",
      "Настройте слот репликации для надёжной доставки WAL.",
      "Отредактируйте pg_hba.conf для разрешения подключения реплики.",
    ],
    practice: [
      {
        title: "Настройка postgresql.conf",
        description: "Добавьте параметры репликации в конфигурационный файл:",
        command: "sudo nano /etc/postgresql/16/main/postgresql.conf",
        output: "wal_level = replica\nmax_wal_senders = 10\nwal_keep_size = 1024\nhot_standby = on",
      },
      {
        title: "Создание роли replicator",
        description: "Создайте пользователя для репликации:",
        command: "sudo -u postgres psql -c \"CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD 'replicator_password';\"",
        output: "CREATE ROLE",
      },
      {
        title: "Создание слота репликации",
        description: "Создайте физический слот для репликации:",
        command: "sudo -u postgres psql -c \"SELECT pg_create_physical_replication_slot('standby_slot');\"",
        output: " pg_create_physical_replication_slot \n--------------------------------------\n standby_slot\n(1 row)",
      },
    ],
    verification: [
      {
        description: "Проверьте настройки репликации:",
        command: "sudo -u postgres psql -c \"SHOW wal_level;\"",
        expectedOutput: " wal_level \n-----------\n replica",
      },
    ],
  },
  {
    moduleId: 1,
    lessonId: 4,
    theory: [
      "На сервере реплики создайте базовую резервную копию с мастера.",
      "Используйте pg_basebackup для создания начального состояния реплики.",
      "Настройте параметры подключения к мастеру в postgresql.conf реплики.",
      "Создайте standby.signal для обозначения сервера как реплики.",
    ],
    practice: [
      {
        title: "Остановка PostgreSQL на реплике",
        description: "Остановите PostgreSQL для настройки:",
        command: "sudo systemctl stop postgresql",
        output: "",
      },
      {
        title: "Создание базовой резервной копии",
        description: "Создайте резервную копию с мастера:",
        command: "sudo -u postgres pg_basebackup -h master-ip -D /var/lib/postgresql/16/main -U replicator -Fp -Xs -P -R",
        output: "24887/24887 kB (100%), 1/1 tablespace\nTransaction log and system record written to disk.\nBackup complete",
      },
      {
        title: "Настройка standby.signal",
        description: "Создайте файл standby.signal:",
        command: "sudo -u postgres touch /var/lib/postgresql/16/main/standby.signal",
        output: "",
      },
    ],
    verification: [
      {
        description: "Проверьте наличие standby.signal:",
        command: "ls -la /var/lib/postgresql/16/main/standby.signal",
        expectedOutput: "-rw-r--r-- 1 postgres postgres 0 ... standby.signal",
      },
    ],
  },
  {
    moduleId: 1,
    lessonId: 5,
    theory: [
      "После настройки реплики убедитесь, что она подключена к мастеру.",
      "Проверьте статус репликации с помощью pg_stat_replication.",
      "Убедитесь, что данные синхронизируются между серверами.",
      "Протестируйте запись на мастере и чтение на реплике.",
    ],
    practice: [
      {
        title: "Запуск реплики",
        description: "Запустите PostgreSQL на реплике:",
        command: "sudo systemctl start postgresql",
        output: "",
      },
      {
        title: "Проверка подключения",
        description: "На мастере проверьте подключение реплики:",
        command: "sudo -u postgres psql -c \"SELECT * FROM pg_stat_replication;\"",
        output: "  pid  | usesysid |  usename  | application_name | client_addr | ... \n-------+----------+-----------+------------------+-------------+-----\n 12345 |     1638 | replicator | walreceiver      | standby-ip  | ...",
      },
    ],
    verification: [
      {
        description: "Проверьте, что реплика в режиме hot_standby:",
        command: "sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\"",
        expectedOutput: " pg_is_in_recovery \n--------------------\n t",
      },
    ],
  },
  {
    moduleId: 1,
    lessonId: 6,
    theory: [
      "Мониторинг репликации критически важен для обеспечения отказоустойчивости.",
      "Используйте pg_stat_replication для отслеживания состояния реплик.",
      "Настройте алерты на задержку репликации (replication lag).",
      "Регулярно проверяйте целостность данных на реплике.",
    ],
    practice: [
      {
        title: "Проверка состояния репликации",
        description: "Получите детальную информацию о репликации:",
        command: "sudo -u postgres psql -c \"SELECT application_name, state, sent_lsn, write_lsn, flush_lsn, replay_lsn FROM pg_stat_replication;\"",
        output: " application_name | state | sent_lsn | write_lsn | flush_lsn | replay_lsn \n------------------+-------+----------+-----------+-----------+------------\n walreceiver     | streaming | 0/1000000 | 0/1000000 | 0/1000000 | 0/1000000",
      },
      {
        title: "Проверка задержки",
        description: "Проверьте задержку репликации:",
        command: "sudo -u postgres psql -c \"SELECT CASE WHEN pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() THEN 0 ELSE EXTRACT(EPOCH FROM now() - pg_last_xact_replay_timestamp())::int END AS lag_seconds;\"",
        output: " lag_seconds \n-------------\n           0",
      },
    ],
    verification: [
      {
        description: "Убедитесь, что задержка минимальна:",
        command: "sudo -u postgres psql -c \"SELECT pg_last_wal_receive_lsn() = pg_last_wal_replay_lsn() AS is_synced;\"",
        expectedOutput: " is_synced \n-----------\n t",
      },
    ],
  },
  {
    moduleId: 1,
    lessonId: 7,
    theory: [
      "Типичные проблемы: разрыв соединения, заполнение диска, конфликт версий.",
      "При разрыве соединения реплика автоматически переподключается (при правильной настройке).",
      "Заполнение диска на мастере может остановить репликацию — настройте wal_keep_size.",
      "Восстановление репликации после сбоя требует проверки целостности данных.",
    ],
    practice: [
      {
        title: "Проверка логов",
        description: "Проверьте логи PostgreSQL на наличие ошибок:",
        command: "sudo tail -n 50 /var/log/postgresql/postgresql-16-main.log | grep -i replication",
        output: "",
      },
      {
        title: "Перезапуск репликации",
        description: "При необходимости перезапустите реплику:",
        command: "sudo systemctl restart postgresql",
        output: "",
      },
    ],
    verification: [
      {
        description: "После перезапуска убедитесь, что репликация восстановлена:",
        command: "sudo -u postgres psql -c \"SELECT status FROM pg_stat_wal_receiver;\"",
        expectedOutput: " status \n--------\n streaming",
      },
    ],
  },
  {
    moduleId: 1,
    lessonId: 8,
    theory: [
      "В этом задании вы настроите полную репликацию с нуля.",
      "Следуйте всем предыдущим шагам последовательно.",
      "После завершения у вас будет работающий кластер master-standby.",
      "Зафиксируйте все настройки для документации.",
    ],
    practice: [
      {
        title: "Полная настройка",
        description: "Выполните все шаги по настройке репликации:",
        command: "# Шаг 1: Настройка мастера\n# Шаг 2: Настройка реплики\n# Шаг 3: Проверка подключения",
        output: "Все шаги выполнены успешно",
      },
    ],
    verification: [
      {
        description: "Финальная проверка: создайте тестовую таблицу на мастере и убедитесь, что она появилась на реплике:",
        command: "sudo -u postgres psql -d mydb -c \"CREATE TABLE test_replication (id serial, data text); INSERT INTO test_replication (data) VALUES ('test');\" && sudo -u postgres psql -h standby-ip -d mydb -c \"SELECT * FROM test_replication;\"",
        expectedOutput: " id |  data  \n----+--------\n  1 | test",
      },
    ],
  },
];

export function getLessonContent(moduleId: number, lessonId: number): LessonContent | undefined {
  return LESSON_CONTENT.find((l) => l.moduleId === moduleId && l.lessonId === lessonId);
}
