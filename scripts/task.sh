#!/bin/bash

# Task tracker for pg-practikum-web project
# Usage: ./task.sh <command> [args]
#
# Commands:
#   add <title> [--desc "description"] [--priority N]  - Add new task
#   list [--status open|in_progress|done|blocked]      - List tasks
#   done <id>                                          - Mark task as done
#   edit <id> [--title "new title"] [--desc "new desc"] [--status S] [--priority N]
#   remove <id>                                        - Remove task

set -e

DB_NAME="pg_practikum"
DB_USER="postgres"

psql_cmd() {
    psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "$1"
}

cmd_add() {
    local title=""
    local desc=""
    local priority=0

    while [[ $# -gt 0 ]]; do
        case $1 in
            --desc) desc="$2"; shift 2 ;;
            --priority) priority="$2"; shift 2 ;;
            *) title="$1"; shift ;;
        esac
    done

    if [[ -z "$title" ]]; then
        echo "Usage: task.sh add <title> [--desc \"description\"] [--priority N]"
        exit 1
    fi

    local id
    id=$(psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "INSERT INTO tasks (title, description, priority) VALUES ('$title', '$desc', $priority) RETURNING id;" | head -1)
    echo "Task #$id created: $title"
}

cmd_list() {
    local status_filter=""
    while [[ $# -gt 0 ]]; do
        case $1 in
            --status) status_filter="$2"; shift 2 ;;
            *) shift ;;
        esac
    done

    local query="SELECT id, title, status, priority, created_at FROM tasks"
    if [[ -n "$status_filter" ]]; then
        query="$query WHERE status = '$status_filter'"
    fi
    query="$query ORDER BY priority DESC, created_at;"

    echo ""
    echo "=== Tasks ==="
    echo ""
    psql -U "$DB_USER" -d "$DB_NAME" -c "SELECT id AS \"ID\", title AS \"Title\", status AS \"Status\", priority AS \"Priority\", TO_CHAR(created_at, 'YYYY-MM-DD HH:MI') AS \"Created\" FROM tasks $([ -n "$status_filter" ] && echo "WHERE status = '$status_filter'") ORDER BY priority DESC, created_at;"
    echo ""
}

cmd_done() {
    local id="$1"
    if [[ -z "$id" ]]; then
        echo "Usage: task.sh done <id>"
        exit 1
    fi

    local result
    result=$(psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "UPDATE tasks SET status = 'done', completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $id RETURNING title;" | head -1)

    if [[ -z "$result" ]]; then
        echo "Task #$id not found"
        exit 1
    fi
    echo "Task #$id completed: $result"
}

cmd_edit() {
    local id="$1"
    shift

    if [[ -z "$id" ]]; then
        echo "Usage: task.sh edit <id> [--title \"new title\"] [--desc \"new desc\"] [--status S] [--priority N]"
        exit 1
    fi

    local updates=""
    while [[ $# -gt 0 ]]; do
        case $1 in
            --title) updates="$updates, title = '$2'"; shift 2 ;;
            --desc) updates="$updates, description = '$2'"; shift 2 ;;
            --status) updates="$updates, status = '$2'"; shift 2 ;;
            --priority) updates="$updates, priority = $2"; shift 2 ;;
            *) shift ;;
        esac
    done

    if [[ -z "$updates" ]]; then
        echo "Nothing to update. Use --title, --desc, --status, --priority"
        exit 1
    fi

    updates="${updates:2}"
    local result
    result=$(psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "UPDATE tasks SET $updates, updated_at = CURRENT_TIMESTAMP WHERE id = $id RETURNING title;" | head -1)

    if [[ -z "$result" ]]; then
        echo "Task #$id not found"
        exit 1
    fi
    echo "Task #$id updated: $result"
}

cmd_remove() {
    local id="$1"
    if [[ -z "$id" ]]; then
        echo "Usage: task.sh remove <id>"
        exit 1
    fi

    local result
    result=$(psql -U "$DB_USER" -d "$DB_NAME" -t -A -c "DELETE FROM tasks WHERE id = $id RETURNING title;" | head -1)

    if [[ -z "$result" ]]; then
        echo "Task #$id not found"
        exit 1
    fi
    echo "Task #$id removed: $result"
}

case "${1:-help}" in
    add) shift; cmd_add "$@" ;;
    list) shift; cmd_list "$@" ;;
    done) shift; cmd_done "$@" ;;
    edit) shift; cmd_edit "$@" ;;
    remove) shift; cmd_remove "$@" ;;
    help|*)
        echo "Usage: task.sh <command> [args]"
        echo ""
        echo "Commands:"
        echo "  add <title> [--desc \"description\"] [--priority N]  - Add new task"
        echo "  list [--status open|in_progress|done|blocked]      - List tasks"
        echo "  done <id>                                          - Mark task as done"
        echo "  edit <id> [--title \"new title\"] [--desc \"new desc\"] [--status S] [--priority N]"
        echo "  remove <id>                                        - Remove task"
        ;;
esac
