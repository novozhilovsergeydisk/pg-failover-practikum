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

## Сброс пароля

```bash
npm run pass:reset admin@koderstudio.ru mypassword123
```

## Стек

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4
- PostgreSQL (для практикума)

## Структура

```
src/
├── app/            # Страницы и API
├── components/     # UI компоненты
├── lib/            # Утилиты
scripts/            # CLI скрипты
data/               # Данные пользователей (users.json)
```

## Деплой

```bash
rsync -avz --exclude 'node_modules' --exclude '.next' . appuse:/var/www/pg-practikum/
ssh appuse "cd /var/www/pg-practikum && npm run build && systemctl restart pg-practikum"
```
