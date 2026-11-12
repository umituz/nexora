#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
TARGET_DIR="/var/www/html"
SCAN_OUTPUT_DIR="security_scans"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="$SCAN_OUTPUT_DIR/security_scan_$TIMESTAMP.log"
VULN_DB_FILE="$SCAN_OUTPUT_DIR/vulnerability_database.json"

# Tehlikeli paternler
declare -A PATTERNS=(
    ["sql_injection"]="SELECT.*FROM.*WHERE|INSERT.*INTO|UPDATE.*SET|DELETE.*FROM"
    ["xss"]="<script|javascript:|onload=|onerror="
    ["file_inclusion"]="include.*\$_|require.*\$_|include_once.*\$_|require_once.*\$_"
    ["command_injection"]="system\(|exec\(|shell_exec\(|passthru\(|eval\("
    ["file_upload"]="move_uploaded_file\(|copy\(.*\$_FILES"
    ["authentication_bypass"]="md5\(|sha1\(.*\$_"
    ["weak_crypto"]="mcrypt_|md5\(|sha1\("
)

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Gelişmiş Güvenlik Tarama Scripti"
    echo "===================================="

    mkdir -p "$SCAN_OUTPUT_DIR"
    touch "$OUTPUT_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$OUTPUT_FILE"
}

# Dosya izinlerini kontrol et
check_file_permissions() {
    log "${BLUE}Dosya izinleri kontrol ediliyor...${NC}"
    
    find "$TARGET_DIR" -type f -perm /o=w -exec ls -l {} \; > "$SCAN_OUTPUT_DIR/world_writable_files.txt"
    find "$TARGET_DIR" -type f -perm /u=s -exec ls -l {} \; > "$SCAN_OUTPUT_DIR/suid_files.txt"
    
    log "${GREEN}Dosya izinleri kontrolü tamamlandı${NC}"
}

# Güvenlik açıklarını tara
scan_vulnerabilities() {
    log "${BLUE}Güvenlik açıkları taranıyor...${NC}"
    
    for type in "${!PATTERNS[@]}"; do
        pattern="${PATTERNS[$type]}"
        log "\n${YELLOW}$type için tarama yapılıyor...${NC}"
        
        find "$TARGET_DIR" -type f -name "*.php" -exec grep -Hn -E "$pattern" {} \; > "$SCAN_OUTPUT_DIR/${type}_vulnerabilities.txt"
        
        count=$(wc -l < "$SCAN_OUTPUT_DIR/${type}_vulnerabilities.txt")
        if [ $count -gt 0 ]; then
            log "${RED}$type: $count potansiyel güvenlik açığı bulundu${NC}"
        else
            log "${GREEN}$type: Güvenlik açığı bulunamadı${NC}"
        fi
    done
}

# Dependency güvenlik kontrolü
check_dependencies() {
    log "${BLUE}Bağımlılıklar kontrol ediliyor...${NC}"
    
    if [ -f "composer.json" ]; then
        composer audit --format=json > "$SCAN_OUTPUT_DIR/composer_audit.json"
    fi
    
    if [ -f "package.json" ]; then
        npm audit --json > "$SCAN_OUTPUT_DIR/npm_audit.json"
    fi
    
    log "${GREEN}Bağımlılık kontrolü tamamlandı${NC}"
}

# SSL/TLS konfigürasyonu kontrolü
check_ssl_config() {
    log "${BLUE}SSL/TLS konfigürasyonu kontrol ediliyor...${NC}"
    
    if [ -d "/etc/nginx" ]; then
        grep -r "ssl_" /etc/nginx/ > "$SCAN_OUTPUT_DIR/ssl_config.txt"
    fi
    
    if [ -d "/etc/apache2" ]; then
        grep -r "SSLEngine" /etc/apache2/ > "$SCAN_OUTPUT_DIR/ssl_config.txt"
    fi
    
    log "${GREEN}SSL/TLS kontrolü tamamlandı${NC}"
}

# Güvenlik raporu oluştur
generate_report() {
    local report_file="$SCAN_OUTPUT_DIR/security_report_$TIMESTAMP.html"
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Güvenlik Tarama Raporu</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .vulnerability { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
        .high { background-color: #ffebee; }
        .medium { background-color: #fff3e0; }
        .low { background-color: #f1f8e9; }
    </style>
</head>
<body>
    <h1>Güvenlik Tarama Raporu</h1>
    <p>Tarih: $(date)</p>
    <h2>Özet</h2>
EOF
    
    # Özet bilgileri ekle
    for type in "${!PATTERNS[@]}"; do
        count=$(wc -l < "$SCAN_OUTPUT_DIR/${type}_vulnerabilities.txt")
        echo "<div class=vulnerability low>" >> "$report_file"
        echo "<h3>$type</h3>" >> "$report_file"
        echo "<p>Bulunan açık sayısı: $count</p>" >> "$report_file"
        if [ $count -gt 0 ]; then
            echo "<pre>" >> "$report_file"
            cat "$SCAN_OUTPUT_DIR/${type}_vulnerabilities.txt" >> "$report_file"
            echo "</pre>" >> "$report_file"
        fi
        echo "</div>" >> "$report_file"
    done
    
    echo "</body></html>" >> "$report_file"
    
    log "${GREEN}Güvenlik raporu oluşturuldu: $report_file${NC}"
}

# Ana fonksiyon
main() {
    setup
    check_file_permissions
    scan_vulnerabilities
    check_dependencies
    check_ssl_config
    generate_report
    
    log "${GREEN}Güvenlik taraması tamamlandı${NC}"
}

# Scripti çalıştır
main
