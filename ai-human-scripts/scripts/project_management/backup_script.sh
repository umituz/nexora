#!/bin/bash

# Renkli çıktı için ANSI renk kodları
GREEN='[0;32m'
YELLOW='[1;33m'
RED='[0;31m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
BACKUP_ROOT="/backups"
SOURCE_DIRS=(
    "/var/www/html"
    "/etc/nginx"
    "/etc/mysql"
)
DB_NAME="myapp"
DB_USER="root"
DB_PASS="root"
RETENTION_DAYS=30
COMPRESS_TYPE="gzip" # gzip veya xz
ENCRYPT_BACKUP=true
ENCRYPTION_KEY="your-secret-key"

# Timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"
LOG_FILE="$BACKUP_ROOT/backup_$TIMESTAMP.log"

# Log fonksiyonu
log() {
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Hata kontrolü
check_error() {
    if [ $? -ne 0 ]; then
        log "${RED}Hata: $1${NC}"
        exit 1
    fi
}

# Disk alanı kontrolü
check_disk_space() {
    local required_space=$(du -s ${SOURCE_DIRS[@]} | awk '{sum += $1} END {print sum}')
    local available_space=$(df "$BACKUP_ROOT" | awk 'NR==2 {print $4}')
    
    if [ $available_space -lt $required_space ]; then
        log "${RED}Yetersiz disk alanı!${NC}"
        exit 1
    fi
}

# MySQL yedekleme
backup_mysql() {
    log "${BLUE}MySQL yedekleme başlatılıyor...${NC}"
    
    mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/mysql_dump.sql"
    check_error "MySQL yedekleme başarısız"
    
    log "${GREEN}MySQL yedekleme tamamlandı${NC}"
}

# Dosya yedekleme
backup_files() {
    log "${BLUE}Dosya yedekleme başlatılıyor...${NC}"
    
    for dir in "${SOURCE_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            local dirname=$(basename "$dir")
            log "Yedekleniyor: $dir"
            
            tar -czf "$BACKUP_DIR/${dirname}.tar.gz" -C "$(dirname "$dir")" "$(basename "$dir")"
            check_error "$dir yedekleme başarısız"
        else
            log "${YELLOW}Uyarı: $dir dizini bulunamadı${NC}"
        fi
    done
    
    log "${GREEN}Dosya yedekleme tamamlandı${NC}"
}

# Yedekleri şifrele
encrypt_backup() {
    if [ "$ENCRYPT_BACKUP" = true ]; then
        log "${BLUE}Yedekler şifreleniyor...${NC}"
        
        find "$BACKUP_DIR" -type f -exec openssl enc -aes-256-cbc -salt -in {} -out {}.enc -k "$ENCRYPTION_KEY" \;
        check_error "Şifreleme başarısız"
        
        # Şifrelenmemiş dosyaları sil
        find "$BACKUP_DIR" -type f ! -name "*.enc" -delete
        
        log "${GREEN}Şifreleme tamamlandı${NC}"
    fi
}

# Eski yedekleri temizle
cleanup_old_backups() {
    log "${BLUE}Eski yedekler temizleniyor...${NC}"
    
    find "$BACKUP_ROOT" -maxdepth 1 -type d -mtime +$RETENTION_DAYS -exec rm -rf {} \;
    check_error "Eski yedeklerin temizlenmesi başarısız"
    
    log "${GREEN}Eski yedekler temizlendi${NC}"
}

# Yedekleme özeti oluştur
create_summary() {
    local summary_file="$BACKUP_DIR/backup_summary.txt"
    
    {
        echo "Yedekleme Özeti"
        echo "================"
        echo "Tarih: $(date)"
        echo "Yedeklenen Dizinler:"
        printf "%s\n" "${SOURCE_DIRS[@]}"
        echo "\nDosya Boyutları:"
        du -sh "$BACKUP_DIR"/*
        echo "\nMD5 Checksums:"
        md5sum "$BACKUP_DIR"/*
    } > "$summary_file"
}

# Ana fonksiyon
main() {
    # Banner
    echo "===================================="
    echo "    Gelişmiş Yedekleme Scripti"
    echo "===================================="
    
    # Başlangıç kontrolleri
    mkdir -p "$BACKUP_DIR"
    check_disk_space
    
    # Yedekleme işlemleri
    backup_mysql
    backup_files
    encrypt_backup
    create_summary
    cleanup_old_backups
    
    log "${GREEN}Tüm yedekleme işlemleri başarıyla tamamlandı${NC}"
}

# Scripti çalıştır
main
