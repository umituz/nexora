#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
YELLOW='[1;33m'
NC='[0m'

# Yapılandırma
LOG_DIR="/var/log"
LOG_FILES=("system.log" "error.log" "application.log")
KEYWORDS=("ERROR" "WARNING" "CRITICAL" "EXCEPTION" "FAILED")
OUTPUT_FILE="log_analysis_$(date +%Y%m%d_%H%M%S).txt"

# Banner
echo "================================"
echo "      Log Analiz Scripti"
echo "================================"

# Log dosyalarını kontrol et
for log_file in "${LOG_FILES[@]}"; do
    if [ -f "$LOG_DIR/$log_file" ]; then
        echo -e "
${YELLOW}$log_file dosyası analiz ediliyor...${NC}"
        
        for keyword in "${KEYWORDS[@]}"; do
            echo -e "
${RED}$keyword için sonuçlar:${NC}"
            grep -n "$keyword" "$LOG_DIR/$log_file" | tee -a "$OUTPUT_FILE"
        done
        
        # İstatistikler
        echo -e "
İstatistikler:"
        for keyword in "${KEYWORDS[@]}"; do
            count=$(grep -c "$keyword" "$LOG_DIR/$log_file")
            echo "$keyword: $count adet bulundu"
        done
    else
        echo -e "${RED}$log_file bulunamadı!${NC}"
    fi
done

echo -e "
Analiz tamamlandı. Sonuçlar $OUTPUT_FILE dosyasına kaydedildi."
