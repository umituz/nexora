#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
STORAGE_ROOT="storage_management"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
STORAGE_DIR="$STORAGE_ROOT/$TIMESTAMP"
LOG_FILE="$STORAGE_DIR/storage.log"
REPORT_FILE="$STORAGE_DIR/storage_report.html"

# İzlenecek dizinler
MONITORED_DIRS=(
    "/var/www/storage/app"
    "/var/www/storage/logs"
    "/var/www/storage/framework"
    "/var/www/public/uploads"
)

# Dosya türleri ve boyut limitleri (MB)
declare -A FILE_LIMITS=(
    ["image"]="10"
    ["video"]="100"
    ["log"]="50"
    ["backup"]="500"
)

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Depolama Yönetim Scripti"
    echo "===================================="

    mkdir -p "$STORAGE_DIR"
    touch "$LOG_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Disk kullanımı analizi
analyze_disk_usage() {
    log "${BLUE}Disk kullanımı analiz ediliyor...${NC}"

    # Genel disk kullanımı
    df -h > "$STORAGE_DIR/disk_usage.txt"

    # Her izlenen dizin için detaylı analiz
    for dir in "${MONITORED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            log "Analiz ediliyor: $dir"
            
            # Dizin boyutu
            du -sh "$dir" > "$STORAGE_DIR/$(basename "$dir")_size.txt"
            
            # En büyük 10 dosya
            find "$dir" -type f -exec du -h {} + | sort -rh | head -n 10 > "$STORAGE_DIR/$(basename "$dir")_largest_files.txt"
            
            # Dosya türü dağılımı
            find "$dir" -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn > "$STORAGE_DIR/$(basename "$dir")_file_types.txt"
        else
            log "${YELLOW}Dizin bulunamadı: $dir${NC}"
        fi
    done

    log "${GREEN}Disk kullanım analizi tamamlandı${NC}"
}

# Büyük dosyaları tespit et
find_large_files() {
    log "${BLUE}Büyük dosyalar tespit ediliyor...${NC}"

    for dir in "${MONITORED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            for type in "${!FILE_LIMITS[@]}"; do
                limit=${FILE_LIMITS[$type]}
                case $type in
                    "image")
                        pattern="*.{jpg,jpeg,png,gif,webp}"
                        ;;
                    "video")
                        pattern="*.{mp4,avi,mov,wmv}"
                        ;;
                    "log")
                        pattern="*.log*"
                        ;;
                    "backup")
                        pattern="*.{bak,backup,sql,gz}"
                        ;;
                esac

                find "$dir" -type f -name "$pattern" -size +"$limit"M > "$STORAGE_DIR/large_${type}_files.txt"
                
                if [ -s "$STORAGE_DIR/large_${type}_files.txt" ]; then
                    log "${YELLOW}$type türünde büyük dosyalar bulundu ($limit MB üzeri)${NC}"
                fi
            done
        fi
    done

    log "${GREEN}Büyük dosya tespiti tamamlandı${NC}"
}

# Eski dosyaları tespit et
find_old_files() {
    log "${BLUE}Eski dosyalar tespit ediliyor...${NC}"

    # 30 günden eski dosyalar
    for dir in "${MONITORED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            find "$dir" -type f -mtime +30 > "$STORAGE_DIR/$(basename "$dir")_old_files.txt"
            
            count=$(wc -l < "$STORAGE_DIR/$(basename "$dir")_old_files.txt")
            if [ "$count" -gt 0 ]; then
                log "${YELLOW}$dir dizininde $count eski dosya bulundu${NC}"
            fi
        fi
    done

    log "${GREEN}Eski dosya tespiti tamamlandı${NC}"
}

# Dosya izinlerini kontrol et
check_permissions() {
    log "${BLUE}Dosya izinleri kontrol ediliyor...${NC}"

    for dir in "${MONITORED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            # World-writable dosyaları bul
            find "$dir" -type f -perm -002 > "$STORAGE_DIR/$(basename "$dir")_world_writable.txt"
            
            # Yanlış sahiplik
            find "$dir" ! -user www-data > "$STORAGE_DIR/$(basename "$dir")_wrong_owner.txt"
        fi
    done

    log "${GREEN}Dosya izin kontrolü tamamlandı${NC}"
}

# Depolama optimizasyonu
optimize_storage() {
    log "${BLUE}Depolama optimizasyonu başlatılıyor...${NC}"

    # Sıkıştırılabilir dosyaları bul
    for dir in "${MONITORED_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            # Log dosyalarını sıkıştır
            find "$dir" -type f -name "*.log" ! -name "*.gz" -mtime +7 -exec gzip {} \;
            
            # Eski yedekleri temizle
            find "$dir" -type f -name "*.bak" -mtime +30 -delete
        fi
    done

    log "${GREEN}Depolama optimizasyonu tamamlandı${NC}"
}

# Depolama raporu oluştur
create_storage_report() {
    log "${BLUE}Depolama raporu oluşturuluyor...${NC}"

    cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Depolama Yönetim Raporu</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        .warning { color: orange; }
        .error { color: red; }
        .success { color: green; }
    </style>
</head>
<body>
    <h1>Depolama Yönetim Raporu</h1>
    <p>Tarih: $(date)</p>

    <div class="section">
        <h2>Genel Disk Kullanımı</h2>
        <pre>$(cat "$STORAGE_DIR/disk_usage.txt")</pre>
    </div>

    <div class="section">
        <h2>Dizin Analizleri</h2>
        $(for dir in "${MONITORED_DIRS[@]}"; do
            if [ -d "$dir" ]; then
                echo "<h3>$dir</h3>"
                echo "<h4>Dizin Boyutu:</h4>"
                echo "<pre>$(cat "$STORAGE_DIR/$(basename "$dir")_size.txt")</pre>"
                echo "<h4>En Büyük Dosyalar:</h4>"
                echo "<pre>$(cat "$STORAGE_DIR/$(basename "$dir")_largest_files.txt")</pre>"
                echo "<h4>Dosya Türü Dağılımı:</h4>"
                echo "<pre>$(cat "$STORAGE_DIR/$(basename "$dir")_file_types.txt")</pre>"
            fi
        done)
    </div>

    <div class="section">
        <h2>Büyük Dosyalar</h2>
        $(for type in "${!FILE_LIMITS[@]}"; do
            echo "<h3>$type dosyaları (${FILE_LIMITS[$type]}MB üzeri)</h3>"
            echo "<pre>$(cat "$STORAGE_DIR/large_${type}_files.txt" 2>/dev/null || echo "Büyük dosya bulunamadı")</pre>"
        done)
    </div>

    <div class="section">
        <h2>Eski Dosyalar</h2>
        $(for dir in "${MONITORED_DIRS[@]}"; do
            if [ -d "$dir" ]; then
                echo "<h3>$(basename "$dir")</h3>"
                echo "<pre>$(cat "$STORAGE_DIR/$(basename "$dir")_old_files.txt" 2>/dev/null || echo "Eski dosya bulunamadı")</pre>"
            fi
        done)
    </div>

    <div class="section">
        <h2>İzin Sorunları</h2>
        $(for dir in "${MONITORED_DIRS[@]}"; do
            if [ -d "$dir" ]; then
                echo "<h3>$(basename "$dir")</h3>"
                echo "<h4>World-Writable Dosyalar:</h4>"
                echo "<pre>$(cat "$STORAGE_DIR/$(basename "$dir")_world_writable.txt" 2>/dev/null || echo "Sorunlu dosya bulunamadı")</pre>"
                echo "<h4>Yanlış Sahiplik:</h4>"
                echo "<pre>$(cat "$STORAGE_DIR/$(basename "$dir")_wrong_owner.txt" 2>/dev/null || echo "Sorunlu dosya bulunamadı")</pre>"
            fi
        done)
    </div>

    <div class="section">
        <h2>Log</h2>
        <pre>$(cat "$LOG_FILE")</pre>
    </div>
</body>
</html>
EOF

    log "${GREEN}Depolama raporu oluşturuldu: $REPORT_FILE${NC}"
}

# Ana fonksiyon
main() {
    setup
    analyze_disk_usage
    find_large_files
    find_old_files
    check_permissions
    optimize_storage
    create_storage_report

    log "${GREEN}Depolama yönetim işlemleri tamamlandı${NC}"
}

# Scripti çalıştır
main
