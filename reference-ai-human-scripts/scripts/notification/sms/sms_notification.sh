#!/bin/bash

# SMS Gateway için gerekli değişkenler
SMS_API_KEY="your_sms_api_key"
SMS_API_URL="https://api.smsgateway.com/send"
SENDER_ID="SYSTEM"

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Log dosyası
LOG_FILE="../notification.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SMS] $1" >> "$LOG_FILE"
}

# SMS gönderme fonksiyonu
send_sms() {
    local message="$1"
    local phone="$2"

    # SMS Gateway'e POST isteği gönder
    response=$(curl -X POST "${SMS_API_URL}" \
                   -H "Authorization: Bearer ${SMS_API_KEY}" \
                   -H "Content-Type: application/json" \
                   -d "{
                       \"sender_id\": \"${SENDER_ID}\",
                       \"phone\": \"${phone}\",
                       \"message\": \"${message}\"
                   }")

    if [[ $response == *"\"success\":true"* ]]; then
        echo -e "${GREEN}✓ SMS başarıyla gönderildi${NC}"
        log "SUCCESS: SMS gönderildi - Telefon: ${phone}"
        return 0
    else
        echo -e "${RED}✗ SMS gönderilemedi${NC}"
        log "ERROR: SMS gönderilemedi - Telefon: ${phone}"
        return 1
    fi
}

# Ana fonksiyon
main() {
    if [ "$#" -lt 2 ]; then
        echo "Kullanım: $0 <mesaj> <telefon_numarası>"
        exit 1
    fi

    local message="$1"
    local phone="$2"

    send_sms "$message" "$phone"
}

# Script çalıştırma
main "$@"
