export interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: string;
  duration: string;
}

export interface Module {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
}

export const MODULES: Module[] = [
  {
    id: 1,
    title: "Основы потоковой репликации",
    description: "Настройка мастера и реплики, проверка синхронизации",
    difficulty: "intermediate",
    duration: "4 часа",
    lessons: [
      { id: 1, title: "Введение в репликацию", slug: "intro", description: "Обзор потоковой репликации, архитектура master-standby, принцип работы WAL", duration: "20 мин" },
      { id: 2, title: "Подготовка серверов", slug: "preparation", description: "Установка PostgreSQL, настройка сети, создание пользователей", duration: "30 мин" },
      { id: 3, title: "Настройка мастера", slug: "master-setup", description: "Конфигурация postgresql.conf, создание роли replicator, настройка слота", duration: "45 мин" },
      { id: 4, title: "Настройка реплики", slug: "replica-setup", description: "Базовая резервная копия, настройка standby, подключение к мастеру", duration: "40 мин" },
      { id: 5, title: "Проверка репликации", slug: "verification", description: "Проверка sync_state, мониторинг lag, тестирование записи", duration: "25 мин" },
      { id: 6, title: "Мониторинг", slug: "monitoring", description: "Встроенные представления, pg_stat_replication, алерты", duration: "30 мин" },
      { id: 7, title: "Траблшутинг", slug: "troubleshooting", description: "Решение типичных проблем, восстановление репликации", duration: "35 мин" },
      { id: 8, title: "Итоговое задание", slug: "final-task", description: "Полная настройка репликации с нуля до рабочего состояния", duration: "40 мин" },
    ],
  },
  {
    id: 2,
    title: "Физические слоты репликации",
    description: "Создание и управление слотами, мониторинг активности",
    difficulty: "advanced",
    duration: "3 часа",
    lessons: [
      { id: 1, title: "Что такое слоты", slug: "what-are-slots", description: "Назначение слотов, физические vs логические, WAL retention", duration: "25 мин" },
      { id: 2, title: "Создание слотов", slug: "creating-slots", description: "pg_create_physical_replication_slot, параметры, именование", duration: "30 мин" },
      { id: 3, title: "Управление слотами", slug: "managing-slots", description: "Активация, деактивация, перемещение между серверами", duration: "35 мин" },
      { id: 4, title: "Мониторинг слотов", slug: "monitoring-slots", description: "pg_replication_slots, active_pid, restart_lsn, WAL бэклог", duration: "30 мин" },
      { id: 5, title: "Очистка слотов", slug: "cleanup", description: "Удаление неактивных слотов, предотвращение заполнения диска", duration: "20 мин" },
      { id: 6, title: "Итоговое задание", slug: "final-task", description: "Настройка и мониторинг слотов в продакшен-сценарии", duration: "40 мин" },
    ],
  },
  {
    id: 3,
    title: "TLS и безопасность",
    description: "Настройка шифрования, сертификаты, pg_hba.conf",
    difficulty: "advanced",
    duration: "3.5 часа",
    lessons: [
      { id: 1, title: "Введение в TLS", slug: "intro", description: "Зачем нужно шифрование, SSL vs TLS, сертификаты", duration: "20 мин" },
      { id: 2, title: "Генерация сертификатов", slug: "certificates", description: "Создание CA, серверных и клиентских сертификатов через openssl", duration: "40 мин" },
      { id: 3, title: "Настройка SSL", slug: "ssl-setup", description: "Конфигурация PostgreSQL для SSL, ssl_cert_file, ssl_key_file", duration: "35 мин" },
      { id: 4, title: "pg_hba.conf", slug: "pg-hba", description: "Формат файла, типы записей, методы аутентификации", duration: "30 мин" },
      { id: 5, title: "Аутентификация", slug: "authentication", description: " scram-sha-256, LDAP, сертификаты, trust vs reject", duration: "35 мин" },
      { id: 6, title: "Проверка безопасности", slug: "security-check", description: "Аудит настроек, тестирование подключений, pg_hbacheck", duration: "25 мин" },
      { id: 7, title: "Итоговое задание", slug: "final-task", description: "Полная настройка безопасности кластера", duration: "40 мин" },
    ],
  },
  {
    id: 4,
    title: "Failover и pg_rewind",
    description: "Повышение реплики, возврат старого мастера",
    difficulty: "advanced",
    duration: "5 часов",
    lessons: [
      { id: 1, title: "Что такое Failover", slug: "what-is-failover", description: "Понятие failover, сценарии, RPO и RTO", duration: "25 мин" },
      { id: 2, title: "Автоматический Failover", slug: "auto-failover", description: "Patroni, etcd, автоматическое переключение", duration: "45 мин" },
      { id: 3, title: "Ручной Failover", slug: "manual-failover", description: "pg_promote, сценарий отключения мастера", duration: "35 мин" },
      { id: 4, title: "Повышение реплики", slug: "promote-replica", description: " promote_standby.sh, перенастройка приложений", duration: "40 мин" },
      { id: 5, title: "pg_rewind", slug: "pg-rewind", description: "Возврат старого мастера, принцип работы, ограничения", duration: "45 мин" },
      { id: 6, title: "Возврат старого мастера", slug: "old-master-return", description: "Пошаговый процесс восстановления бывшего мастера как реплики", duration: "40 мин" },
      { id: 7, title: "Синхронизация", slug: "resync", description: "Полная и инкрементальная ресинхронизация данных", duration: "35 мин" },
      { id: 8, title: "Тестирование", slug: "testing", description: "Chaos engineering, плановое тестирование failover", duration: "30 мин" },
      { id: 9, title: "Итоговое задание", slug: "final-task", description: "Полный цикл failover и восстановления", duration: "50 мин" },
    ],
  },
];

export function getModule(id: number): Module | undefined {
  return MODULES.find((m) => m.id === id);
}

export function getLesson(moduleId: number, lessonId: number): Lesson | undefined {
  const mod = getModule(moduleId);
  return mod?.lessons.find((l) => l.id === lessonId);
}
