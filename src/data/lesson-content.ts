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
  // Module 2
  {
    moduleId: 2,
    lessonId: 1,
    theory: [
      "Слот репликации (replication slot) — это механизм PostgreSQL, который гарантирует, что мастер не удалит WAL-сегменты до тех пор, пока реплика их не получит.",
      "Без слотов мастер может удалить WAL до того, как реплика успеет его применить — это приведёт к разрыву репликации.",
      "Физические слоты работают на уровне WAL-сегментов и не зависят от логической структуры данных.",
      "Слоты имеют два ключевых атрибута: restart_lsn (начальная точка чтения) и confirmed_flush_lsn (подтверждённая позиция).",
    ],
    practice: [
      {
        title: "Проверка текущих слотов",
        description: "Посмотрите, какие слоты уже существуют:",
        command: "sudo -u postgres psql -c \"SELECT slot_name, slot_type, active FROM pg_replication_slots;\"",
        output: " slot_name | slot_type | active \n-----------+-----------+--------\n(0 rows)",
      },
      {
        title: "Проверка WAL-файлов",
        description: "Посмотрите доступные WAL-сегменты:",
        command: "sudo -u postgres psql -c \"SELECT pg_ls_waldir();\"",
        output: "     name     \n---------------\n 000000010000000000000001\n 000000010000000000000002\n(2 rows)",
      },
    ],
    verification: [
      {
        description: "Убедитесь, что WAL-уровень поддерживает слоты:",
        command: "sudo -u postgres psql -c \"SHOW wal_level;\"",
        expectedOutput: " wal_level \n-----------\n replica",
      },
    ],
  },
  {
    moduleId: 2,
    lessonId: 2,
    theory: [
      "Физический слот создаётся командой pg_create_physical_replication_slot().",
      "Имя слота должно быть уникальным и описательным (например, standby1_slot).",
      "Сразу после создания слот неактивен — он начинает работать, когда реплика подключается к нему.",
      "Параметр immediate_default определяет, будет ли слот немедленно доступен для синхронной репликации.",
    ],
    practice: [
      {
        title: "Создание слота для реплики",
        description: "Создайте физический слот для подключения реплики:",
        command: "sudo -u postgres psql -c \"SELECT pg_create_physical_replication_slot('standby1_slot');\"",
        output: " pg_create_physical_replication_slot \n--------------------------------------\n standby1_slot\n(1 row)",
      },
      {
        title: "Проверка созданного слота",
        description: "Убедитесь, что слот создан и неактивен:",
        command: "sudo -u postgres psql -c \"SELECT slot_name, slot_type, active, restart_lsn FROM pg_replication_slots;\"",
        output: "   slot_name   | slot_type | active | restart_lsn \n---------------+-----------+--------+-------------\n standby1_slot | physical  | f      | 0/1000000",
      },
      {
        title: "Создание второго слота",
        description: "Создайте слот для второй реплики:",
        command: "sudo -u postgres psql -c \"SELECT pg_create_physical_replication_slot('standby2_slot');\"",
        output: " pg_create_physical_replication_slot \n--------------------------------------\n standby2_slot\n(1 row)",
      },
    ],
    verification: [
      {
        description: "Проверьте, что оба слота созданы:",
        command: "sudo -u postgres psql -c \"SELECT count(*) as slot_count FROM pg_replication_slots;\"",
        expectedOutput: " slot_count \n------------\n          2",
      },
    ],
  },
  {
    moduleId: 2,
    lessonId: 3,
    theory: [
      "Слот привязывается к реплике через параметр primary_slot_name в postgresql.conf реплики.",
      "При подключении реплики слот становится активным (active = true).",
      "Если реплика отключается, слот остаётся активным некоторое время (取决于 wal_sender_timeout).",
      "Для перемещения слота между серверами нужно удалить его на старом сервере и создать на новом.",
    ],
    practice: [
      {
        title: "Настройка реплики на слот",
        description: "На реплике добавьте параметр в postgresql.conf:",
        command: "echo \"primary_slot_name = 'standby1_slot'\" | sudo tee -a /etc/postgresql/16/main/postgresql.conf",
        output: "primary_slot_name = 'standby1_slot'",
      },
      {
        title: "Перезапуск реплики",
        description: "Перезапустите PostgreSQL на реплике для применения настроек:",
        command: "sudo systemctl restart postgresql",
        output: "",
      },
      {
        title: "Проверка активности слота",
        description: "На мастере проверьте, что слот теперь активен:",
        command: "sudo -u postgres psql -c \"SELECT slot_name, active, active_pid FROM pg_replication_slots;\"",
        output: "   slot_name   | active | active_pid \n---------------+--------+------------\n standby1_slot | t      |      12345",
      },
    ],
    verification: [
      {
        description: "Убедитесь, что слот активен и привязан к процессу реплики:",
        command: "sudo -u postgres psql -c \"SELECT s.slot_name, r.pid, r.application_name FROM pg_replication_slots s LEFT JOIN pg_stat_replication r ON s.active_pid = r.pid WHERE s.active = true;\"",
        expectedOutput: "   slot_name   |  pid  | application_name \n---------------+-------+------------------\n standby1_slot | 12345 | walreceiver",
      },
    ],
  },
  {
    moduleId: 2,
    lessonId: 4,
    theory: [
      "Мониторинг слотов критически важен для предотвращения заполнения диска WAL-файлами.",
      "Если слот неактивен太久, он накапливает WAL, которые не могут быть удалены.",
      "Ключевые метрики: restart_lsn (начальная позиция), confirmed_flush_lsn (подтверждённая позиция), wal_status.",
      "Используйте pg_stat_replication для отслеживания состояния подключённых реплик.",
    ],
    practice: [
      {
        title: "Подробная информация о слотах",
        description: "Получите детальную информацию о всех слотах:",
        command: "sudo -u postgres psql -c \"SELECT slot_name, active, restart_lsn, confirmed_flush_lsn, wal_status, safe_wal_size FROM pg_replication_slots;\"",
        output: "   slot_name   | active | restart_lsn | confirmed_flush_lsn | wal_status | safe_wal_size \n---------------+--------+-------------+---------------------+------------+---------------\n standby1_slot | t      | 0/1000000   |                     | reserved   |       1048576",
      },
      {
        title: "Размер WAL-бэклога",
        description: "Проверьте, сколько WAL накоплено для слота:",
        command: "sudo -u postgres psql -c \"SELECT slot_name, pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) AS restart_lag_bytes FROM pg_replication_slots WHERE active = true;\"",
        output: "   slot_name   | restart_lag_bytes \n---------------+-------------------\n standby1_slot |              1024",
      },
      {
        title: "Мониторинг через представление",
        description: "Используйте встроенное представление для мониторинга:",
        command: "sudo -u postgres psql -c \"SELECT * FROM pg_stat_replication;\"",
        output: "  pid  | usesysid |  usename  | application_name | client_addr | ... \n-------+----------+-----------+------------------+-------------+-----\n 12345 |     1638 | replicator | walreceiver      | standby-ip  | ...",
      },
    ],
    verification: [
      {
        description: "Убедитесь, что размер бэклога минимален:",
        command: "sudo -u postgres psql -c \"SELECT slot_name, pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) < 10485760 AS is_healthy FROM pg_replication_slots WHERE active = true;\"",
        expectedOutput: "   slot_name   | is_healthy \n---------------+------------\n standby1_slot | t",
      },
    ],
  },
  {
    moduleId: 2,
    lessonId: 5,
    theory: [
      "Неактивные слоты могут привести к заполнению диска, так как PostgreSQL не удаляет WAL, пока слот их требует.",
      "Регулярно проверяйте и удаляйте неиспользуемые слоты.",
      "Удаление слота безопасно, если реплика больше не подключена к нему.",
      "Используйте pg_drop_physical_replication_slot() для удаления слотов.",
    ],
    practice: [
      {
        title: "Поиск неактивных слотов",
        description: "Найдите слоты, которые не используются:",
        command: "sudo -u postgres psql -c \"SELECT slot_name, active, pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) AS lag_bytes FROM pg_replication_slots WHERE active = false;\"",
        output: " slot_name | active | lag_bytes \n-----------+--------+-----------\n(0 rows)",
      },
      {
        title: "Удаление неактивного слота",
        description: "Удалите слот, который больше не нужен:",
        command: "sudo -u postgres psql -c \"SELECT pg_drop_replication_slot('standby2_slot');\"",
        output: " pg_drop_replication_slot \n--------------------------\n(1 row)",
      },
      {
        title: "Проверка после удаления",
        description: "Убедитесь, что слот удалён:",
        command: "sudo -u postgres psql -c \"SELECT slot_name FROM pg_replication_slots;\"",
        output: "   slot_name   \n---------------\n standby1_slot\n(1 row)",
      },
    ],
    verification: [
      {
        description: "Проверьте, что удалённый слот больше не существует:",
        command: "sudo -u postgres psql -c \"SELECT count(*) FROM pg_replication_slots WHERE slot_name = 'standby2_slot';\"",
        expectedOutput: " count \n-------\n     0",
      },
    ],
  },
  {
    moduleId: 2,
    lessonId: 6,
    theory: [
      "В этом задании вы создадите и настроите слоты для продакшен-сценария.",
      "Настройте мониторинг слотов и алерты на заполнение диска.",
      "Протестируйте поведение при отключении реплики.",
      "Документируйте все настройки для административной команды.",
    ],
    practice: [
      {
        title: "Создание слотов для кластера",
        description: "Создайте слоты для всех реплик кластера:",
        command: "sudo -u postgres psql -c \"SELECT pg_create_physical_replication_slot('prod_standby1'); SELECT pg_create_physical_replication_slot('prod_standby2');\"",
        output: " pg_create_physical_replication_slot \n--------------------------------------\n prod_standby1\n(1 row)\n\n pg_create_physical_replication_slot \n--------------------------------------\n prod_standby2\n(1 row)",
      },
      {
        title: "Настройка мониторинга",
        description: "Создайте скрипт мониторинга слотов:",
        command: "cat > /usr/local/bin/monitor_slots.sh << 'EOF'\n#!/bin/bash\nsudo -u postgres psql -t -A -c \"SELECT slot_name, active, pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn) FROM pg_replication_slots;\"\nEOF\nchmod +x /usr/local/bin/monitor_slots.sh",
        output: "",
      },
    ],
    verification: [
      {
        description: "Финальная проверка: все слоты созданы и настроены:",
        command: "sudo -u postgres psql -c \"SELECT slot_name, slot_type, active FROM pg_replication_slots ORDER BY slot_name;\"",
        expectedOutput: "   slot_name   | slot_type | active \n---------------+-----------+--------\n prod_standby1 | physical  | f\n prod_standby2 | physical  | f",
      },
    ],
  },
  // Module 3
  {
    moduleId: 3,
    lessonId: 1,
    theory: [
      "TLS (Transport Layer Security) — протокол шифрования данных при передаче по сети.",
      "PostgreSQL поддерживает SSL/TLS для шифрования соединений между клиентом и сервером, а также между мастером и репликой.",
      "Без шифрования данные передаются открытым текстом и могут быть перехвачены.",
      "Сертификат TLS подтверждает подлинность сервера и шифрует трафик.",
    ],
    practice: [
      {
        title: "Проверка поддержки SSL",
        description: "Убедитесь, что PostgreSQL собран с поддержкой SSL:",
        command: "sudo -u postgres psql -c \"SHOW ssl;\"",
        output: " ssl \n-----\n on",
      },
      {
        title: "Проверка версии OpenSSL",
        description: "Проверьте версию OpenSSL:",
        command: "openssl version",
        output: "OpenSSL 3.0.2 15 Mar 2022 (Library: OpenSSL 3.0.2 15 Mar 2022)",
      },
    ],
    verification: [
      {
        description: "Убедитесь, что SSL включён:",
        command: "sudo -u postgres psql -c \"SHOW ssl;\"",
        expectedOutput: " ssl \n-----\n on",
      },
    ],
  },
  {
    moduleId: 3,
    lessonId: 2,
    theory: [
      "Для настройки TLS необходимы три типа сертификатов: CA (Certificate Authority), серверный и клиентский.",
      "CA-сертификат — корневой сертификат, którym подписываются все остальные.",
      "Сертификат сервера подтверждает подлинность PostgreSQL-сервера.",
      "Клиентский сертификат используется для аутентификации клиентов (опционально).",
    ],
    practice: [
      {
        title: "Создание директории для сертификатов",
        description: "Создайте директорию для хранения сертификатов:",
        command: "sudo mkdir -p /etc/postgresql/ssl && sudo chown postgres:postgres /etc/postgresql/ssl",
        output: "",
      },
      {
        title: "Генерация CA-сертификата",
        description: "Создайте корневой сертификат Certificate Authority:",
        command: "cd /etc/postgresql/ssl && sudo -u postgres openssl genrsa -out ca.key 2048 && sudo -u postgres openssl req -new -x509 -days 3650 -key ca.key -out ca.crt -subj \"/CN=PostgreSQL CA\"",
        output: "Generating RSA private key, 2048 bit long modulus\n...+\n...+\n......+++++\n.....+++++",
      },
      {
        title: "Генерация серверного сертификата",
        description: "Создайте сертификат для PostgreSQL-сервера:",
        command: "cd /etc/postgresql/ssl && sudo -u postgres openssl genrsa -out server.key 2048 && sudo -u postgres openssl req -new -key server.key -out server.csr -subj \"/CN=postgres\" && sudo -u postgres openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650",
        output: "Signature ok\nsubject=CN = postgres\nGetting CA Private Key",
      },
    ],
    verification: [
      {
        description: "Проверьте созданные файлы:",
        command: "ls -la /etc/postgresql/ssl/",
        expectedOutput: "total 20\ndrwxr-xr-x 2 postgres postgres 4096 ...\n-rw-r--r-- 1 postgres postgres 1220 ... ca.crt\n-rw-r--r-- 1 postgres postgres 1679 ... ca.key\n-rw-r--r-- 1 postgres postgres 1119 ... server.crt\n-rw-r--r-- 1 postgres postgres 1679 ... server.key",
      },
    ],
  },
  {
    moduleId: 3,
    lessonId: 3,
    theory: [
      "PostgreSQL настраивается для SSL через параметры ssl_cert_file, ssl_key_file и ssl_ca_file в postgresql.conf.",
      "ssl_cert_file — путь к серверному сертификату.",
      "ssl_key_file — путь к приватному ключу сервера.",
      "ssl_ca_file — путь к CA-сертификату для проверки клиентских сертификатов.",
    ],
    practice: [
      {
        title: "Настройка SSL в postgresql.conf",
        description: "Добавьте параметры SSL в конфигурацию:",
        command: "cat >> /etc/postgresql/16/main/postgresql.conf << 'EOF'\n# SSL Configuration\nssl = on\nssl_cert_file = '/etc/postgresql/ssl/server.crt'\nssl_key_file = '/etc/postgresql/ssl/server.key'\nssl_ca_file = '/etc/postgresql/ssl/ca.crt'\nEOF",
        output: "",
      },
      {
        title: "Настройка прав доступа",
        description: "Установите правильные права на файлы сертификатов:",
        command: "sudo chown postgres:postgres /etc/postgresql/ssl/server.* /etc/postgresql/ssl/ca.* && sudo chmod 600 /etc/postgresql/ssl/server.key",
        output: "",
      },
      {
        title: "Перезапуск PostgreSQL",
        description: "Перезапустите PostgreSQL для применения настроек:",
        command: "sudo systemctl restart postgresql",
        output: "",
      },
    ],
    verification: [
      {
        description: "Проверьте, что SSL работает:",
        command: "sudo -u postgres psql -c \"SHOW ssl;\"",
        expectedOutput: " ssl \n-----\n on",
      },
    ],
  },
  {
    moduleId: 3,
    lessonId: 4,
    theory: [
      "pg_hba.conf — файл конфигурации аутентификации PostgreSQL (Host-Based Authentication).",
      "Определяет, какие пользователи могут подключаться с каких хостов и каким методом.",
      "Формат записи: TYPE DATABASE USER ADDRESS METHOD",
      "Порядок записей важен — PostgreSQL проверяет сверху вниз и использует первое совпадение.",
    ],
    practice: [
      {
        title: "Просмотр текущего pg_hba.conf",
        description: "Посмотрите текущие настройки аутентификации:",
        command: "sudo cat /etc/postgresql/16/main/pg_hba.conf | grep -v '^#' | grep -v '^$'",
        output: "local   all             postgres                                peer\nlocal   all             all                                     peer\nhost    all             all             127.0.0.1/32            scram-sha-256\nhost    all             all             ::1/128                 scram-sha-256",
      },
      {
        title: "Настройка аутентификации для репликации",
        description: "Добавьте запись для подключения реплики:",
        command: "echo 'host    replication     replicator      standby-ip/32   scram-sha-256' | sudo tee -a /etc/postgresql/16/main/pg_hba.conf",
        output: "host    replication     replicator      standby-ip/32   scram-sha-256",
      },
      {
        title: "Настройка шифрованного подключения",
        description: "Добавьте запись для SSL-подключений:",
        command: "echo 'hostssl all             all             0.0.0.0/0       scram-sha-256' | sudo tee -a /etc/postgresql/16/main/pg_hba.conf",
        output: "hostssl all             all             0.0.0.0/0       scram-sha-256",
      },
    ],
    verification: [
      {
        description: "Проверьте, что записи добавлены:",
        command: "sudo grep -E 'host|hostssl' /etc/postgresql/16/main/pg_hba.conf | grep -v '^#'",
        expectedOutput: "host    all             all             127.0.0.1/32            scram-sha-256\nhost    all             all             ::1/128                 scram-sha-256\nhost    replication     replicator      standby-ip/32   scram-sha-256\nhostssl all             all             0.0.0.0/0       scram-sha-256",
      },
    ],
  },
  {
    moduleId: 3,
    lessonId: 5,
    theory: [
      "PostgreSQL поддерживает несколько методов аутентификации: trust, reject, md5, scram-sha-256, certificate, ldap, radius.",
      "scram-sha-256 — рекомендуемый метод, более безопасный чем md5.",
      "certificate — аутентификация по SSL-сертификату клиента.",
      "trust — разрешить подключение без пароля (только для разработки!).",
    ],
    practice: [
      {
        title: "Настройка scram-sha-256",
        description: "Убедитесь, что используется scram-sha-256:",
        command: "sudo grep scram-sha-256 /etc/postgresql/16/main/pg_hba.conf",
        output: "host    all             all             127.0.0.1/32            scram-sha-256\nhost    all             all             ::1/128                 scram-sha-256",
      },
      {
        title: "Настройка аутентификации по сертификату",
        description: "Добавьте запись для клиентской сертификатной аутентификации:",
        command: "echo 'hostssl all             all             0.0.0.0/0       cert' | sudo tee -a /etc/postgresql/16/main/pg_hba.conf",
        output: "hostssl all             all             0.0.0.0/0       cert",
      },
      {
        title: "Создание пользователя с паролем",
        description: "Создайте пользователя с безопасным паролем:",
        command: "sudo -u postgres psql -c \"CREATE USER app_user WITH PASSWORD 'StrongP@ssw0rd';\"",
        output: "CREATE ROLE",
      },
    ],
    verification: [
      {
        description: "Проверьте, что пользователь создан:",
        command: "sudo -u postgres psql -c \"SELECT usename FROM pg_user WHERE usename = 'app_user';\"",
        expectedOutput: " usename  \n----------\n app_user",
      },
    ],
  },
  {
    moduleId: 3,
    lessonId: 6,
    theory: [
      "Регулярный аудит безопасности критически важен для защиты данных.",
      "Проверяйте настройки pg_hba.conf, SSL-сертификаты и права доступа.",
      "Используйте логирование для отслеживания попыток подключения.",
      "Тестируйте подключения с различных хостов и с разными учётными данными.",
    ],
    practice: [
      {
        title: "Аудит настроек SSL",
        description: "Проверьте параметры SSL:",
        command: "sudo -u postgres psql -c \"SELECT name, setting FROM pg_settings WHERE name LIKE '%ssl%';\"",
        output: "        name        |        setting        \n--------------------+-----------------------\n ssl                 | on\n ssl_ca_file         | /etc/postgresql/ssl/ca.crt\n ssl_cert_file       | /etc/postgresql/ssl/server.crt\n ssl_key_file        | /etc/postgresql/ssl/server.key",
      },
      {
        title: "Проверка подключения через SSL",
        description: "Протестируйте SSL-подключение:",
        command: "psql \"host=127.0.0.1 dbname=postgres user=postgres sslmode=require\" -c \"SELECT ssl_is_used();\"",
        output: " ssl_is_used \n-------------\n t",
      },
      {
        title: "Просмотр логов",
        description: "Проверьте логи на наличие ошибок аутентификации:",
        command: "sudo grep 'connection authorized' /var/log/postgresql/postgresql-16-main.log | tail -5",
        output: "",
      },
    ],
    verification: [
      {
        description: "Убедитесь, что SSL-подключение работает:",
        command: "psql \"host=127.0.0.1 dbname=postgres user=postgres sslmode=require\" -c \"SELECT ssl_is_used();\"",
        expectedOutput: " ssl_is_used \n-------------\n t",
      },
    ],
  },
  {
    moduleId: 3,
    lessonId: 7,
    theory: [
      "В этом задании вы настроите полную безопасность кластера PostgreSQL.",
      "Включите SSL для всех соединений.",
      "Настройте аутентификацию по сертификатам для репликации.",
      "Проведите аудит безопасности и задокументируйте настройки.",
    ],
    practice: [
      {
        title: "Генерация сертификатов для кластера",
        description: "Создайте полный набор сертификатов:",
        command: "cd /etc/postgresql/ssl && sudo -u postgres bash -c '\nopenssl genrsa -out ca.key 2048\nopenssl req -new -x509 -days 3650 -key ca.key -out ca.crt -subj \"/CN=Cluster CA\"\nopenssl genrsa -out server.key 2048\nopenssl req -new -key server.key -out server.csr -subj \"/CN=master\"\nopenssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 3650\n'",
        output: "Generating RSA private key, 2048 bit long modulus\n...",
      },
      {
        title: "Настройка pg_hba.conf",
        description: "Настройте аутентификацию для всех сценариев:",
        command: "sudo tee /etc/postgresql/16/main/pg_hba.conf << 'EOF'\n# TYPE  DATABASE  USER        ADDRESS         METHOD\nlocal   all       postgres                    peer\nlocal   all       all                         peer\nhostssl all       all         0.0.0.0/0       scram-sha-256\nhostssl all       all         ::1/128         scram-sha-256\nhostssl replication replicator 0.0.0.0/0      cert\nEOF",
        output: "",
      },
    ],
    verification: [
      {
        description: "Финальная проверка: протестируйте SSL-подключение:",
        command: "psql \"host=127.0.0.1 dbname=postgres user=postgres sslmode=verify-ca sslrootcert=/etc/postgresql/ssl/ca.crt\" -c \"SELECT ssl_is_used(), current_user;\"",
        expectedOutput: " ssl_is_used | current_user \n-------------+--------------\n t           | postgres",
      },
    ],
  },
  // Module 4
  {
    moduleId: 4,
    lessonId: 1,
    theory: [
      "Failover — процесс переключения на резервный сервер при выходе из строя основного.",
      "RPO (Recovery Point Objective) — максимальная потеря данных в единицу времени.",
      "RTO (Recovery Time Objective) — время восстановления работы после сбоя.",
      "Синхронная репликация гарантирует zero RPO, но увеличивает латентность записи.",
      "Асинхронная репликация быстрее, но возможна потеря данных при failover.",
    ],
    practice: [
      {
        title: "Проверка состояния кластера",
        description: "Посмотрите текущее состояние мастер-реплика:",
        command: "sudo -u postgres psql -c \"SELECT pid, usename, application_name, client_addr, state, sync_state FROM pg_stat_replication;\"",
        output: "  pid  | usename  | application_name | client_addr | state    | sync_state \n-------+----------+------------------+-------------+----------+------------\n 12345 | replicator | walreceiver    | standby-ip  | streaming | async",
      },
      {
        title: "Проверка расстояния до мастера",
        description: "Проверьте, как далеко реплика от мастера:",
        command: "sudo -u postgres psql -c \"SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn) AS replay_lag_bytes FROM pg_stat_replication;\"",
        output: " replay_lag_bytes \n------------------\n               0",
      },
    ],
    verification: [
      {
        description: "Убедитесь, что репликация работает:",
        command: "sudo -u postgres psql -c \"SELECT state FROM pg_stat_replication;\"",
        expectedOutput: " state    \n----------\n streaming",
      },
    ],
  },
  {
    moduleId: 4,
    lessonId: 2,
    theory: [
      "Автоматический failover обеспечивает максимальную доступность кластера.",
      "Patroni — популярное решение для автоматического failover PostgreSQL.",
      "etcd/Consul/ZooKeeper — хранилища для хранения состояния кластера.",
      "Patroni отслеживает состояние мастера и автоматически повышает реплику при сбое.",
    ],
    practice: [
      {
        title: "Установка Patroni",
        description: "Установите Patroni и зависимости:",
        command: "pip3 install patroni[etcd]",
        output: "Collecting patroni[etcd]\n...",
      },
      {
        title: "Конфигурация Patroni",
        description: "Создайте конфигурационный файл patroni.yml:",
        command: "cat > /etc/patroni/patroni.yml << 'EOF'\nscope: pg-cluster\nnamespace: /db/\nname: node1\n\nrestapi:\n  listen: 0.0.0.0:8008\n  connect_address: 127.0.0.1:8008\n\netcd:\n  hosts: 127.0.0.1:2379\n\nbootstrap:\n  dcs:\n    ttl: 30\n    loop_wait: 10\n    retry_timeout: 10\n    maximum_lag_on_failover: 1048576\n    postgresql:\n      use_pg_rewind: true\n      parameters:\n        wal_level: replica\n        hot_standby: on\n        max_wal_senders: 10\n        max_replication_slots: 10\nEOF",
        output: "",
      },
      {
        title: "Запуск Patroni",
        description: "Запустите Patroni:",
        command: "sudo systemctl start patroni",
        output: "",
      },
    ],
    verification: [
      {
        description: "Проверьте статус Patroni:",
        command: "patronictl -c /etc/patroni/patroni.yml list",
        expectedOutput: "  Cluster: pg-cluster\n  +---------+---------+---------+---------+-----------+\n  | Member  | Host    | Role    | State   | Lag       |\n  +---------+---------+---------+---------+-----------+\n  | node1   | 127.0.0 | Leader  | running | 0MB       |\n  +---------+---------+---------+---------+-----------+",
      },
    ],
  },
  {
    moduleId: 4,
    lessonId: 3,
    theory: [
      "Ручной failover выполняется администратором при Planned downtime или для тестирования.",
      "pg_promote() — функция для повышения реплики в мастер.",
      "Перед ручным failover убедитесь, что реплика синхронизирована с мастером.",
      "После failover нужно перенастроить приложения на новый мастер.",
    ],
    practice: [
      {
        title: "Проверка синхронизации",
        description: "Убедитесь, что реплика актуальна:",
        command: "sudo -u postgres psql -h standby-ip -c \"SELECT pg_last_wal_replay_lsn(), pg_last_wal_receive_lsn();\"",
        output: " pg_last_wal_replay_lsn | pg_last_wal_receive_lsn \n------------------------+-------------------------\n 0/1000000              | 0/1000000",
      },
      {
        title: "Остановка мастера",
        description: "Имитируйте отказ мастера:",
        command: "sudo systemctl stop postgresql",
        output: "",
      },
      {
        title: "Повышение реплики",
        description: "На реплике выполните повышение:",
        command: "sudo -u postgres psql -c \"SELECT pg_promote();\"",
        output: " pg_promote \n------------\n t",
      },
    ],
    verification: [
      {
        description: "Проверьте, что реплика стала мастером:",
        command: "sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\"",
        expectedOutput: " pg_is_in_recovery \n--------------------\n f",
      },
    ],
  },
  {
    moduleId: 4,
    lessonId: 4,
    theory: [
      "После повышения реплики необходимо перенастроить приложения на новый мастер.",
      "Обновите DNS-записи или файл конфигурации приложения.",
      "Убедитесь, что все реплики подключаются к новому мастеру.",
      "Настройте бывшего мастера как реплику нового.",
    ],
    practice: [
      {
        title: "Проверка нового мастера",
        description: "Убедитесь, что новый мастер работает:",
        command: "sudo -u postgres psql -c \"SELECT pg_is_in_recovery(), pg_current_wal_lsn();\"",
        output: " pg_is_in_recovery | pg_current_wal_lsn \n--------------------+--------------------\n f                  | 0/1000000",
      },
      {
        title: "Создание тестовых данных",
        description: "Создайте тестовую таблицу на новом мастере:",
        command: "sudo -u postgres psql -c \"CREATE TABLE test_failover (id serial, data text); INSERT INTO test_failover (data) VALUES ('new_master');\"",
        output: "CREATE TABLE\nINSERT 0 1",
      },
      {
        title: "Настройка старого мастера как реплики",
        description: "На старом мастере создайте standby.signal:",
        command: "sudo -u postgres touch /var/lib/postgresql/16/main/standby.signal",
        output: "",
      },
    ],
    verification: [
      {
        description: "Проверьте, что старый мастер стал репликой:",
        command: "sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\"",
        expectedOutput: " pg_is_in_recovery \n--------------------\n t",
      },
    ],
  },
  {
    moduleId: 4,
    lessonId: 5,
    theory: [
      "pg_rewind — утилита для быстрого восстановления старого мастера как реплики.",
      "Позволяет избежать полного пересоздания резервной копии.",
      "Работает на основе сравнения WAL-файлов между серверами.",
      "Ограничение:pg_rewind не работает, если старый мастер принял записи после failover.",
    ],
    practice: [
      {
        title: "Подготовка к pg_rewind",
        description: "На старом мастере включите логирование:",
        command: "echo \"wal_log_hints = on\" | sudo tee -a /etc/postgresql/16/main/postgresql.conf",
        output: "wal_log_hints = on",
      },
      {
        title: "Остановка старого мастера",
        description: "Остановите PostgreSQL на старом мастере:",
        command: "sudo systemctl stop postgresql",
        output: "",
      },
      {
        title: "Запуск pg_rewind",
        description: "Выполните pg_rewind из новой мастера:",
        command: "sudo -u postgres pg_rewind --target-pgdata=/var/lib/postgresql/16/main --source-server=\"host=new-master-ip user=postgres dbname=postgres\" --progress",
        output: "connected, sending timeline history file\nrewinding from 1 to 2\n...rewinding done!",
      },
    ],
    verification: [
      {
        description: "Проверьте, что pg_rewind завершился успешно:",
        command: "ls /var/lib/postgresql/16/main/standby.signal",
        expectedOutput: "/var/lib/postgresql/16/main/standby.signal",
      },
    ],
  },
  {
    moduleId: 4,
    lessonId: 6,
    theory: [
      "Возврат старого мастера — процесс восстановления бывшего мастера как реплики нового.",
      "После pg_rewind нужно создать standby.signal и настроить подключение к новому мастеру.",
      "Убедитесь, что конфигурация указывает на нового мастера.",
      "После запуска проверьте синхронизацию данных.",
    ],
    practice: [
      {
        title: "Настройка подключения к новому мастеру",
        description: "Обновите primary_conninfo в postgresql.conf:",
        command: "echo \"primary_conninfo = 'host=new-master-ip port=5432 user=replicator password=replicator_password'\" | sudo tee /etc/postgresql/16/main/postgresql.auto.conf",
        output: "",
      },
      {
        title: "Создание standby.signal",
        description: "Создайте файл standby.signal:",
        command: "sudo -u postgres touch /var/lib/postgresql/16/main/standby.signal",
        output: "",
      },
      {
        title: "Запуск PostgreSQL",
        description: "Запустите PostgreSQL на старом мастере:",
        command: "sudo systemctl start postgresql",
        output: "",
      },
    ],
    verification: [
      {
        description: "Проверьте, что старый мастер работает как реплика:",
        command: "sudo -u postgres psql -c \"SELECT pg_is_in_recovery(), pg_last_wal_receive_lsn();\"",
        expectedOutput: " pg_is_in_recovery | pg_last_wal_receive_lsn \n--------------------+-------------------------\n t                  | 0/1000000",
      },
    ],
  },
  {
    moduleId: 4,
    lessonId: 7,
    theory: [
      "Полная ресинхронизация — процесс полного копирования данных с мастера на реплику.",
      "Инкрементальная ресинхронизация — применение пропущенных WAL-файлов.",
      "Ресинхронизация может занять много времени при большом расхождении данных.",
      "Для ускорения используйте rsync или pg_basebackup с параллельным копированием.",
    ],
    practice: [
      {
        title: "Проверка расхождения",
        description: "Определите размер расхождения данных:",
        command: "sudo -u postgres psql -h standby-ip -c \"SELECT pg_wal_lsn_diff(pg_last_wal_receive_lsn(), (SELECT pg_last_wal_replay_lsn() FROM pg_stat_wal_receiver));\"",
        output: " pg_wal_lsn_diff \n-----------------\n               0",
      },
      {
        title: "Полная ресинхронизация",
        description: "Если расхождение слишком велико, выполните полное копирование:",
        command: "sudo systemctl stop postgresql && sudo -u postgres rm -rf /var/lib/postgresql/16/main/* && sudo -u postgres pg_basebackup -h new-master-ip -D /var/lib/postgresql/16/main -U replicator -Fp -Xs -P -R",
        output: "24887/24887 kB (100%), 1/1 tablespace\nTransaction log and system record written to disk.\nBackup complete",
      },
    ],
    verification: [
      {
        description: "После ресинхронизации проверьте работу:",
        command: "sudo systemctl start postgresql && sudo -u postgres psql -c \"SELECT pg_is_in_recovery();\"",
        expectedOutput: " pg_is_in_recovery \n--------------------\n t",
      },
    ],
  },
  {
    moduleId: 4,
    lessonId: 8,
    theory: [
      "Регулярное тестирование failover критически важено для уверенности в отказоустойчивости.",
      "Chaos engineering — подход к тестированию путём намеренного создания сбоев.",
      "Тестируйте как плановый, так и внеплановый failover.",
      "Документируйте результаты тестов и улучшайте процедуры.",
    ],
    practice: [
      {
        title: "План тестирования",
        description: "Создайте план тестирования failover:",
        command: "cat > /usr/local/bin/test_failover.sh << 'EOF'\n#!/bin/bash\necho \"=== Тест failover ===\"\necho \"1. Проверка состояния кластера\"\npatronictl list\necho \"2. Остановка мастера\"\nsudo systemctl stop postgresql\necho \"3. Ожидание failover\"\nsleep 10\necho \"4. Проверка нового мастера\"\npatronictl list\necho \"5. Запуск старого мастера\"\nsudo systemctl start postgresql\necho \"6. Проверка синхронизации\"\nsleep 5\npatronictl list\necho \"=== Тест завершён ===\"\nEOF\nchmod +x /usr/local/bin/test_failover.sh",
        output: "",
      },
      {
        title: "Запуск теста",
        description: "Запустите тест failover:",
        command: "sudo /usr/local/bin/test_failover.sh",
        output: "=== Тест failover ===\n1. Проверка состояния кластера\n  Cluster: pg-cluster\n...",
      },
    ],
    verification: [
      {
        description: "Проверьте, что кластер восстановился:",
        command: "patronictl list",
        expectedOutput: "  Cluster: pg-cluster\n  +---------+---------+---------+---------+-----------+\n  | Member  | Host    | Role    | State   | Lag       |\n  +---------+---------+---------+---------+-----------+\n  | node1   | 127.0.0 | Leader  | running | 0MB       |\n  | node2   | 127.0.0 | Replica | running | 0MB       |\n  +---------+---------+---------+---------+-----------+",
      },
    ],
  },
  {
    moduleId: 4,
    lessonId: 9,
    theory: [
      "В этом задании вы выполните полный цикл failover и восстановления.",
      "Настройте автоматический failover с помощью Patroni.",
      "Протестируйте сценарий отказа мастера.",
      "Восстановите бывшего мастера как реплику.",
      "Документируйте все действия для административной команды.",
    ],
    practice: [
      {
        title: "Настройка кластера",
        description: "Убедитесь, что кластер настроен и работает:",
        command: "patronictl list",
        output: "  Cluster: pg-cluster\n  +---------+---------+---------+---------+-----------+\n  | Member  | Host    | Role    | State   | Lag       |\n  +---------+---------+---------+---------+-----------+\n  | node1   | 127.0.0 | Leader  | running | 0MB       |\n  +---------+---------+---------+---------+-----------+",
      },
      {
        title: "Имитация сбоя",
        description: "Остановите мастер для имитации сбоя:",
        command: "sudo systemctl stop postgresql",
        output: "",
      },
      {
        title: "Проверка failover",
        description: "Дождитесь автоматического failover:",
        command: "sleep 15 && patronictl list",
        output: "  Cluster: pg-cluster\n  +---------+---------+---------+---------+-----------+\n  | Member  | Host    | Role    | State   | Lag       |\n  +---------+---------+---------+---------+-----------+\n  | node2   | 127.0.0 | Leader  | running | 0MB       |\n  +---------+---------+---------+---------+-----------+",
      },
      {
        title: "Восстановление",
        description: "Восстановите старого мастера как реплику:",
        command: "sudo systemctl start postgresql",
        output: "",
      },
    ],
    verification: [
      {
        description: "Финальная проверка: кластер полностью восстановлен:",
        command: "patronictl list",
        expectedOutput: "  Cluster: pg-cluster\n  +---------+---------+---------+---------+-----------+\n  | Member  | Host    | Role    | State   | Lag       |\n  +---------+---------+---------+---------+-----------+\n  | node1   | 127.0.0 | Replica | running | 0MB       |\n  | node2   | 127.0.0 | Leader  | running | 0MB       |\n  +---------+---------+---------+---------+-----------+",
      },
    ],
  },
];

export function getLessonContent(moduleId: number, lessonId: number): LessonContent | undefined {
  return LESSON_CONTENT.find((l) => l.moduleId === moduleId && l.lessonId === lessonId);
}
