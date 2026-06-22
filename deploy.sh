#!/bin/bash

# === Конфигурация ===
SERVER_ALIAS="koderstudio"
REMOTE_DIR="/var/www/pg-practikum"
SYSTEMD_SERVICE="pg-practikum"
LOGFILE="$HOME/logs/deploy-pg-practikum-web.log"

# === Цвета ===
GREEN='\033[32m'
BLUE='\033[34m'
YELLOW='\033[33m'
RED='\033[31m'
NC='\033[0m'

log() {
  local level="$1"
  local message="$2"
  echo -e "$(date "+%Y-%m-%d %T") [$level] $message" | tee -a "$LOGFILE"
}

info()    { echo -e "${BLUE}[*] $1${NC}" | tee -a "$LOGFILE"; }
success() { echo -e "${GREEN}[✓] $1${NC}" | tee -a "$LOGFILE"; }
warn()    { echo -e "${YELLOW}[!] $1${NC}" | tee -a "$LOGFILE"; }
error()   { echo -e "${RED}[✗] $1${NC}" | tee -a "$LOGFILE"; }

# === Ввод коммита ===
MESSAGE=$1
if [ -z "$MESSAGE" ]; then
    echo -n "Введите сообщение коммита: "
    read -r MESSAGE
fi

if [ -z "$MESSAGE" ]; then
    echo "Ошибка: Сообщение коммита обязательно."
    exit 1
fi

mkdir -p "$(dirname "$LOGFILE")"
log "INFO" "Запуск деплоя pg-practikum-web. Коммит: '$MESSAGE'"

echo "========================================"
echo "  ДЕПЛОЙ: pg-practikum-web"
echo "========================================"

# 1. Git status
info "1. Проверка изменений..."
git status

# 2. Коммит и пуш
info "2. Фиксация изменений..."
git add .
git commit -m "$MESSAGE" || { warn "Нет изменений для коммита."; }
git push origin main || { error "Ошибка git push."; exit 1; }

# 3. Деплой на сервер
info "3. Деплой на сервер $SERVER_ALIAS..."
REMOTE_COMMANDS="
  set -e
  echo '  -> Переход в $REMOTE_DIR...'
  cd $REMOTE_DIR

  echo '  -> Git pull...'
  git pull origin main

  echo '  -> npm install...'
  npm install

  echo '  -> npm run build...'
  npm run build

  echo '  -> chown...'
  chown -R koder:koder $REMOTE_DIR

  echo '  -> Перезапуск $SYSTEMD_SERVICE...'
  systemctl restart $SYSTEMD_SERVICE

  echo '  -> Проверка статуса...'
  systemctl is-active --quiet $SYSTEMD_SERVICE && echo '    Сервис активен!' || echo '    ВНИМАНИЕ: Сервис не запустился!'
"

ssh "$SERVER_ALIAS" "$REMOTE_COMMANDS" || {
  error "Ошибка при деплое на сервер!"
  exit 1
}

success "Деплой завершен!"
