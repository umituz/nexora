#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
QUEUE_ROOT="queue_management"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
QUEUE_DIR="$QUEUE_ROOT/$TIMESTAMP"
LOG_FILE="$QUEUE_DIR/queue.log"
REPORT_FILE="$QUEUE_DIR/queue_report.html"

# Redis yapılandırması (Laravel Queue için)
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_DB="0"

# RabbitMQ yapılandırması
RABBITMQ_HOST="localhost"
RABBITMQ_PORT="5672"
RABBITMQ_USER="guest"
RABBITMQ_PASS="guest"

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Kuyruk Yönetim Scripti"
    echo "===================================="

    mkdir -p "$QUEUE_DIR"
    touch "$LOG_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Redis kuyruk kontrolü
check_redis_queues() {
    log "${BLUE}Redis kuyrukları kontrol ediliyor...${NC}"

    if command -v redis-cli >/dev/null 2>&1; then
        # Tüm kuyrukları listele
        redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -n "$REDIS_DB" keys "queues:*" > "$QUEUE_DIR/redis_queues.txt"

        # Her kuyruğun boyutunu kontrol et
        while read -r queue; do
            size=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -n "$REDIS_DB" llen "$queue")
            echo "$queue: $size" >> "$QUEUE_DIR/redis_queue_sizes.txt"

            if [ "$size" -gt 1000 ]; then
                log "${YELLOW}Uyarı: $queue kuyruğunda $size iş bekliyor${NC}"
            fi
        done < "$QUEUE_DIR/redis_queues.txt"

        log "${GREEN}Redis kuyruk kontrolü tamamlandı${NC}"
    else
        log "${RED}redis-cli bulunamadı${NC}"
    fi
}

# RabbitMQ kuyruk kontrolü
check_rabbitmq_queues() {
    log "${BLUE}RabbitMQ kuyrukları kontrol ediliyor...${NC}"

    if command -v rabbitmqctl >/dev/null 2>&1; then
        # Kuyruk listesi ve istatistikler
        rabbitmqctl list_queues name messages consumers > "$QUEUE_DIR/rabbitmq_queues.txt"

        # Kuyruk durumlarını analiz et
        while read -r line; do
            queue_name=$(echo "$line" | awk '{print $1}')
            messages=$(echo "$line" | awk '{print $2}')
            consumers=$(echo "$line" | awk '{print $3}')

            if [ "$messages" -gt 1000 ]; then
                log "${YELLOW}Uyarı: $queue_name kuyruğunda $messages iş bekliyor${NC}"
            fi

            if [ "$consumers" -eq 0 ]; then
                log "${RED}Hata: $queue_name kuyruğunda aktif consumer yok${NC}"
            fi
        done < "$QUEUE_DIR/rabbitmq_queues.txt"

        log "${GREEN}RabbitMQ kuyruk kontrolü tamamlandı${NC}"
    else
        log "${RED}rabbitmqctl bulunamadı${NC}"
    fi
}

# Laravel kuyruk worker kontrolü
check_laravel_workers() {
    log "${BLUE}Laravel queue worker'ları kontrol ediliyor...${NC}"

    # Çalışan worker'ları kontrol et
    ps aux | grep "queue:work" | grep -v grep > "$QUEUE_DIR/laravel_workers.txt"
    worker_count=$(wc -l < "$QUEUE_DIR/laravel_workers.txt")

    if [ "$worker_count" -eq 0 ]; then
        log "${RED}Uyarı: Aktif Laravel queue worker bulunamadı${NC}"
    else
        log "${GREEN}$worker_count aktif Laravel queue worker çalışıyor${NC}"
    fi

    # Failed jobs kontrolü
    if [ -f "artisan" ]; then
        php artisan queue:failed > "$QUEUE_DIR/failed_jobs.txt"
        failed_count=$(wc -l < "$QUEUE_DIR/failed_jobs.txt")

        if [ "$failed_count" -gt 0 ]; then
            log "${RED}$failed_count başarısız iş bulundu${NC}"
        fi
    fi
}

# Kuyruk performans analizi
analyze_queue_performance() {
    log "${BLUE}Kuyruk performansı analiz ediliyor...${NC}"

    # Redis kuyruk performansı
    if command -v redis-cli >/dev/null 2>&1; then
        redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" info | grep "used_memory" > "$QUEUE_DIR/redis_performance.txt"
    fi

    # RabbitMQ performans metrikleri
    if command -v rabbitmqctl >/dev/null 2>&1; then
        rabbitmqctl list_connections > "$QUEUE_DIR/rabbitmq_connections.txt"
        rabbitmqctl list_channels > "$QUEUE_DIR/rabbitmq_channels.txt"
    fi

    log "${GREEN}Performans analizi tamamlandı${NC}"
}

# Kuyruk temizleme
clean_queues() {
    log "${YELLOW}Kuyruk temizleme başlatılıyor...${NC}"

    # Redis kuyrukları temizle
    if command -v redis-cli >/dev/null 2>&1; then
        while read -r queue; do
            redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" -n "$REDIS_DB" del "$queue"
        done < "$QUEUE_DIR/redis_queues.txt"
    fi

    # RabbitMQ kuyrukları temizle
    if command -v rabbitmqctl >/dev/null 2>&1; then
        while read -r line; do
            queue_name=$(echo "$line" | awk '{print $1}')
            rabbitmqctl purge_queue "$queue_name"
        done < "$QUEUE_DIR/rabbitmq_queues.txt"
    fi

    log "${GREEN}Kuyruk temizleme tamamlandı${NC}"
}

# Kuyruk raporu oluştur
create_queue_report() {
    log "${BLUE}Kuyruk raporu oluşturuluyor...${NC}"

    cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Kuyruk Yönetim Raporu</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        .warning { color: orange; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h1>Kuyruk Yönetim Raporu</h1>
    <p>Tarih: $(date)</p>

    <div class="section">
        <h2>Redis Kuyrukları</h2>
        <pre>$(cat "$QUEUE_DIR/redis_queue_sizes.txt" 2>/dev/null || echo "Redis kuyruk bilgisi bulunamadı")</pre>
        
        <h3>Redis Performans</h3>
        <pre>$(cat "$QUEUE_DIR/redis_performance.txt" 2>/dev/null || echo "Redis performans bilgisi bulunamadı")</pre>
    </div>

    <div class="section">
        <h2>RabbitMQ Kuyrukları</h2>
        <pre>$(cat "$QUEUE_DIR/rabbitmq_queues.txt" 2>/dev/null || echo "RabbitMQ kuyruk bilgisi bulunamadı")</pre>
        
        <h3>RabbitMQ Bağlantıları</h3>
        <pre>$(cat "$QUEUE_DIR/rabbitmq_connections.txt" 2>/dev/null || echo "RabbitMQ bağlantı bilgisi bulunamadı")</pre>
    </div>

    <div class="section">
        <h2>Laravel Queue Workers</h2>
        <pre>$(cat "$QUEUE_DIR/laravel_workers.txt" 2>/dev/null || echo "Laravel worker bilgisi bulunamadı")</pre>
        
        <h3>Başarısız İşler</h3>
        <pre>$(cat "$QUEUE_DIR/failed_jobs.txt" 2>/dev/null || echo "Başarısız iş bilgisi bulunamadı")</pre>
    </div>

    <div class="section">
        <h2>Log</h2>
        <pre>$(cat "$LOG_FILE")</pre>
    </div>
</body>
</html>
EOF

    log "${GREEN}Kuyruk raporu oluşturuldu: $REPORT_FILE${NC}"
}

# Ana fonksiyon
main() {
    setup
    check_redis_queues
    check_rabbitmq_queues
    check_laravel_workers
    analyze_queue_performance
    create_queue_report

    log "${GREEN}Kuyruk yönetim işlemleri tamamlandı${NC}"
}

# Scripti çalıştır
main
