#!/bin/bash

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Sabit değişkenler
TASKS_DIR="tasks"
LOGS_DIR="logs"
CONFIG_DIR="config"
TASK_CONFIG="$CONFIG_DIR/tasks.json"
LOG_FILE="$LOGS_DIR/scheduler.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Task çalıştırma fonksiyonu
run_task() {
    local task_name=$1
    local task_script=$2
    local task_schedule=$3

    log "${BLUE}Task başlatılıyor: $task_name${NC}"

    if [ -f "$TASKS_DIR/$task_script" ]; then
        bash "$TASKS_DIR/$task_script" > "$LOGS_DIR/${task_name}.log" 2>&1

        if [ $? -eq 0 ]; then
            log "${GREEN}✓ Task başarıyla tamamlandı: $task_name${NC}"
        else
            log "${RED}✗ Task başarısız oldu: $task_name${NC}"
        fi
    else
        log "${RED}✗ Task script bulunamadı: $task_script${NC}"
    fi
}

# Cron expression kontrolü
validate_cron() {
    local schedule=$1
    if [[ ! $schedule =~ ^[0-9*,/-]+[[:space:]][0-9*,/-]+[[:space:]][0-9*,/-]+[[:space:]][0-9*,/-]+[[:space:]][0-9*,/-]+$ ]]; then
        return 1
    fi
    return 0
}

# Task ekleme
add_task() {
    local name=$1
    local script=$2
    local schedule=$3

    if ! validate_cron "$schedule"; then
        log "${RED}Geçersiz cron expression: $schedule${NC}"
        return 1
    fi

    # Task konfigürasyonunu JSON'a ekle
    if [ -f "$TASK_CONFIG" ]; then
        local temp_file=$(mktemp)
        jq --arg name "$name" \
           --arg script "$script" \
           --arg schedule "$schedule" \
           '.tasks += [{"name": $name, "script": $script, "schedule": $schedule}]' \
           "$TASK_CONFIG" > "$temp_file"
        mv "$temp_file" "$TASK_CONFIG"
    else
        echo '{"tasks":[]}' | jq --arg name "$name" \
                                --arg script "$script" \
                                --arg schedule "$schedule" \
                                '.tasks += [{"name": $name, "script": $script, "schedule": $schedule}]' \
                                > "$TASK_CONFIG"
    fi

    # Crontab'a ekle
    (crontab -l 2>/dev/null; echo "$schedule cd $(pwd) && $TASKS_DIR/$script >> $LOGS_DIR/${name}.log 2>&1") | crontab -

    log "${GREEN}✓ Task başarıyla eklendi: $name${NC}"
}

# Task silme
remove_task() {
    local name=$1

    # JSON'dan task'ı sil
    if [ -f "$TASK_CONFIG" ]; then
        local temp_file=$(mktemp)
        jq --arg name "$name" '.tasks = [.tasks[] | select(.name != $name)]' "$TASK_CONFIG" > "$temp_file"
        mv "$temp_file" "$TASK_CONFIG"
    fi

    # Crontab'dan sil
    crontab -l | grep -v "$name" | crontab -

    log "${GREEN}✓ Task başarıyla silindi: $name${NC}"
}

# Task listesi
list_tasks() {
    echo -e "${YELLOW}Zamanlanmış Görevler:${NC}"
    if [ -f "$TASK_CONFIG" ]; then
        jq -r '.tasks[] | "İsim: \(.name)\nScript: \(.script)\nZamanlama: \(.schedule)\n"' "$TASK_CONFIG"
    else
        echo "Henüz task bulunmuyor."
    fi
}

# Ana menü
show_menu() {
    echo -e "\n${YELLOW}Task Scheduler Menü${NC}"
    echo "1. Task Ekle"
    echo "2. Task Sil"
    echo "3. Task Listesi"
    echo "4. Task Loglarını Görüntüle"
    echo "5. Çıkış"
}

# Dizinleri oluştur
mkdir -p "$TASKS_DIR" "$LOGS_DIR" "$CONFIG_DIR"

# Ana döngü
while true; do
    show_menu
    read -p "Seçiminiz (1-5): " choice

    case $choice in
        1)
            read -p "Task adı: " name
            read -p "Script dosyası: " script
            read -p "Cron zamanlama (*/5 * * * *): " schedule
            add_task "$name" "$script" "$schedule"
            ;;
        2)
            read -p "Silinecek task adı: " name
            remove_task "$name"
            ;;
        3)
            list_tasks
            ;;
        4)
            if [ -d "$LOGS_DIR" ]; then
                echo -e "${YELLOW}Log Dosyaları:${NC}"
                ls -l "$LOGS_DIR"
                read -p "Görüntülenecek log dosyası: " log_file
                if [ -f "$LOGS_DIR/$log_file" ]; then
                    tail -f "$LOGS_DIR/$log_file"
                else
                    echo -e "${RED}Log dosyası bulunamadı${NC}"
                fi
            fi
            ;;
        5)
            exit 0
            ;;
        *)
            echo -e "${RED}Geçersiz seçim!${NC}"
            ;;
    esac
done
