#!/bin/bash

# project_maintenance.sh - Neo projelerinde bakım ve temizleme işlemleri yapar

# Banner göster
clear
echo "============================================================"
echo "             PROJE BAKIM VE TEMİZLİK ARACI                 "
echo "============================================================"
echo

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# İşlemler
CLEAN_VENDOR=false
CLEAN_NODE=false
CLEAN_TEMP_FILES=false
REMOVE_DS_STORE=false
CLEAN_LOGS=false
FIX_PERMISSIONS=false
PROCESS_ALL=false
DRY_RUN=false
REGEX=""
VERBOSE=false

# Yardım fonksiyonu
function show_help {
    echo -e "${BLUE}Neo Proje Bakım Aracı${NC}"
    echo
    echo "Bu script, Neo proje dizinlerinde bakım ve temizlik işlemleri yapar."
    echo
    echo "Kullanım: ./project_maintenance.sh [seçenekler]"
    echo
    echo "Seçenekler:"
    echo "  -h, --help             Bu yardım mesajını gösterir"
    echo "  -v, --vendor           vendor/ dizinlerini temizler"
    echo "  -n, --node             node_modules/ dizinlerini temizler"
    echo "  -t, --temp             Geçici dosyaları temizler (*.tmp, *.bak, *.log, *.cache, vb.)"
    echo "  -d, --ds-store         .DS_Store dosyalarını kaldırır (macOS)"
    echo "  -l, --logs             Log dosyalarını temizler"
    echo "  -p, --permissions      Dosya izinlerini düzeltir (chmod)"
    echo "  -a, --all              Tüm temizleme işlemlerini uygular"
    echo "  --regex \"<pattern>\"    Sadece belirtilen regex ile eşleşen projelerde çalışır"
    echo "  --dry-run              Değişiklikleri uygulamadan simüle eder"
    echo "  --verbose              Ayrıntılı çıktı verir"
    echo
    echo "Örnekler:"
    echo "  ./project_maintenance.sh --all               # Tüm projelerde tam temizlik yapar"
    echo "  ./project_maintenance.sh --vendor --node     # Sadece vendor ve node_modules temizler"
    echo "  ./project_maintenance.sh --temp --regex \"web.*\" # Sadece web ile başlayan projelerin geçici dosyalarını temizler"
    echo
    exit 0
}

# Parametreleri kontrol et
if [ $# -eq 0 ]; then
    show_help
fi

# Argümanları işle
while [ $# -gt 0 ]; do
    case "$1" in
        -h|--help)
            show_help
            ;;
        -v|--vendor)
            CLEAN_VENDOR=true
            shift
            ;;
        -n|--node)
            CLEAN_NODE=true
            shift
            ;;
        -t|--temp)
            CLEAN_TEMP_FILES=true
            shift
            ;;
        -d|--ds-store)
            REMOVE_DS_STORE=true
            shift
            ;;
        -l|--logs)
            CLEAN_LOGS=true
            shift
            ;;
        -p|--permissions)
            FIX_PERMISSIONS=true
            shift
            ;;
        -a|--all)
            PROCESS_ALL=true
            shift
            ;;
        --regex)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --regex seçeneği için bir değer belirtilmedi.${NC}"
                exit 1
            fi
            REGEX="$2"
            shift 2
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo -e "${RED}Hata: Bilinmeyen parametre: $1${NC}"
            echo "Yardım için: ./project_maintenance.sh --help"
            exit 1
            ;;
    esac
done

# Tüm işlemleri etkinleştir
if [ "$PROCESS_ALL" = true ]; then
    CLEAN_VENDOR=true
    CLEAN_NODE=true
    CLEAN_TEMP_FILES=true
    REMOVE_DS_STORE=true
    CLEAN_LOGS=true
    FIX_PERMISSIONS=true
fi

# Hiçbir işlem seçilmediyse uyar
if [ "$CLEAN_VENDOR" = false ] && [ "$CLEAN_NODE" = false ] && [ "$CLEAN_TEMP_FILES" = false ] && [ "$REMOVE_DS_STORE" = false ] && [ "$CLEAN_LOGS" = false ] && [ "$FIX_PERMISSIONS" = false ]; then
    echo -e "${YELLOW}Uyarı: Hiçbir işlem seçilmedi. Yardım için: ./project_maintenance.sh --help${NC}"
    exit 1
fi

# Proje dizinini tanımla
PROJECT_DIR="$(dirname "$0")/projects"

# Dizin var mı kontrol et
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Hata: 'projects' klasörü bulunamadı!${NC}"
    echo "Bu scripti Neo projesinin kök dizininden çalıştırın."
    exit 1
fi

# İşlem yapılacak dizinleri belirle
cd "$PROJECT_DIR" || exit 1

# İlerleme göstergesi için toplam proje sayısı
if [ -n "$REGEX" ]; then
    TOTAL_PROJECTS=$(find . -maxdepth 1 -type d -name "$REGEX" | grep -v "^\.$" | wc -l)
else
    TOTAL_PROJECTS=$(find . -maxdepth 1 -type d | grep -v "^\.$" | wc -l)
fi

# Performans istatistikleri
SPACE_SAVED=0
START_TIME=$(date +%s)
COUNT_VENDOR=0
COUNT_NODE=0
COUNT_TEMP=0
COUNT_DS_STORE=0
COUNT_LOGS=0
COUNT_PERMISSION=0

# Başlık Bilgisi
echo -e "${GREEN}Proje Bakım ve Temizlik İşlemi Başlatılıyor${NC}"
echo -e "${CYAN}İşlemler:${NC}"
[ "$CLEAN_VENDOR" = true ] && echo " - vendor/ dizinleri temizlenecek"
[ "$CLEAN_NODE" = true ] && echo " - node_modules/ dizinleri temizlenecek"
[ "$CLEAN_TEMP_FILES" = true ] && echo " - Geçici dosyalar temizlenecek"
[ "$REMOVE_DS_STORE" = true ] && echo " - .DS_Store dosyaları kaldırılacak"
[ "$CLEAN_LOGS" = true ] && echo " - Log dosyaları temizlenecek"
[ "$FIX_PERMISSIONS" = true ] && echo " - Dosya izinleri düzeltilecek"

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}NOT: Kuru çalıştırma modu aktif (--dry-run). Dosyalar gerçekte silinmeyecek/değiştirilmeyecek.${NC}"
fi

if [ -n "$REGEX" ]; then
    echo -e "${CYAN}Sadece '$REGEX' ile eşleşen projeleri işliyorum.${NC}"
fi

echo
echo -e "${CYAN}Toplam İşlenecek Proje:${NC} $TOTAL_PROJECTS"
echo "--------------------------------------------------------"
echo

# İşleme başla
COUNTER=0

# Projeleri dolaş
find_command="find . -maxdepth 1 -type d"
if [ -n "$REGEX" ]; then
    find_command="$find_command -name \"$REGEX\""
fi
find_command="$find_command | grep -v \"^\.$\""

eval "$find_command" | while read -r project_dir; do
    project_name=$(basename "$project_dir")
    COUNTER=$((COUNTER + 1))

    echo -e "${MAGENTA}[$COUNTER/$TOTAL_PROJECTS] İşleniyor: ${CYAN}$project_name${NC}"

    # Vendor dizinlerini temizle
    if [ "$CLEAN_VENDOR" = true ]; then
        vendor_dirs=$(find "$project_dir" -type d -name "vendor" 2>/dev/null)
        if [ -n "$vendor_dirs" ]; then
            for vendor in $vendor_dirs; do
                if [ -d "$vendor" ]; then
                    size_before=$(du -sh "$vendor" 2>/dev/null | cut -f1)
                    if [ "$VERBOSE" = true ]; then
                        echo -e "  ${YELLOW}Vendor temizleniyor:${NC} $vendor (Boyut: $size_before)"
                    fi

                    if [ "$DRY_RUN" = false ]; then
                        space_freed=$(du -sk "$vendor" 2>/dev/null | cut -f1)
                        SPACE_SAVED=$((SPACE_SAVED + space_freed))
                        rm -rf "$vendor" 2>/dev/null
                        COUNT_VENDOR=$((COUNT_VENDOR + 1))
                    else
                        space_freed=$(du -sk "$vendor" 2>/dev/null | cut -f1)
                        SPACE_SAVED=$((SPACE_SAVED + space_freed))
                        COUNT_VENDOR=$((COUNT_VENDOR + 1))
                    fi
                fi
            done
        fi
    fi

    # Node modülleri temizle
    if [ "$CLEAN_NODE" = true ]; then
        node_dirs=$(find "$project_dir" -type d -name "node_modules" 2>/dev/null)
        if [ -n "$node_dirs" ]; then
            for node_mod in $node_dirs; do
                if [ -d "$node_mod" ]; then
                    size_before=$(du -sh "$node_mod" 2>/dev/null | cut -f1)
                    if [ "$VERBOSE" = true ]; then
                        echo -e "  ${YELLOW}Node modülleri temizleniyor:${NC} $node_mod (Boyut: $size_before)"
                    fi

                    if [ "$DRY_RUN" = false ]; then
                        space_freed=$(du -sk "$node_mod" 2>/dev/null | cut -f1)
                        SPACE_SAVED=$((SPACE_SAVED + space_freed))
                        rm -rf "$node_mod" 2>/dev/null
                        COUNT_NODE=$((COUNT_NODE + 1))
                    else
                        space_freed=$(du -sk "$node_mod" 2>/dev/null | cut -f1)
                        SPACE_SAVED=$((SPACE_SAVED + space_freed))
                        COUNT_NODE=$((COUNT_NODE + 1))
                    fi
                fi
            done
        fi
    fi

    # Geçici dosyaları temizle
    if [ "$CLEAN_TEMP_FILES" = true ]; then
        temp_pattern="*.tmp *.bak *.swp *.cache .phpunit.result.cache"
        for pattern in $temp_pattern; do
            temp_files=$(find "$project_dir" -type f -name "$pattern" 2>/dev/null)
            if [ -n "$temp_files" ]; then
                for temp in $temp_files; do
                    if [ "$VERBOSE" = true ]; then
                        echo -e "  ${YELLOW}Geçici dosya siliniyor:${NC} $temp"
                    fi

                    if [ "$DRY_RUN" = false ]; then
                        space_freed=$(du -sk "$temp" 2>/dev/null | cut -f1)
                        SPACE_SAVED=$((SPACE_SAVED + space_freed))
                        rm -f "$temp" 2>/dev/null
                        COUNT_TEMP=$((COUNT_TEMP + 1))
                    else
                        space_freed=$(du -sk "$temp" 2>/dev/null | cut -f1)
                        SPACE_SAVED=$((SPACE_SAVED + space_freed))
                        COUNT_TEMP=$((COUNT_TEMP + 1))
                    fi
                done
            fi
        done
    fi

    # DS_Store dosyalarını temizle
    if [ "$REMOVE_DS_STORE" = true ]; then
        ds_files=$(find "$project_dir" -type f -name ".DS_Store" 2>/dev/null)
        if [ -n "$ds_files" ]; then
            for ds in $ds_files; do
                if [ "$VERBOSE" = true ]; then
                    echo -e "  ${YELLOW}.DS_Store siliniyor:${NC} $ds"
                fi

                if [ "$DRY_RUN" = false ]; then
                    rm -f "$ds" 2>/dev/null
                    COUNT_DS_STORE=$((COUNT_DS_STORE + 1))
                else
                    COUNT_DS_STORE=$((COUNT_DS_STORE + 1))
                fi
            done
        fi
    fi

    # Log dosyalarını temizle
    if [ "$CLEAN_LOGS" = true ]; then
        log_dirs=(
            "$project_dir/storage/logs"
            "$project_dir/var/log"
            "$project_dir/log"
        )

        for log_dir in "${log_dirs[@]}"; do
            if [ -d "$log_dir" ]; then
                if [ "$VERBOSE" = true ]; then
                    echo -e "  ${YELLOW}Log dizini temizleniyor:${NC} $log_dir"
                fi

                if [ "$DRY_RUN" = false ]; then
                    space_freed=$(du -sk "$log_dir"/* 2>/dev/null | awk '{sum+=$1} END {print sum}')
                    SPACE_SAVED=$((SPACE_SAVED + space_freed))
                    rm -f "$log_dir"/* 2>/dev/null
                    COUNT_LOGS=$((COUNT_LOGS + 1))
                else
                    space_freed=$(du -sk "$log_dir"/* 2>/dev/null | awk '{sum+=$1} END {print sum}')
                    SPACE_SAVED=$((SPACE_SAVED + space_freed))
                    COUNT_LOGS=$((COUNT_LOGS + 1))
                fi
            fi
        done

        # Ayrıca .log uzantılı dosyaları temizle
        log_files=$(find "$project_dir" -type f -name "*.log" 2>/dev/null)
        if [ -n "$log_files" ]; then
            for log in $log_files; do
                if [ "$VERBOSE" = true ]; then
                    echo -e "  ${YELLOW}Log dosyası temizleniyor:${NC} $log"
                fi

                if [ "$DRY_RUN" = false ]; then
                    space_freed=$(du -sk "$log" 2>/dev/null | cut -f1)
                    SPACE_SAVED=$((SPACE_SAVED + space_freed))
                    rm -f "$log" 2>/dev/null
                    COUNT_LOGS=$((COUNT_LOGS + 1))
                else
                    space_freed=$(du -sk "$log" 2>/dev/null | cut -f1)
                    SPACE_SAVED=$((SPACE_SAVED + space_freed))
                    COUNT_LOGS=$((COUNT_LOGS + 1))
                fi
            done
        fi
    fi

    # Dosya izinlerini düzelt
    if [ "$FIX_PERMISSIONS" = true ]; then
        if [ "$VERBOSE" = true ]; then
            echo -e "  ${YELLOW}Dosya izinleri düzeltiliyor:${NC} $project_dir"
        fi

        if [ "$DRY_RUN" = false ]; then
            # Dizinler için
            find "$project_dir" -type d -exec chmod 755 {} \; 2>/dev/null
            # Dosyalar için
            find "$project_dir" -type f -exec chmod 644 {} \; 2>/dev/null
            # Executable dosyalar için
            find "$project_dir" -type f -name "*.sh" -exec chmod +x {} \; 2>/dev/null

            COUNT_PERMISSION=$((COUNT_PERMISSION + 1))
        else
            COUNT_PERMISSION=$((COUNT_PERMISSION + 1))
        fi
    fi

    echo
done

# İşlem sonuçları
END_TIME=$(date +%s)
ELAPSED_TIME=$((END_TIME - START_TIME))
ELAPSED_FORMATED=$(printf '%02d:%02d:%02d' $((ELAPSED_TIME/3600)) $((ELAPSED_TIME%3600/60)) $((ELAPSED_TIME%60)))

# MB'a dönüştür
SPACE_SAVED_MB=$((SPACE_SAVED / 1024))

echo "--------------------------------------------------------"
echo -e "${GREEN}Proje Bakım ve Temizleme İşlemi Tamamlandı${NC}"
echo -e "${CYAN}İşlem Özeti:${NC}"
echo
echo -e "Toplam işlenen proje: ${YELLOW}$TOTAL_PROJECTS${NC}"
echo -e "Geçen süre: ${YELLOW}$ELAPSED_FORMATED${NC}"
echo -e "Kurtarılan toplam alan: ${YELLOW}$SPACE_SAVED_MB MB${NC}"
echo
echo "Temizlenen Öğeler:"
[ "$CLEAN_VENDOR" = true ] && echo -e " - Vendor Dizinleri: ${YELLOW}$COUNT_VENDOR${NC}"
[ "$CLEAN_NODE" = true ] && echo -e " - Node Modülleri: ${YELLOW}$COUNT_NODE${NC}"
[ "$CLEAN_TEMP_FILES" = true ] && echo -e " - Geçici Dosyalar: ${YELLOW}$COUNT_TEMP${NC}"
[ "$REMOVE_DS_STORE" = true ] && echo -e " - .DS_Store Dosyaları: ${YELLOW}$COUNT_DS_STORE${NC}"
[ "$CLEAN_LOGS" = true ] && echo -e " - Log Dosyaları: ${YELLOW}$COUNT_LOGS${NC}"
[ "$FIX_PERMISSIONS" = true ] && echo -e " - İzinleri Düzeltilen Projeler: ${YELLOW}$COUNT_PERMISSION${NC}"
echo

if [ "$DRY_RUN" = true ]; then
    echo -e "${YELLOW}NOT: Bu bir kuru çalıştırma idi (--dry-run). Hiçbir değişiklik gerçekte uygulanmadı.${NC}"
    echo -e "${YELLOW}Gerçek değişiklikleri uygulamak için --dry-run seçeneğini kaldırın.${NC}"
fi

echo
echo -e "${GREEN}İşlem tamamlandı: $(date)${NC}"
echo
