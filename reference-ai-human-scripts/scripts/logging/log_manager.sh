#!/bin/bash

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Sabit değişkenler
CONFIG_DIR="config"
LOGS_DIR="logs"
SYSTEM_DIR="system"
APP_DIR="application"
SECURITY_DIR="security"
AUDIT_DIR="audit"
ARCHIVE_DIR="archive"
REPORTS_DIR="reports"
CONFIG_FILE="$CONFIG_DIR/log_config.json"
LOG_FILE="$LOGS_DIR/log_manager.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Sistem loglarını izleme
monitor_system_logs() {
    local log_file=${1:-/var/log/system.log}
    local lines=${2:-50}
    local interval=${3:-5}

    log "${BLUE}Sistem logları izleniyor: $log_file${NC}"

    while true; do
        echo -e "\n${YELLOW}Son $lines satır:${NC}"
        tail -n "$lines" "$log_file"

        # Kritik hataları kontrol et
        grep -i "error\|failed\|critical" "$log_file" | tail -n 5

        sleep "$interval"
        clear
    done
}

# Uygulama loglarını izleme
monitor_app_logs() {
    local app_name=$1
    local log_file=$2
    local lines=${3:-50}
    local interval=${4:-5}

    log "${BLUE}Uygulama logları izleniyor: $app_name${NC}"

    while true; do
        echo -e "\n${YELLOW}$app_name - Son $lines satır:${NC}"
        tail -n "$lines" "$log_file"

        # Hata ve uyarıları kontrol et
        echo -e "\n${YELLOW}Hatalar ve Uyarılar:${NC}"
        grep -i "error\|warning\|exception" "$log_file" | tail -n 5

        sleep "$interval"
        clear
    done
}

# Güvenlik loglarını izleme
monitor_security_logs() {
    local log_file=${1:-/var/log/auth.log}
    local lines=${2:-50}
    local interval=${3:-5}

    log "${BLUE}Güvenlik logları izleniyor: $log_file${NC}"

    while true; do
        echo -e "\n${YELLOW}Son $lines satır:${NC}"
        tail -n "$lines" "$log_file"

        # Güvenlik olaylarını kontrol et
        echo -e "\n${YELLOW}Güvenlik Olayları:${NC}"
        grep -i "failed\|invalid\|unauthorized\|attack" "$log_file" | tail -n 5

        sleep "$interval"
        clear
    done
}

# Audit loglarını izleme
monitor_audit_logs() {
    local log_file=${1:-/var/log/audit/audit.log}
    local lines=${2:-50}
    local interval=${3:-5}

    log "${BLUE}Audit logları izleniyor: $log_file${NC}"

    while true; do
        echo -e "\n${YELLOW}Son $lines satır:${NC}"
        tail -n "$lines" "$log_file"

        # Önemli audit olaylarını kontrol et
        echo -e "\n${YELLOW}Önemli Audit Olayları:${NC}"
        grep -i "user\|permission\|sudo" "$log_file" | tail -n 5

        sleep "$interval"
        clear
    done
}

# Log rotasyonu
rotate_logs() {
    local log_dir=$1
    local max_size=${2:-100M}
    local retention=${3:-30}

    log "${BLUE}Log rotasyonu başlatılıyor: $log_dir${NC}"

    # Boyutu aşan logları sıkıştır
    find "$log_dir" -type f -size +"$max_size" -name "*.log" | while read -r file; do
        gzip "$file"
        mv "$file.gz" "$ARCHIVE_DIR/$(basename "$file")_$(date +%Y%m%d).gz"
        log "${GREEN}✓ Log arşivlendi: $file${NC}"
    done

    # Eski arşivleri temizle
    find "$ARCHIVE_DIR" -type f -mtime +"$retention" -delete

    log "${GREEN}✓ Log rotasyonu tamamlandı${NC}"
}

# Log analizi
analyze_logs() {
    local log_file=$1
    local report_file="$REPORTS_DIR/analysis_$(date +%Y%m%d).txt"

    log "${BLUE}Log analizi başlatılıyor: $log_file${NC}"

    {
        echo "Log Analiz Raporu - $(date)"
        echo "=========================="
        echo

        echo "En Sık Karşılaşılan Hatalar:"
        grep -i "error" "$log_file" | sort | uniq -c | sort -nr | head -n 10

        echo -e "\nEn Aktif IP Adresleri:"
        grep -o '[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}\.[0-9]\{1,3\}' "$log_file" | sort | uniq -c | sort -nr | head -n 10

        echo -e "\nSaat Bazlı Aktivite:"
        awk '{print $1}' "$log_file" | cut -d: -f1 | sort | uniq -c

        echo -e "\nÖnemli Güvenlik Olayları:"
        grep -i "attack\|hack\|breach\|unauthorized" "$log_file"

    } > "$report_file"

    log "${GREEN}✓ Log analizi tamamlandı: $report_file${NC}"
}

# Log temizleme
cleanup_logs() {
    local log_dir=$1
    local days=${2:-30}

    log "${BLUE}Log temizliği başlatılıyor: $log_dir${NC}"

    # Eski logları temizle
    find "$log_dir" -type f -name "*.log" -mtime +"$days" -delete
    find "$log_dir" -type f -name "*.gz" -mtime +"$days" -delete

    log "${GREEN}✓ Log temizliği tamamlandı${NC}"
}

# Log arama
search_logs() {
    local search_term=$1
    local log_dir=$2
    local context=${3:-3}

    log "${BLUE}Loglarda arama yapılıyor: $search_term${NC}"

    echo -e "\n${YELLOW}Arama Sonuçları:${NC}"
    find "$log_dir" -type f -name "*.log" -exec grep -l "$search_term" {} \; | while read -r file; do
        echo -e "\n${BLUE}=== $file ===${NC}"
        grep -A "$context" -B "$context" "$search_term" "$file"
    done
}

# Ana menü
show_menu() {
    echo -e "\n${YELLOW}Log Yönetim Menüsü${NC}"
    echo "1. Sistem Loglarını İzle"
    echo "2. Uygulama Loglarını İzle"
    echo "3. Güvenlik Loglarını İzle"
    echo "4. Audit Loglarını İzle"
    echo "5. Log Rotasyonu"
    echo "6. Log Analizi"
    echo "7. Log Temizleme"
    echo "8. Log Arama"
    echo "9. Çıkış"
}

# Dizinleri oluştur
mkdir -p "$CONFIG_DIR" "$LOGS_DIR" "$SYSTEM_DIR" "$APP_DIR" "$SECURITY_DIR" "$AUDIT_DIR" "$ARCHIVE_DIR" "$REPORTS_DIR"

# Ana döngü
while true; do
    show_menu
    read -p "Seçiminiz (1-9): " choice

    case $choice in
        1)
            read -p "Log dosyası (varsayılan: /var/log/system.log): " log_file
            read -p "Satır sayısı (varsayılan: 50): " lines
            read -p "Yenileme aralığı (saniye, varsayılan: 5): " interval
            monitor_system_logs "${log_file:-/var/log/system.log}" "${lines:-50}" "${interval:-5}"
            ;;
        2)
            read -p "Uygulama adı: " app_name
            read -p "Log dosyası: " log_file
            read -p "Satır sayısı (varsayılan: 50): " lines
            read -p "Yenileme aralığı (saniye, varsayılan: 5): " interval
            monitor_app_logs "$app_name" "$log_file" "${lines:-50}" "${interval:-5}"
            ;;
        3)
            read -p "Log dosyası (varsayılan: /var/log/auth.log): " log_file
            read -p "Satır sayısı (varsayılan: 50): " lines
            read -p "Yenileme aralığı (saniye, varsayılan: 5): " interval
            monitor_security_logs "${log_file:-/var/log/auth.log}" "${lines:-50}" "${interval:-5}"
            ;;
        4)
            read -p "Log dosyası (varsayılan: /var/log/audit/audit.log): " log_file
            read -p "Satır sayısı (varsayılan: 50): " lines
            read -p "Yenileme aralığı (saniye, varsayılan: 5): " interval
            monitor_audit_logs "${log_file:-/var/log/audit/audit.log}" "${lines:-50}" "${interval:-5}"
            ;;
        5)
            read -p "Log dizini: " log_dir
            read -p "Maksimum boyut (varsayılan: 100M): " max_size
            read -p "Retention süresi (gün, varsayılan: 30): " retention
            rotate_logs "$log_dir" "${max_size:-100M}" "${retention:-30}"
            ;;
        6)
            read -p "Analiz edilecek log dosyası: " log_file
            analyze_logs "$log_file"
            ;;
        7)
            read -p "Temizlenecek log dizini: " log_dir
            read -p "Gün sayısı (varsayılan: 30): " days
            cleanup_logs "$log_dir" "${days:-30}"
            ;;
        8)
            read -p "Arama terimi: " search_term
            read -p "Log dizini: " log_dir
            read -p "Bağlam satır sayısı (varsayılan: 3): " context
            search_logs "$search_term" "$log_dir" "${context:-3}"
            ;;
        9)
            exit 0
            ;;
        *)
            echo -e "${RED}Geçersiz seçim!${NC}"
            ;;
    esac
done
