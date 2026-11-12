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
BACKUP_DIR="backups"
CONFIG_FILE="$CONFIG_DIR/backup_config.json"
LOG_FILE="$LOGS_DIR/backup_manager.log"
RETENTION_DAYS=30

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Sistem yedeği alma
backup_system() {
    local backup_name="system_$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/system/$backup_name"

    log "${BLUE}Sistem yedeği alınıyor...${NC}"

    # Önemli sistem dizinlerini yedekle
    tar -czf "$backup_path.tar.gz" \
        --exclude="/proc" \
        --exclude="/tmp" \
        --exclude="/mnt" \
        --exclude="/dev" \
        --exclude="/sys" \
        --exclude="/run" \
        --exclude="/media" \
        --exclude="/var/log" \
        --exclude="/var/cache" \
        --exclude="/var/tmp" \
        --exclude="/lost+found" \
        --exclude="/backup" \
        /etc /var /usr/local /home

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Sistem yedeği başarıyla alındı: $backup_path.tar.gz${NC}"
        return 0
    else
        log "${RED}✗ Sistem yedeği alınamadı${NC}"
        return 1
    fi
}

# Veritabanı yedeği alma
backup_database() {
    local db_name=$1
    local backup_name="db_${db_name}_$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/database/$backup_name"

    log "${BLUE}Veritabanı yedeği alınıyor: $db_name${NC}"

    mysqldump -u root "$db_name" > "$backup_path.sql"

    if [ $? -eq 0 ]; then
        # Sıkıştır
        gzip "$backup_path.sql"
        log "${GREEN}✓ Veritabanı yedeği başarıyla alındı: $backup_path.sql.gz${NC}"
        return 0
    else
        log "${RED}✗ Veritabanı yedeği alınamadı${NC}"
        return 1
    fi
}

# Dosya yedeği alma
backup_files() {
    local source_dir=$1
    local backup_name="files_$(basename "$source_dir")_$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/files/$backup_name"

    log "${BLUE}Dosya yedeği alınıyor: $source_dir${NC}"

    tar -czf "$backup_path.tar.gz" -C "$(dirname "$source_dir")" "$(basename "$source_dir")"

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Dosya yedeği başarıyla alındı: $backup_path.tar.gz${NC}"
        return 0
    else
        log "${RED}✗ Dosya yedeği alınamadı${NC}"
        return 1
    fi
}

# Cloud yedekleme (AWS S3)
backup_to_cloud() {
    local source_file=$1
    local bucket_name=$2

    log "${BLUE}Cloud'a yedekleniyor: $source_file${NC}"

    aws s3 cp "$source_file" "s3://$bucket_name/$(basename "$source_file")"

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Cloud'a yedekleme başarılı${NC}"
        return 0
    else
        log "${RED}✗ Cloud'a yedekleme başarısız${NC}"
        return 1
    fi
}

# Yedek geri yükleme
restore_backup() {
    local backup_file=$1
    local restore_path=$2

    log "${BLUE}Yedek geri yükleniyor: $backup_file${NC}"

    case "$backup_file" in
        *.tar.gz)
            tar -xzf "$backup_file" -C "$restore_path"
            ;;
        *.sql.gz)
            gunzip < "$backup_file" | mysql -u root
            ;;
        *)
            log "${RED}✗ Desteklenmeyen yedek formatı${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Yedek başarıyla geri yüklendi${NC}"
        return 0
    else
        log "${RED}✗ Yedek geri yüklenemedi${NC}"
        return 1
    fi
}

# Eski yedekleri temizleme
cleanup_old_backups() {
    log "${BLUE}Eski yedekler temizleniyor (${RETENTION_DAYS} günden eski)${NC}"

    find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -exec rm {} \;

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Eski yedekler temizlendi${NC}"
        return 0
    else
        log "${RED}✗ Eski yedekler temizlenemedi${NC}"
        return 1
    fi
}

# Yedek listesi
list_backups() {
    echo -e "\n${YELLOW}Mevcut Yedekler:${NC}"
    echo -e "\n${BLUE}Sistem Yedekleri:${NC}"
    ls -lh "$BACKUP_DIR/system"
    echo -e "\n${BLUE}Veritabanı Yedekleri:${NC}"
    ls -lh "$BACKUP_DIR/database"
    echo -e "\n${BLUE}Dosya Yedekleri:${NC}"
    ls -lh "$BACKUP_DIR/files"
}

# Ana menü
show_menu() {
    echo -e "\n${YELLOW}Yedekleme Yönetim Menüsü${NC}"
    echo "1. Sistem Yedeği Al"
    echo "2. Veritabanı Yedeği Al"
    echo "3. Dosya Yedeği Al"
    echo "4. Cloud'a Yedekle"
    echo "5. Yedek Geri Yükle"
    echo "6. Eski Yedekleri Temizle"
    echo "7. Yedekleri Listele"
    echo "8. Çıkış"
}

# Dizinleri oluştur
mkdir -p "$CONFIG_DIR" "$LOGS_DIR" "$BACKUP_DIR"/{system,database,files}

# Ana döngü
while true; do
    show_menu
    read -p "Seçiminiz (1-8): " choice

    case $choice in
        1)
            backup_system
            ;;
        2)
            read -p "Veritabanı adı: " db_name
            backup_database "$db_name"
            ;;
        3)
            read -p "Yedeklenecek dizin: " source_dir
            backup_files "$source_dir"
            ;;
        4)
            read -p "Yedeklenecek dosya: " source_file
            read -p "S3 bucket adı: " bucket_name
            backup_to_cloud "$source_file" "$bucket_name"
            ;;
        5)
            read -p "Geri yüklenecek yedek: " backup_file
            read -p "Geri yükleme dizini: " restore_path
            restore_backup "$backup_file" "$restore_path"
            ;;
        6)
            cleanup_old_backups
            ;;
        7)
            list_backups
            ;;
        8)
            exit 0
            ;;
        *)
            echo -e "${RED}Geçersiz seçim!${NC}"
            ;;
    esac
done
