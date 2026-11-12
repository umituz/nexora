#!/bin/bash

# Slack webhook için gerekli değişkenler
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/your/webhook/url"

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Log dosyası
LOG_FILE="../notification.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SLACK] $1" >> "$LOG_FILE"
}

# Slack mesajı gönderme fonksiyonu
send_slack_message() {
    local message="$1"
    local channel="$2"

    # Slack mesajı için JSON oluştur
    local json_data="{
        \"channel\": \"${channel}\",
        \"text\": \"${message}\",
        \"username\": \"System Notification\",
        \"icon_emoji\": \":bell:\"
    }"

    # Slack webhook'a POST isteği gönder
    response=$(curl -X POST -H 'Content-type: application/json' \
                    --data "${json_data}" \
                    "${SLACK_WEBHOOK_URL}")

    if [ "$response" == "ok" ]; then
        echo -e "${GREEN}✓ Slack mesajı başarıyla gönderildi${NC}"
        log "SUCCESS: Slack mesajı gönderildi - Kanal: ${channel}"
        return 0
    else
        echo -e "${RED}✗ Slack mesajı gönderilemedi${NC}"
        log "ERROR: Slack mesajı gönderilemedi - Kanal: ${channel}"
        return 1
    fi
}

# Ana fonksiyon
main() {
    if [ "$#" -lt 2 ]; then
        echo "Kullanım: $0 <mesaj> <kanal>"
        exit 1
    fi

    local message="$1"
    local channel="$2"

    send_slack_message "$message" "$channel"
}

# Script çalıştırma
main "$@"
