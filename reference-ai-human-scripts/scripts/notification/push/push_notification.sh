#!/bin/bash

# Firebase Cloud Messaging için gerekli değişkenler
FCM_SERVER_KEY="your_fcm_server_key"
FCM_URL="https://fcm.googleapis.com/fcm/send"

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Log dosyası
LOG_FILE="../notification.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PUSH] $1" >> "$LOG_FILE"
}

# Push bildirimi gönderme fonksiyonu
send_push() {
    local message="$1"
    local token="$2"

    # FCM isteği için JSON oluştur
    local json_data="{
        \"to\": \"${token}\",
        \"notification\": {
            \"title\": \"Sistem Bildirimi\",
            \"body\": \"${message}\",
            \"sound\": \"default\"
        },
        \"data\": {
            \"click_action\": \"FLUTTER_NOTIFICATION_CLICK\",
            \"type\": \"notification\"
        }
    }"

    # FCM'e POST isteği gönder
    response=$(curl -X POST -H "Authorization: key=${FCM_SERVER_KEY}" \
                    -H "Content-Type: application/json" \
                    -d "${json_data}" \
                    "${FCM_URL}")

    if [[ $response == *"\"success\":1"* ]]; then
        echo -e "${GREEN}✓ Push bildirimi başarıyla gönderildi${NC}"
        log "SUCCESS: Push bildirimi gönderildi - Token: ${token}"
        return 0
    else
        echo -e "${RED}✗ Push bildirimi gönderilemedi${NC}"
        log "ERROR: Push bildirimi başarısız - Token: ${token}"
        return 1
    fi
}

# Ana fonksiyon
main() {
    if [ "$#" -lt 2 ]; then
        echo "Kullanım: $0 <mesaj> <device_token>"
        exit 1
    fi

    local message="$1"
    local token="$2"

    send_push "$message" "$token"
}

# Script çalıştırma
main "$@"
