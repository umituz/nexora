#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
DB_ROOT="database_management"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_DIR="$DB_ROOT/$TIMESTAMP"
LOG_FILE="$DB_DIR/db_management.log"
REPORT_FILE="$DB_DIR/db_report.html"
BACKUP_DIR="$DB_ROOT/backups"

# Veritabanı bağlantı bilgileri
DB_HOST="localhost"
DB_PORT="3306"
DB_USER="root"
DB_PASS="root"
DB_NAME="myapp"

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Veritabanı Yönetim Scripti"
    echo "===================================="

    mkdir -p "$DB_DIR" "$BACKUP_DIR"
    touch "$LOG_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# MySQL bağlantı kontrolü
check_mysql_connection() {
    log "${BLUE}MySQL bağlantısı kontrol ediliyor...${NC}"

    if mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1" >/dev/null 2>&1; then
        log "${GREEN}MySQL bağlantısı başarılı${NC}"
        return 0
    else
        log "${RED}MySQL bağlantısı başarısız${NC}"
        return 1
    fi
}

# Veritabanı boyut analizi
analyze_database_size() {
    log "${BLUE}Veritabanı boyutu analiz ediliyor...${NC}"

    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" -e "
        SELECT 
            table_schema as 'Database',
            ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as 'Size (MB)'
        FROM information_schema.tables
        GROUP BY table_schema;
    " > "$DB_DIR/database_sizes.txt"

    log "${GREEN}Veritabanı boyut analizi tamamlandı${NC}"
}

# Tablo analizi
analyze_tables() {
    log "${BLUE}Tablolar analiz ediliyor...${NC}"

    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
        SELECT 
            table_name as 'Table',
            table_rows as 'Rows',
            ROUND((data_length + index_length) / 1024 / 1024, 2) as 'Size (MB)',
            engine as 'Engine'
        FROM information_schema.tables
        WHERE table_schema = '$DB_NAME';
    " > "$DB_DIR/table_analysis.txt"

    log "${GREEN}Tablo analizi tamamlandı${NC}"
}

# İndeks analizi
analyze_indexes() {
    log "${BLUE}İndeksler analiz ediliyor...${NC}"

    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
        SELECT 
            table_name as 'Table',
            index_name as 'Index',
            column_name as 'Column',
            non_unique as 'Non Unique'
        FROM information_schema.statistics
        WHERE table_schema = '$DB_NAME'
        ORDER BY table_name, index_name;
    " > "$DB_DIR/index_analysis.txt"

    log "${GREEN}İndeks analizi tamamlandı${NC}"
}

# Yavaş sorgu analizi
analyze_slow_queries() {
    log "${BLUE}Yavaş sorgular analiz ediliyor...${NC}"

    if [ -f "/var/log/mysql/mysql-slow.log" ]; then
        mysqldumpslow /var/log/mysql/mysql-slow.log > "$DB_DIR/slow_queries.txt"
        log "${GREEN}Yavaş sorgu analizi tamamlandı${NC}"
    else
        log "${YELLOW}Yavaş sorgu logu bulunamadı${NC}"
    fi
}

# Veritabanı optimizasyonu
optimize_database() {
    log "${BLUE}Veritabanı optimize ediliyor...${NC}"

    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
        SELECT CONCAT('OPTIMIZE TABLE ', table_name, ';')
        FROM information_schema.tables
        WHERE table_schema = '$DB_NAME';
    " | mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME"

    log "${GREEN}Veritabanı optimizasyonu tamamlandı${NC}"
}

# Veritabanı yedekleme
backup_database() {
    log "${BLUE}Veritabanı yedekleniyor...${NC}"

    mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" \
        --single-transaction \
        --routines \
        --triggers \
        --events \
        "$DB_NAME" > "$BACKUP_DIR/backup_$TIMESTAMP.sql"

    # Yedeklemeyi sıkıştır
    gzip "$BACKUP_DIR/backup_$TIMESTAMP.sql"

    log "${GREEN}Veritabanı yedekleme tamamlandı${NC}"
}

# Rapor oluştur
create_database_report() {
    log "${BLUE}Veritabanı raporu oluşturuluyor...${NC}"

    cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Veritabanı Yönetim Raporu</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <h1>Veritabanı Yönetim Raporu</h1>
    <p>Tarih: $(date)</p>

    <div class="section">
        <h2>Veritabanı Boyutları</h2>
        <pre>$(cat "$DB_DIR/database_sizes.txt")</pre>
    </div>

    <div class="section">
        <h2>Tablo Analizi</h2>
        <pre>$(cat "$DB_DIR/table_analysis.txt")</pre>
    </div>

    <div class="section">
        <h2>İndeks Analizi</h2>
        <pre>$(cat "$DB_DIR/index_analysis.txt")</pre>
    </div>

    <div class="section">
        <h2>Yavaş Sorgular</h2>
        <pre>$(cat "$DB_DIR/slow_queries.txt" 2>/dev/null || echo "Yavaş sorgu logu bulunamadı")</pre>
    </div>

    <div class="section">
        <h2>Log</h2>
        <pre>$(cat "$LOG_FILE")</pre>
    </div>
</body>
</html>
EOF

    log "${GREEN}Veritabanı raporu oluşturuldu: $REPORT_FILE${NC}"
}

# Ana fonksiyon
main() {
    setup
    
    if check_mysql_connection; then
        analyze_database_size
        analyze_tables
        analyze_indexes
        analyze_slow_queries
        optimize_database
        backup_database
        create_database_report
        
        log "${GREEN}Veritabanı yönetim işlemleri tamamlandı${NC}"
    else
        log "${RED}MySQL bağlantısı kurulamadığı için işlemler yapılamadı${NC}"
        exit 1
    fi
}

# Scripti çalıştır
main
