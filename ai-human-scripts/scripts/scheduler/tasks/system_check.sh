#!/bin/bash

# Sistem kontrol görevi için örnek şablon
THRESHOLD_CPU=80
THRESHOLD_MEM=90
THRESHOLD_DISK=85

# Renkli çıktı
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Log
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# CPU kullanımı kontrolü
check_cpu() {
    cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)

    if [ "$cpu_usage" -gt "$THRESHOLD_CPU" ]; then
        log "${RED}UYARI: Yüksek CPU kullanımı: $cpu_usage%${NC}"
        return 1
    else
        log "${GREEN}CPU kullanımı normal: $cpu_usage%${NC}"
        return 0
    fi
}

# Bellek kullanımı kontrolü
check_memory() {
    memory_usage=$(free | grep Mem | awk '{print $3/$2 * 100.0}' | cut -d. -f1)

    if [ "$memory_usage" -gt "$THRESHOLD_MEM" ]; then
        log "${RED}UYARI: Yüksek bellek kullanımı: $memory_usage%${NC}"
        return 1
    else
        log "${GREEN}Bellek kullanımı normal: $memory_usage%${NC}"
        return 0
    fi
}

# Disk kullanımı kontrolü
check_disk() {
    disk_usage=$(df -h / | awk 'NR==2 {print $5}' | cut -d% -f1)

    if [ "$disk_usage" -gt "$THRESHOLD_DISK" ]; then
        log "${RED}UYARI: Yüksek disk kullanımı: $disk_usage%${NC}"
        return 1
    else
        log "${GREEN}Disk kullanımı normal: $disk_usage%${NC}"
        return 0
    fi
}

# Ana işlem
main() {
    local status=0

    check_cpu
    status=$((status + $?))

    check_memory
    status=$((status + $?))

    check_disk
    status=$((status + $?))

    if [ $status -eq 0 ]; then
        log "${GREEN}Tüm sistem kontrolleri başarılı${NC}"
        exit 0
    else
        log "${RED}Bazı sistem kontrolleri başarısız${NC}"
        exit 1
    fi
}

main "$@"
