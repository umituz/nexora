#!/bin/bash

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Sabit değişkenler
CONFIG_DIR="config"
LOG_DIR="logs"
MOCK_DIR="mock"
DOC_DIR="documentation"
TEST_DIR="testing"
CONFIG_FILE="$CONFIG_DIR/api_config.json"
LOG_FILE="$LOG_DIR/api_manager.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# API endpoint testi
test_endpoint() {
    local url=$1
    local method=${2:-GET}
    local data=$3
    local headers=$4

    log "${BLUE}Testing endpoint: $method $url${NC}"

    response=$(curl -X "$method" \
                   -H "Content-Type: application/json" \
                   ${headers:+-H "$headers"} \
                   ${data:+-d "$data"} \
                   -w "\nStatus: %{http_code}\nTime: %{time_total}s" \
                   -s "$url")

    status_code=$(echo "$response" | grep "Status:" | cut -d' ' -f2)

    if [ "$status_code" -ge 200 ] && [ "$status_code" -lt 300 ]; then
        log "${GREEN}✓ Test başarılı - Status: $status_code${NC}"
        echo "$response" > "$TEST_DIR/last_response.json"
    else
        log "${RED}✗ Test başarısız - Status: $status_code${NC}"
        echo "$response" > "$TEST_DIR/last_error.json"
    fi
}

# Mock API sunucusu başlatma
start_mock_server() {
    local port=${1:-3000}

    if [ -f "$MOCK_DIR/mock_data.json" ]; then
        log "${BLUE}Mock API sunucusu başlatılıyor (Port: $port)${NC}"
        npx json-server --watch "$MOCK_DIR/mock_data.json" --port "$port" &
        echo $! > "$MOCK_DIR/server.pid"
        log "${GREEN}✓ Mock API sunucusu başlatıldı${NC}"
    else
        log "${RED}✗ Mock data dosyası bulunamadı${NC}"
    fi
}

# Mock API sunucusunu durdurma
stop_mock_server() {
    if [ -f "$MOCK_DIR/server.pid" ]; then
        kill $(cat "$MOCK_DIR/server.pid")
        rm "$MOCK_DIR/server.pid"
        log "${GREEN}✓ Mock API sunucusu durduruldu${NC}"
    else
        log "${YELLOW}! Mock API sunucusu zaten çalışmıyor${NC}"
    fi
}

# API dokümantasyonu oluşturma
generate_docs() {
    local api_spec=$1

    if [ -f "$api_spec" ]; then
        log "${BLUE}API dokümantasyonu oluşturuluyor${NC}"

        # OpenAPI/Swagger dokümantasyonu oluştur
        npx redoc-cli bundle "$api_spec" -o "$DOC_DIR/index.html"

        if [ $? -eq 0 ]; then
            log "${GREEN}✓ API dokümantasyonu oluşturuldu${NC}"
            echo "Dokümantasyon: $DOC_DIR/index.html"
        else
            log "${RED}✗ API dokümantasyonu oluşturulamadı${NC}"
        fi
    else
        log "${RED}✗ API spec dosyası bulunamadı${NC}"
    fi
}

# API güvenlik taraması
security_scan() {
    local target_url=$1

    log "${BLUE}API güvenlik taraması başlatılıyor: $target_url${NC}"

    # Rate limiting kontrolü
    test_endpoint "$target_url" "GET" "" "" &
    test_endpoint "$target_url" "GET" "" "" &
    test_endpoint "$target_url" "GET" "" "" &

    # SQL Injection kontrolü
    test_endpoint "$target_url" "GET" "" "' OR '1'='1"

    # XSS kontrolü
    test_endpoint "$target_url" "GET" "" "<script>alert(1)</script>"

    # CSRF kontrolü
    test_endpoint "$target_url" "POST" "{\"data\":\"test\"}" ""

    log "${GREEN}✓ Güvenlik taraması tamamlandı${NC}"
}

# API performans testi
performance_test() {
    local url=$1
    local requests=${2:-100}
    local concurrency=${3:-10}

    log "${BLUE}Performans testi başlatılıyor${NC}"
    log "URL: $url"
    log "İstek sayısı: $requests"
    log "Eşzamanlı istek: $concurrency"

    ab -n "$requests" -c "$concurrency" -k -H "Accept: application/json" "$url" > "$TEST_DIR/performance_report.txt"

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Performans testi tamamlandı${NC}"
        echo "Rapor: $TEST_DIR/performance_report.txt"
    else
        log "${RED}✗ Performans testi başarısız${NC}"
    fi
}

# Ana menü
show_menu() {
    echo -e "\n${YELLOW}API Yönetim Menüsü${NC}"
    echo "1. API Endpoint Testi"
    echo "2. Mock API Sunucusu Başlat"
    echo "3. Mock API Sunucusu Durdur"
    echo "4. API Dokümantasyonu Oluştur"
    echo "5. API Güvenlik Taraması"
    echo "6. API Performans Testi"
    echo "7. Çıkış"
}

# Dizinleri oluştur
mkdir -p "$CONFIG_DIR" "$LOG_DIR" "$MOCK_DIR" "$DOC_DIR" "$TEST_DIR"

# Ana döngü
while true; do
    show_menu
    read -p "Seçiminiz (1-7): " choice

    case $choice in
        1)
            read -p "API URL: " url
            read -p "HTTP Metodu (GET/POST/PUT/DELETE): " method
            read -p "Data (JSON, opsiyonel): " data
            read -p "Headers (opsiyonel): " headers
            test_endpoint "$url" "$method" "$data" "$headers"
            ;;
        2)
            read -p "Port (varsayılan: 3000): " port
            start_mock_server "${port:-3000}"
            ;;
        3)
            stop_mock_server
            ;;
        4)
            read -p "API spec dosyası (OpenAPI/Swagger): " spec_file
            generate_docs "$spec_file"
            ;;
        5)
            read -p "Hedef API URL: " target_url
            security_scan "$target_url"
            ;;
        6)
            read -p "API URL: " url
            read -p "İstek sayısı (varsayılan: 100): " requests
            read -p "Eşzamanlı istek (varsayılan: 10): " concurrency
            performance_test "$url" "${requests:-100}" "${concurrency:-10}"
            ;;
        7)
            exit 0
            ;;
        *)
            echo -e "${RED}Geçersiz seçim!${NC}"
            ;;
    esac
done
