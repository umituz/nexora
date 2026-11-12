#!/bin/bash

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Konfigürasyon
CONFIG_FILE="notification_config.json"
LOG_FILE="notification.log"

# Bildirim türleri
declare -A NOTIFICATION_TYPES=(
    ["email"]="email/email_notification.sh"
    ["push"]="push/push_notification.sh"
    ["sms"]="sms/sms_notification.sh"
    ["slack"]="slack/slack_notification.sh"
)

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Bildirim gönderme fonksiyonu
send_notification() {
    local type=$1
    local message=$2
    local recipients=$3

    if [[ -f "${NOTIFICATION_TYPES[$type]}" ]]; then
        bash "${NOTIFICATION_TYPES[$type]}" "$message" "$recipients"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ $type bildirimi başarıyla gönderildi${NC}"
            log "SUCCESS: $type bildirimi gönderildi - Alıcılar: $recipients"
        else
            echo -e "${RED}✗ $type bildirimi gönderilemedi${NC}"
            log "ERROR: $type bildirimi başarısız - Alıcılar: $recipients"
        fi
    else
        echo -e "${RED}✗ Geçersiz bildirim türü: $type${NC}"
        log "ERROR: Geçersiz bildirim türü - $type"
    fi
}

# Bildirim kuyruğu yönetimi
process_notification_queue() {
    if [[ -f "notification_queue.json" ]]; then
        while IFS= read -r line; do
            type=$(echo "$line" | jq -r '.type')
            message=$(echo "$line" | jq -r '.message')
            recipients=$(echo "$line" | jq -r '.recipients')
            send_notification "$type" "$message" "$recipients"
        done < notification_queue.json
    fi
}

# Ana menü
show_menu() {
    echo -e "${YELLOW}Bildirim Yönetim Sistemi${NC}"
    echo "1. Email Bildirimi Gönder"
    echo "2. Push Bildirimi Gönder"
    echo "3. SMS Bildirimi Gönder"
    echo "4. Slack Bildirimi Gönder"
    echo "5. Bildirim Kuyruğunu İşle"
    echo "6. Bildirim Loglarını Görüntüle"
    echo "7. Çıkış"
}

# Ana döngü
while true; do
    show_menu
    read -p "Seçiminiz (1-7): " choice

    case $choice in
        1) send_notification "email" "$message" "$recipients" ;;
        2) send_notification "push" "$message" "$recipients" ;;
        3) send_notification "sms" "$message" "$recipients" ;;
        4) send_notification "slack" "$message" "$recipients" ;;
        5) process_notification_queue ;;
        6) tail -f "$LOG_FILE" ;;
        7) exit 0 ;;
        *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
    esac
done
