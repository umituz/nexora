#!/bin/bash

# Email gönderimi için gerekli değişkenler
SMTP_SERVER="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASS="your_password"
FROM_EMAIL="noreply@example.com"

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Log dosyası
LOG_FILE="../notification.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [EMAIL] $1" >> "$LOG_FILE"
}

# Email gönderme fonksiyonu
send_email() {
    local subject="$1"
    local recipients="$2"
    local message="$3"
    local attachments="$4"

    # Email gönderimi için curl kullanımı
    curl --url "smtp://${SMTP_SERVER}:${SMTP_PORT}" \
         --ssl-reqd \
         --mail-from "${FROM_EMAIL}" \
         --mail-rcpt "${recipients}" \
         --upload-file - \
         --user "${SMTP_USER}:${SMTP_PASS}" \
         -H "Subject: ${subject}" \
         -H "From: ${FROM_EMAIL}" \
         -H "To: ${recipients}" \
         -d "${message}"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Email başarıyla gönderildi${NC}"
        log "SUCCESS: Email gönderildi - Alıcı: ${recipients}"
        return 0
    else
        echo -e "${RED}✗ Email gönderilemedi${NC}"
        log "ERROR: Email gönderilemedi - Alıcı: ${recipients}"
        return 1
    fi
}

# Ana fonksiyon
main() {
    if [ "$#" -lt 2 ]; then
        echo "Kullanım: $0 <mesaj> <alıcılar>"
        exit 1
    fi

    local message="$1"
    local recipients="$2"
    local subject="Sistem Bildirimi"

    send_email "$subject" "$recipients" "$message"
}

# Script çalıştırma
main "$@"
