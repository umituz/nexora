#!/bin/bash

# Veritabanı bakım görevi için örnek şablon
DB_HOST="localhost"
DB_USER="root"
DB_PASS="password"
DB_NAME="database"

# Renkli çıktı
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Veritabanı bağlantı kontrolü
check_connection() {
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1" &>/dev/null

    if [ $? -eq 0 ]; then
        log "${GREEN}Veritabanı bağlantısı başarılı${NC}"
        return 0
    else
        log "${RED}Veritabanı bağlantısı başarısız${NC}"
        return 1
    fi
}

# Tablo optimizasyonu
optimize_tables() {
    local tables=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES" | grep -v "Tables_in")

    for table in $tables; do
        log "Tablo optimize ediliyor: $table"
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "OPTIMIZE TABLE $table"
    done
}

# İndeks analizi
analyze_indexes() {
    local tables=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES" | grep -v "Tables_in")

    for table in $tables; do
        log "İndeks analizi yapılıyor: $table"
        mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "ANALYZE TABLE $table"
    done
}

# Geçici tablolar temizliği
cleanup_temp_tables() {
    log "Geçici tablolar temizleniyor"
    mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SHOW TABLES LIKE '%_temp%'" | \
    while read table; do
        if [ ! -z "$table" ]; then
            mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "DROP TABLE IF EXISTS $table"
            log "Geçici tablo silindi: $table"
        fi
    done
}

# Ana işlem
main() {
    if ! check_connection; then
        exit 1
    fi

    optimize_tables
    analyze_indexes
    cleanup_temp_tables

    log "${GREEN}Veritabanı bakımı tamamlandı${NC}"
    exit 0
}

main "$@"
