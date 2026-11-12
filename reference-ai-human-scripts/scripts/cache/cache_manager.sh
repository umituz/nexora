#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
CACHE_ROOT="cache_management"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
CACHE_DIR="$CACHE_ROOT/$TIMESTAMP"
LOG_FILE="$CACHE_DIR/cache.log"
REPORT_FILE="$CACHE_DIR/cache_report.html"

# Redis yapılandırması
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_AUTH=""

# Memcached yapılandırması
MEMCACHED_HOST="localhost"
MEMCACHED_PORT="11211"

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Önbellek Yönetim Scripti"
    echo "===================================="

    mkdir -p "$CACHE_DIR"
    touch "$LOG_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Redis bağlantı kontrolü
check_redis() {
    log "${BLUE}Redis bağlantısı kontrol ediliyor...${NC}"

    if command -v redis-cli >/dev/null 2>&1; then
        if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping >/dev/null 2>&1; then
            log "${GREEN}Redis bağlantısı başarılı${NC}"
            return 0
        else
            log "${RED}Redis bağlantısı başarısız${NC}"
            return 1
        fi
    else
        log "${RED}redis-cli bulunamadı${NC}"
        return 1
    fi
}

# Memcached bağlantı kontrolü
check_memcached() {
    log "${BLUE}Memcached bağlantısı kontrol ediliyor...${NC}"

    if command -v nc >/dev/null 2>&1; then
        if echo "stats" | nc "$MEMCACHED_HOST" "$MEMCACHED_PORT" >/dev/null 2>&1; then
            log "${GREEN}Memcached bağlantısı başarılı${NC}"
            return 0
        else
            log "${RED}Memcached bağlantısı başarısız${NC}"
            return 1
        fi
    else
        log "${RED}netcat bulunamadı${NC}"
        return 1
    fi
}

# Redis istatistikleri
get_redis_stats() {
    log "${BLUE}Redis istatistikleri alınıyor...${NC}"

    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" info > "$CACHE_DIR/redis_info.txt"
    
    # Temel metrikleri çıkar
    local used_memory=$(grep "used_memory_human:" "$CACHE_DIR/redis_info.txt" | cut -d: -f2)
    local connected_clients=$(grep "connected_clients:" "$CACHE_DIR/redis_info.txt" | cut -d: -f2)
    local total_commands=$(grep "total_commands_processed:" "$CACHE_DIR/redis_info.txt" | cut -d: -f2)
    
    echo "{
        \"used_memory\": \"$used_memory\",
        \"connected_clients\": $connected_clients,
        \"total_commands\": $total_commands
    }" > "$CACHE_DIR/redis_metrics.json"

    log "${GREEN}Redis istatistikleri alındı${NC}"
}

# Memcached istatistikleri
get_memcached_stats() {
    log "${BLUE}Memcached istatistikleri alınıyor...${NC}"

    echo "stats" | nc "$MEMCACHED_HOST" "$MEMCACHED_PORT" > "$CACHE_DIR/memcached_stats.txt"
    
    # Temel metrikleri çıkar
    local curr_items=$(grep "curr_items" "$CACHE_DIR/memcached_stats.txt" | awk '{print $3}')
    local bytes=$(grep "bytes" "$CACHE_DIR/memcached_stats.txt" | awk '{print $3}')
    local curr_connections=$(grep "curr_connections" "$CACHE_DIR/memcached_stats.txt" | awk '{print $3}')
    
    echo "{
        \"current_items\": $curr_items,
        \"bytes_used\": $bytes,
        \"current_connections\": $curr_connections
    }" > "$CACHE_DIR/memcached_metrics.json"

    log "${GREEN}Memcached istatistikleri alındı${NC}"
}

# Redis önbellek temizleme
flush_redis() {
    log "${YELLOW}Redis önbelleği temizleniyor...${NC}"

    if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" flushall >/dev/null 2>&1; then
        log "${GREEN}Redis önbelleği temizlendi${NC}"
    else
        log "${RED}Redis önbellek temizleme başarısız${NC}"
    fi
}

# Memcached önbellek temizleme
flush_memcached() {
    log "${YELLOW}Memcached önbelleği temizleniyor...${NC}"

    if echo "flush_all" | nc "$MEMCACHED_HOST" "$MEMCACHED_PORT" >/dev/null 2>&1; then
        log "${GREEN}Memcached önbelleği temizlendi${NC}"
    else
        log "${RED}Memcached önbellek temizleme başarısız${NC}"
    fi
}

# Redis anahtar analizi
analyze_redis_keys() {
    log "${BLUE}Redis anahtarları analiz ediliyor...${NC}"

    # Tüm anahtarları listele
    redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" keys "*" > "$CACHE_DIR/redis_keys.txt"
    
    # Her anahtarın tipini ve boyutunu al
    while read -r key; do
        type=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" type "$key")
        size=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" memory usage "$key")
        ttl=$(redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ttl "$key")
        
        echo "$key: Type=$type, Size=$size bytes, TTL=$ttl" >> "$CACHE_DIR/redis_key_analysis.txt"
    done < "$CACHE_DIR/redis_keys.txt"

    log "${GREEN}Redis anahtar analizi tamamlandı${NC}"
}

# Önbellek raporu oluştur
create_cache_report() {
    log "${BLUE}Önbellek raporu oluşturuluyor...${NC}"

    cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Önbellek Yönetim Raporu</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        .metric { margin: 10px 0; }
        .warning { color: orange; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h1>Önbellek Yönetim Raporu</h1>
    <p>Tarih: $(date)</p>

    <div class="section">
        <h2>Redis İstatistikleri</h2>
        <pre>$(cat "$CACHE_DIR/redis_metrics.json" 2>/dev/null || echo "Redis istatistikleri bulunamadı")</pre>
        
        <h3>Anahtar Analizi</h3>
        <pre>$(cat "$CACHE_DIR/redis_key_analysis.txt" 2>/dev/null || echo "Anahtar analizi bulunamadı")</pre>
    </div>

    <div class="section">
        <h2>Memcached İstatistikleri</h2>
        <pre>$(cat "$CACHE_DIR/memcached_metrics.json" 2>/dev/null || echo "Memcached istatistikleri bulunamadı")</pre>
    </div>

    <div class="section">
        <h2>Log</h2>
        <pre>$(cat "$LOG_FILE")</pre>
    </div>
</body>
</html>
EOF

    log "${GREEN}Önbellek raporu oluşturuldu: $REPORT_FILE${NC}"
}

# Ana fonksiyon
main() {
    setup
    
    # Redis kontrolleri
    if check_redis; then
        get_redis_stats
        analyze_redis_keys
    fi
    
    # Memcached kontrolleri
    if check_memcached; then
        get_memcached_stats
    fi
    
    create_cache_report
    
    log "${GREEN}Önbellek yönetim işlemleri tamamlandı${NC}"
}

# Scripti çalıştır
main
