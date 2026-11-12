#!/bin/bash

# Renkli çıktı için ANSI renk kodları
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
TARGET_URL="http://localhost"
REQUESTS=1000
CONCURRENCY=10
TEST_DURATION=60
OUTPUT_DIR="performance_reports"
OUTPUT_FILE="$OUTPUT_DIR/performance_test_$(date +%Y%m%d_%H%M%S).txt"
METRICS_FILE="$OUTPUT_DIR/metrics_$(date +%Y%m%d_%H%M%S).json"

# Banner
echo "===================================="
echo "    Gelişmiş Performans Test Scripti"
echo "===================================="

# Çıktı dizinini oluştur
mkdir -p "$OUTPUT_DIR"

# Sistem bilgilerini topla
echo -e "
${BLUE}Sistem Bilgileri:${NC}"
echo "------------------------"
echo "İşletim Sistemi: $(uname -a)"
echo "CPU Bilgisi: $(sysctl -n machdep.cpu.brand_string)"
echo "Toplam RAM: $(sysctl hw.memsize | awk '{print $2/1024/1024/1024 "GB"}')"

# Sistem kaynaklarını izle (arka planda)
monitor_resources() {
    while true; do
        date +"%Y-%m-%d %H:%M:%S" >> "$OUTPUT_DIR/resource_usage.log"
        top -l 1 | grep -E "^CPU|^Phys" >> "$OUTPUT_DIR/resource_usage.log"
        sleep 5
    done
}

# Ağ bağlantısını kontrol et
check_network() {
    echo -e "
${YELLOW}Ağ Bağlantısı Kontrolü:${NC}"
    ping -c 3 $(echo $TARGET_URL | sed 's|http://||' | sed 's|/.*||')
}

# Yük testi fonksiyonu
run_load_test() {
    echo -e "
${YELLOW}Yük Testi Başlatılıyor...${NC}"
    echo "URL: $TARGET_URL"
    echo "İstek Sayısı: $REQUESTS"
    echo "Eşzamanlı İstek: $CONCURRENCY"
    echo "Test Süresi: $TEST_DURATION saniye"

    ab -n $REQUESTS -c $CONCURRENCY -t $TEST_DURATION \
       -g "$OUTPUT_DIR/gnuplot.tsv" \
       -e "$OUTPUT_DIR/results.csv" \
       $TARGET_URL | tee "$OUTPUT_FILE"
}

# Sonuçları analiz et ve JSON formatında kaydet
analyze_results() {
    echo -e "
${GREEN}Test Sonuçları Analizi:${NC}"
    echo "------------------------"

    # Temel metrikleri çıkar
    RPS=$(grep "Requests per second" "$OUTPUT_FILE" | awk '{print $4}')
    MEAN_TIME=$(grep "Time per request" "$OUTPUT_FILE" | head -1 | awk '{print $4}')
    TRANSFER_RATE=$(grep "Transfer rate" "$OUTPUT_FILE" | awk '{print $3}')

    # JSON formatında kaydet
    cat > "$METRICS_FILE" << EOF
{
    "timestamp": "$(date +"%Y-%m-%d %H:%M:%S")",
    "target_url": "$TARGET_URL",
    "requests": $REQUESTS,
    "concurrency": $CONCURRENCY,
    "metrics": {
        "requests_per_second": $RPS,
        "mean_time_per_request": $MEAN_TIME,
        "transfer_rate": $TRANSFER_RATE
    }
}
EOF

    echo "Detaylı sonuçlar: $OUTPUT_FILE"
    echo "Metrikler: $METRICS_FILE"
}

# Grafik oluştur
generate_graph() {
    if command -v gnuplot >/dev/null 2>&1; then
        echo -e "
${BLUE}Grafik Oluşturuluyor...${NC}"
        gnuplot << EOF
        set terminal png
        set output "$OUTPUT_DIR/performance_graph.png"
        set title "Performans Test Sonuçları"
        set xlabel "İstek Sayısı"
        set ylabel "Yanıt Süresi (ms)"
        plot "$OUTPUT_DIR/gnuplot.tsv" using 9 title "Yanıt Süresi" with lines
EOF
        echo "Grafik oluşturuldu: $OUTPUT_DIR/performance_graph.png"
    else
        echo "Grafik oluşturulamadı: gnuplot yüklü değil"
    fi
}

# Ana fonksiyon
main() {
    check_network
    monitor_resources &
    MONITOR_PID=$!
    run_load_test
    kill $MONITOR_PID
    analyze_results
    generate_graph
}

# Scripti çalıştır
main
