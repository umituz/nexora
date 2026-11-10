#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
NETWORK_ROOT="network_management"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
NETWORK_DIR="$NETWORK_ROOT/$TIMESTAMP"
LOG_FILE="$NETWORK_DIR/network.log"
REPORT_FILE="$NETWORK_DIR/network_report.html"

# Hedef yapılandırması
TARGET_HOSTS=(
    "localhost"
    "google.com"
    "github.com"
)

TARGET_PORTS=(
    "80"
    "443"
    "3306"
    "6379"
)

# SSL sertifika yapılandırması
SSL_DOMAINS=(
    "example.com"
    "api.example.com"
)

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Ağ Yönetim Scripti"
    echo "===================================="

    mkdir -p "$NETWORK_DIR"
    touch "$LOG_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Ping testi
check_ping() {
    local host=$1
    log "${BLUE}Ping testi yapılıyor: $host${NC}"

    if ping -c 3 "$host" &> "$NETWORK_DIR/ping_${host}.txt"; then
        local avg_time=$(tail -1 "$NETWORK_DIR/ping_${host}.txt" | awk -F '/' '{print $5}' | awk -F '=' '{print $2}')
        log "${GREEN}$host erişilebilir - Ortalama süre: $avg_time${NC}"
        return 0
    else
        log "${RED}$host erişilemez${NC}"
        return 1
    fi
}

# Port tarama
scan_ports() {
    local host=$1
    log "${BLUE}Port taraması yapılıyor: $host${NC}"

    for port in "${TARGET_PORTS[@]}"; do
        if nc -zv -w3 "$host" "$port" &> "$NETWORK_DIR/port_${host}_${port}.txt"; then
            log "${GREEN}$host:$port açık${NC}"
        else
            log "${RED}$host:$port kapalı${NC}"
        fi
    done
}

# SSL sertifika kontrolü
check_ssl() {
    local domain=$1
    log "${BLUE}SSL sertifikası kontrol ediliyor: $domain${NC}"

    if echo | openssl s_client -servername "$domain" -connect "${domain}:443" 2>/dev/null | openssl x509 -noout -dates > "$NETWORK_DIR/ssl_${domain}.txt"; then
        local expiry=$(grep "notAfter=" "$NETWORK_DIR/ssl_${domain}.txt" | cut -d= -f2)
        log "${GREEN}$domain SSL sertifikası geçerli - Bitiş: $expiry${NC}"
    else
        log "${RED}$domain SSL sertifikası kontrol edilemedi${NC}"
    fi
}

# DNS kayıtları kontrolü
check_dns() {
    local domain=$1
    log "${BLUE}DNS kayıtları kontrol ediliyor: $domain${NC}"

    # A kaydı
    dig +short A "$domain" > "$NETWORK_DIR/dns_${domain}_a.txt"
    # MX kaydı
    dig +short MX "$domain" > "$NETWORK_DIR/dns_${domain}_mx.txt"
    # NS kaydı
    dig +short NS "$domain" > "$NETWORK_DIR/dns_${domain}_ns.txt"

    log "${GREEN}DNS kayıtları alındı: $domain${NC}"
}

# Traceroute analizi
run_traceroute() {
    local host=$1
    log "${BLUE}Traceroute analizi yapılıyor: $host${NC}"

    traceroute "$host" > "$NETWORK_DIR/traceroute_${host}.txt"
    log "${GREEN}Traceroute tamamlandı: $host${NC}"
}

# Network interface analizi
analyze_interfaces() {
    log "${BLUE}Network interfaceleri analiz ediliyor...${NC}"

    # Interface listesi
    ifconfig > "$NETWORK_DIR/interfaces.txt"

    # IP adresleri
    ip addr show > "$NETWORK_DIR/ip_addresses.txt"

    # Routing tablosu
    netstat -rn > "$NETWORK_DIR/routing_table.txt"

    log "${GREEN}Network interface analizi tamamlandı${NC}"
}

# Bandwidth kullanım analizi
analyze_bandwidth() {
    log "${BLUE}Bandwidth kullanımı analiz ediliyor...${NC}"

    # 10 saniyelik örnek
    if command -v iftop >/dev/null 2>&1; then
        iftop -t -s 10 > "$NETWORK_DIR/bandwidth.txt"
    else
        log "${YELLOW}iftop kurulu değil, bandwidth analizi yapılamadı${NC}"
    fi
}

# Network raporu oluştur
create_network_report() {
    log "${BLUE}Network raporu oluşturuluyor...${NC}"

    cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Ağ Yönetim Raporu</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        .success { color: green; }
        .warning { color: orange; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>Ağ Yönetim Raporu</h1>
    <p>Tarih: $(date)</p>

    <div class="section">
        <h2>Ping Sonuçları</h2>
        <pre>
$(for host in "${TARGET_HOSTS[@]}"; do
    cat "$NETWORK_DIR/ping_${host}.txt" 2>/dev/null || echo "Ping sonucu bulunamadı: $host"
    echo "-------------------"
done)
        </pre>
    </div>

    <div class="section">
        <h2>Port Tarama Sonuçları</h2>
        <pre>
$(for host in "${TARGET_HOSTS[@]}"; do
    for port in "${TARGET_PORTS[@]}"; do
        cat "$NETWORK_DIR/port_${host}_${port}.txt" 2>/dev/null || echo "Port tarama sonucu bulunamadı: $host:$port"
    done
    echo "-------------------"
done)
        </pre>
    </div>

    <div class="section">
        <h2>SSL Sertifika Bilgileri</h2>
        <pre>
$(for domain in "${SSL_DOMAINS[@]}"; do
    cat "$NETWORK_DIR/ssl_${domain}.txt" 2>/dev/null || echo "SSL bilgisi bulunamadı: $domain"
    echo "-------------------"
done)
        </pre>
    </div>

    <div class="section">
        <h2>DNS Kayıtları</h2>
        <pre>
$(for domain in "${SSL_DOMAINS[@]}"; do
    echo "=== $domain ==="
    echo "A Kayıtları:"
    cat "$NETWORK_DIR/dns_${domain}_a.txt" 2>/dev/null
    echo "MX Kayıtları:"
    cat "$NETWORK_DIR/dns_${domain}_mx.txt" 2>/dev/null
    echo "NS Kayıtları:"
    cat "$NETWORK_DIR/dns_${domain}_ns.txt" 2>/dev/null
    echo "-------------------"
done)
        </pre>
    </div>

    <div class="section">
        <h2>Network Interface Bilgileri</h2>
        <pre>$(cat "$NETWORK_DIR/interfaces.txt" 2>/dev/null)</pre>
    </div>

    <div class="section">
        <h2>Routing Tablosu</h2>
        <pre>$(cat "$NETWORK_DIR/routing_table.txt" 2>/dev/null)</pre>
    </div>

    <div class="section">
        <h2>Bandwidth Kullanımı</h2>
        <pre>$(cat "$NETWORK_DIR/bandwidth.txt" 2>/dev/null || echo "Bandwidth bilgisi bulunamadı")</pre>
    </div>

    <div class="section">
        <h2>Log</h2>
        <pre>$(cat "$LOG_FILE")</pre>
    </div>
</body>
</html>
EOF

    log "${GREEN}Network raporu oluşturuldu: $REPORT_FILE${NC}"
}

# Ana fonksiyon
main() {
    setup

    # Host kontrolleri
    for host in "${TARGET_HOSTS[@]}"; do
        check_ping "$host"
        scan_ports "$host"
        run_traceroute "$host"
    done

    # SSL ve DNS kontrolleri
    for domain in "${SSL_DOMAINS[@]}"; do
        check_ssl "$domain"
        check_dns "$domain"
    done

    # Sistem analizleri
    analyze_interfaces
    analyze_bandwidth

    # Rapor oluştur
    create_network_report

    log "${GREEN}Network yönetim işlemleri tamamlandı${NC}"
}

# Scripti çalıştır
main
