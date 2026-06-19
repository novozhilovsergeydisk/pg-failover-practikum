# PG Practikum

Практикум по физическому резервированию кластера PostgreSQL с потоковой репликацией.

## Быстрый старт

```bash
npm install
npm run dev
```

Откройте http://localhost:3000

## Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка production |
| `npm run start` | Запуск production |
| `npm run pass:reset <email> <пароль>` | Сброс пароля пользователя |
| `npm run task <command>` | Управление задачами (add, list, done, edit, remove) |

## Сброс пароля

Требуется JWT токен администратора:

```bash
npm run pass:reset admin@koderstudio.ru mypassword123 <jwt-token>
```

## Управление задачами

Задачи хранятся в PostgreSQL (БД `pg_practikum`).

```bash
npm run task add "Название задачи" --desc "Описание" --priority 1
npm run task list
npm run task list --status open
npm run task done <id>
npm run task edit <id> --title "Новое название" --status done
npm run task remove <id>
```

## Стек

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL (для практикума и авторизации)
- bcrypt (хеширование паролей)
- JWT (сессии)

## Структура

```
src/
├── app/            # Страницы и API
├── components/     # UI компоненты
├── lib/            # Утилиты (auth, db, utils)
scripts/            # CLI скрипты
```

## Деплой

```bash
rsync -avz --exclude 'node_modules' --exclude '.next' . appuse:/var/www/pg-practikum/
ssh appuse "cd /var/www/pg-practikum && npm run build && systemctl restart pg-practikum"
```
