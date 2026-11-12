#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
MONITOR_ROOT="monitoring"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
MONITOR_DIR="$MONITOR_ROOT/$TIMESTAMP"
LOG_FILE="$MONITOR_DIR/monitor.log"
METRICS_FILE="$MONITOR_DIR/metrics.json"
ALERT_FILE="$MONITOR_DIR/alerts.json"

# Eşik değerleri
CPU_THRESHOLD=80
MEM_THRESHOLD=90
DISK_THRESHOLD=85
LOAD_THRESHOLD=5

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Sistem İzleme Scripti"
    echo "===================================="

    mkdir -p "$MONITOR_DIR"
    touch "$LOG_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Alert fonksiyonu
create_alert() {
    local type=$1
    local message=$2
    local severity=$3

    echo "{
        \"timestamp\": \"$(date +"%Y-%m-%d %H:%M:%S")\",
        \"type\": \"$type\",
        \"message\": \"$message\",
        \"severity\": \"$severity\"
    }" >> "$ALERT_FILE"

    # Slack veya Discord webhook entegrasyonu için hazırlık
    if [ ! -z "$WEBHOOK_URL" ]; then
        curl -s -X POST -H 'Content-type: application/json' \
        --data "{
            \"text\": \"[$severity] $type: $message\"
        }" "$WEBHOOK_URL"
    fi
}

# CPU kullanımını kontrol et
check_cpu() {
    log "${BLUE}CPU kullanımı kontrol ediliyor...${NC}"

    # CPU kullanım yüzdesi
    local cpu_usage=$(top -l 1 | grep "CPU usage" | awk '{print $3}' | cut -d"%" -f1)

    echo "{
        \"cpu_usage\": $cpu_usage
    }" >> "$METRICS_FILE"

    if (( $(echo "$cpu_usage > $CPU_THRESHOLD" | bc -l) )); then
        create_alert "CPU" "Yüksek CPU kullanımı: $cpu_usage%" "critical"
    fi

    log "CPU Kullanımı: $cpu_usage%"
}

# Memory kullanımını kontrol et
check_memory() {
    log "${BLUE}Memory kullanımı kontrol ediliyor...${NC}"

    # Memory kullanım bilgileri
    local total_mem=$(sysctl hw.memsize | awk '{print $2/1024/1024/1024 "GB"}')
    local used_mem=$(vm_stat | grep "Pages active" | awk '{print $3}')
    local free_mem=$(vm_stat | grep "Pages free" | awk '{print $3}')

    echo "{
        \"total_memory\": \"$total_mem\",
        \"used_memory\": \"$used_mem\",
        \"free_memory\": \"$free_mem\"
    }" >> "$METRICS_FILE"

    # Memory kullanım yüzdesi hesapla
    local mem_usage=$(echo "scale=2; $used_mem/$total_mem * 100" | bc)

    if (( $(echo "$mem_usage > $MEM_THRESHOLD" | bc -l) )); then
        create_alert "Memory" "Yüksek memory kullanımı: $mem_usage%" "warning"
    fi

    log "Memory Kullanımı: $mem_usage%"
}

# Disk kullanımını kontrol et
check_disk() {
    log "${BLUE}Disk kullanımı kontrol ediliyor...${NC}"

    # Her mount point için disk kullanımını kontrol et
    df -h | grep -v "Filesystem" | while read line; do
        local filesystem=$(echo $line | awk '{print $1}')
        local usage=$(echo $line | awk '{print $5}' | cut -d"%" -f1)
        local mounted=$(echo $line | awk '{print $9}')

        echo "{
            \"filesystem\": \"$filesystem\",
            \"usage\": $usage,
            \"mounted\": \"$mounted\"
        }" >> "$METRICS_FILE"

        if [ "$usage" -gt "$DISK_THRESHOLD" ]; then
            create_alert "Disk" "Yüksek disk kullanımı ($mounted): $usage%" "warning"
        fi

        log "Disk Kullanımı ($mounted): $usage%"
    done
}

# Sistem yükünü kontrol et
check_load() {
    log "${BLUE}Sistem yükü kontrol ediliyor...${NC}"

    # Load average değerleri
    local load_1=$(sysctl vm.loadavg | awk '{print $3}')
    local load_5=$(sysctl vm.loadavg | awk '{print $4}')
    local load_15=$(sysctl vm.loadavg | awk '{print $5}')

    echo "{
        \"load_1\": $load_1,
        \"load_5\": $load_5,
        \"load_15\": $load_15
    }" >> "$METRICS_FILE"

    if (( $(echo "$load_5 > $LOAD_THRESHOLD" | bc -l) )); then
        create_alert "Load" "Yüksek sistem yükü: $load_5" "warning"
    fi

    log "Sistem Yükü: $load_1, $load_5, $load_15"
}

# Aktif servisleri kontrol et
check_services() {
    log "${BLUE}Servis durumları kontrol ediliyor...${NC}"

    local services=("nginx" "php-fpm" "mysql" "redis")

    for service in "${services[@]}"; do
        if pgrep -x "$service" >/dev/null; then
            log "${GREEN}$service çalışıyor${NC}"
            echo "{
                \"service\": \"$service\",
                \"status\": \"running\"
            }" >> "$METRICS_FILE"
        else
            log "${RED}$service çalışmıyor${NC}"
            create_alert "Service" "$service servisi çalışmıyor" "critical"
            echo "{
                \"service\": \"$service\",
                \"status\": \"stopped\"
            }" >> "$METRICS_FILE"
        fi
    done
}

# Network bağlantılarını kontrol et
check_network() {
    log "${BLUE}Network bağlantıları kontrol ediliyor...${NC}"

    # Aktif bağlantı sayısı
    local connections=$(netstat -an | grep "ESTABLISHED" | wc -l)

    # Port durumları
    local ports=("80" "443" "3306" "6379")
    for port in "${ports[@]}"; do
        if nc -z localhost $port 2>/dev/null; then
            log "${GREEN}Port $port açık${NC}"
        else
            log "${RED}Port $port kapalı${NC}"
            create_alert "Network" "Port $port kapalı" "warning"
        fi
    done

    echo "{
        \"active_connections\": $connections
    }" >> "$METRICS_FILE"

    log "Aktif Bağlantı Sayısı: $connections"
}

# İzleme raporu oluştur
create_monitor_report() {
    local report_file="$MONITOR_DIR/monitor_report.html"

    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Sistem İzleme Raporu</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
        .alert { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Sistem İzleme Raporu</h1>
    <p>Tarih: $(date)</p>
    
    <h2>Metrikler</h2>
    <pre>$(cat "$METRICS_FILE")</pre>
    
    <h2>Uyarılar</h2>
    <pre>$(cat "$ALERT_FILE")</pre>
    
    <h2>Log</h2>
    <pre>$(cat "$LOG_FILE")</pre>
</body>
</html>
EOF

    log "${GREEN}İzleme raporu oluşturuldu: $report_file${NC}"
}

# Ana fonksiyon
main() {
    setup
    check_cpu
    check_memory
    check_disk
    check_load
    check_services
    check_network
    create_monitor_report

    log "${GREEN}Sistem izleme tamamlandı${NC}"
}

# Scripti çalıştır
main
