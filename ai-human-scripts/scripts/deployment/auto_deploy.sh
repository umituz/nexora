#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
DEPLOY_ROOT="deployments"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DEPLOY_DIR="$DEPLOY_ROOT/$TIMESTAMP"
LOG_FILE="$DEPLOY_DIR/deploy.log"
ENV_FILE=".env"
BACKUP_DIR="$DEPLOY_ROOT/backups"

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Otomatik Deployment Scripti"
    echo "===================================="

    mkdir -p "$DEPLOY_DIR" "$BACKUP_DIR"
    touch "$LOG_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Environment kontrolü
check_environment() {
    if [ ! -f "$ENV_FILE" ]; then
        log "${RED}Hata: .env dosyası bulunamadı${NC}"
        exit 1
    fi

    # Environment değişkenlerini yükle
    source "$ENV_FILE"

    # Gerekli değişkenleri kontrol et
    required_vars=("APP_ENV" "DB_HOST" "DB_NAME")
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            log "${RED}Hata: $var değişkeni tanımlanmamış${NC}"
            exit 1
        fi
    done
}

# Sistem durumunu kontrol et
check_system_status() {
    log "${BLUE}Sistem durumu kontrol ediliyor...${NC}"

    # Disk alanı kontrolü
    disk_space=$(df -h / | awk 'NR==2 {print $4}')
    log "Kullanılabilir disk alanı: $disk_space"

    # Memory kontrolü
    free_mem=$(free -h | awk '/^Mem:/ {print $4}')
    log "Kullanılabilir memory: $free_mem"

    # CPU yükü kontrolü
    cpu_load=$(uptime | awk '{print $10}')
    log "CPU yükü: $cpu_load"
}

# Uygulama yedeklemesi
backup_application() {
    log "${BLUE}Uygulama yedekleniyor...${NC}"

    # Kod yedekleme
    tar -czf "$BACKUP_DIR/app_$TIMESTAMP.tar.gz" .
    
    # Veritabanı yedekleme
    if [ ! -z "$DB_NAME" ]; then
        mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$BACKUP_DIR/db_$TIMESTAMP.sql"
    fi

    log "${GREEN}Yedekleme tamamlandı${NC}"
}

# Bağımlılıkları güncelle
update_dependencies() {
    log "${BLUE}Bağımlılıklar güncelleniyor...${NC}"

    # Composer bağımlılıkları
    if [ -f "composer.json" ]; then
        composer install --no-dev --optimize-autoloader
    fi

    # NPM bağımlılıkları
    if [ -f "package.json" ]; then
        npm ci --production
    fi

    log "${GREEN}Bağımlılıklar güncellendi${NC}"
}

# Veritabanı migrasyonları
run_migrations() {
    log "${BLUE}Veritabanı migrasyonları çalıştırılıyor...${NC}"

    php artisan migrate --force

    log "${GREEN}Migrasyonlar tamamlandı${NC}"
}

# Önbellek temizleme
clear_cache() {
    log "${BLUE}Önbellekler temizleniyor...${NC}"

    php artisan cache:clear
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear

    log "${GREEN}Önbellekler temizlendi${NC}"
}

# Uygulama optimizasyonu
optimize_application() {
    log "${BLUE}Uygulama optimize ediliyor...${NC}"

    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    log "${GREEN}Optimizasyon tamamlandı${NC}"
}

# Servis yeniden başlatma
restart_services() {
    log "${BLUE}Servisler yeniden başlatılıyor...${NC}"

    # PHP-FPM yeniden başlat
    if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl restart php-fpm
    fi

    # Nginx yeniden başlat
    if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl restart nginx
    fi

    # Queue worker yeniden başlat
    php artisan queue:restart

    log "${GREEN}Servisler yeniden başlatıldı${NC}"
}

# Deployment sonrası kontroller
post_deploy_checks() {
    log "${BLUE}Deployment sonrası kontroller yapılıyor...${NC}"

    # Uygulama sağlık kontrolü
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health)
    if [ "$response" == "200" ]; then
        log "${GREEN}Uygulama sağlık kontrolü başarılı${NC}"
    else
        log "${RED}Uygulama sağlık kontrolü başarısız: $response${NC}"
    fi

    # Queue kontrolü
    queue_size=$(php artisan queue:size)
    log "Queue boyutu: $queue_size"
}

# Deployment özeti oluştur
create_deploy_summary() {
    local summary_file="$DEPLOY_DIR/deploy_summary.html"

    cat > "$summary_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Deployment Özeti</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .success { color: green; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>Deployment Özeti</h1>
    <p>Tarih: $(date)</p>
    <p>Environment: $APP_ENV</p>
    <pre>$(cat "$LOG_FILE")</pre>
</body>
</html>
EOF

    log "${GREEN}Deployment özeti oluşturuldu: $summary_file${NC}"
}

# Ana fonksiyon
main() {
    setup
    check_environment
    check_system_status
    backup_application
    update_dependencies
    run_migrations
    clear_cache
    optimize_application
    restart_services
    post_deploy_checks
    create_deploy_summary

    log "${GREEN}Deployment başarıyla tamamlandı${NC}"
}

# Scripti çalıştır
main
