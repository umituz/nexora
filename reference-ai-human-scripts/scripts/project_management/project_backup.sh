#!/bin/bash

# project_backup.sh - Neo projelerini yedekleme aracı

# Banner göster
clear
echo "============================================================"
echo "                PROJE YEDEKLEME ARACI                       "
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

# Varsayılan değerler
BACKUP_DEST="$(dirname "$0")/backups"
BACKUP_PREFIX="backup"
BACKUP_ALL=false
FORMAT="tar.gz" # tar.gz, zip veya dir
INCLUDE_GIT=false
SOURCE_REGEX=""
PROJECT_LIST=()
INCREMENTAL=false
VERBOSE=false
DRY_RUN=false
INCLUDE_VENDOR=false
INCLUDE_NODE_MODULES=false
DATE_FORMAT=$(date +"%Y%m%d-%H%M%S")

# Yardım fonksiyonu
function show_help {
    echo -e "${BLUE}Neo Proje Yedekleme Aracı${NC}"
    echo
    echo "Bu script, Neo projeleri için yedekleme işlemi yapar."
    echo
    echo "Kullanım: ./project_backup.sh [seçenekler] [proje_adı1 proje_adı2 ...]"
    echo
    echo "Seçenekler:"
    echo "  -h, --help                     Bu yardım mesajını gösterir"
    echo "  -d, --destination <dizin>      Yedeklerin kaydedileceği dizin (varsayılan: ./backups)"
    echo "  -p, --prefix <önek>            Yedek dosya adı öneki (varsayılan: backup)"
    echo "  -a, --all                      Tüm projeleri yedekle"
    echo "  -g, --include-git              .git klasörlerini dahil et"
    echo "  -s, --source \"<regex>\"         Kaynak projeleri belirlemek için regex"
    echo "  -f, --format <format>          Yedek formatı: tar.gz, zip veya dir (varsayılan: tar.gz)"
    echo "  -i, --incremental              Artırımlı yedekleme yap (sadece değişiklikleri)"
    echo "  --include-vendor               Vendor klasörlerini dahil et"
    echo "  --include-node-modules         Node_modules klasörlerini dahil et"
    echo "  --dry-run                      İşlemi gerçekleştirmeden önce ne yapılacağını gösterir"
    echo "  -v, --verbose                  Ayrıntılı çıktı göster"
    echo
    echo "Örnekler:"
    echo "  ./project_backup.sh -a                   # Tüm projeleri yedekler"
    echo "  ./project_backup.sh proje1 proje2        # Belirtilen projeleri yedekler"
    echo "  ./project_backup.sh -s \"api.*\" -f zip    # 'api' ile başlayan projeleri zip olarak yedekler"
    echo "  ./project_backup.sh -a -d /media/backup  # Tüm projeleri belirtilen dizine yedekler"
    echo
    exit 0
}

# Parametreleri işle
while [ $# -gt 0 ]; do
    case "$1" in
        -h|--help)
            show_help
            ;;
        -d|--destination)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --destination seçeneği için bir dizin belirtilmedi.${NC}"
                exit 1
            fi
            BACKUP_DEST="$2"
            shift 2
            ;;
        -p|--prefix)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --prefix seçeneği için bir değer belirtilmedi.${NC}"
                exit 1
            fi
            BACKUP_PREFIX="$2"
            shift 2
            ;;
        -a|--all)
            BACKUP_ALL=true
            shift
            ;;
        -g|--include-git)
            INCLUDE_GIT=true
            shift
            ;;
        -s|--source)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --source seçeneği için bir regex deseni belirtilmedi.${NC}"
                exit 1
            fi
            SOURCE_REGEX="$2"
            shift 2
            ;;
        -f|--format)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --format seçeneği için bir değer belirtilmedi.${NC}"
                exit 1
            fi
            if [[ "$2" != "tar.gz" && "$2" != "zip" && "$2" != "dir" ]]; then
                echo -e "${RED}Hata: Geçersiz format: $2. Desteklenen formatlar: tar.gz, zip, dir${NC}"
                exit 1
            fi
            FORMAT="$2"
            shift 2
            ;;
        -i|--incremental)
            INCREMENTAL=true
            shift
            ;;
        --include-vendor)
            INCLUDE_VENDOR=true
            shift
            ;;
        --include-node-modules)
            INCLUDE_NODE_MODULES=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -*)
            echo -e "${RED}Hata: Bilinmeyen seçenek: $1${NC}"
            echo "Yardım için: ./project_backup.sh --help"
            exit 1
            ;;
        *)
            PROJECT_LIST+=("$1")
            shift
            ;;
    esac
done

# Proje dizinini tanımla
PROJECT_DIR="$(dirname "$0")/projects"

# Dizin var mı kontrol et
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Hata: 'projects' klasörü bulunamadı!${NC}"
    echo "Bu scripti Neo projesinin kök dizininden çalıştırın."
    exit 1
fi

# Yedekleme dizinini oluştur
if [ ! -d "$BACKUP_DEST" ]; then
    if [ "$DRY_RUN" = false ]; then
        mkdir -p "$BACKUP_DEST"
        if [ $? -ne 0 ]; then
            echo -e "${RED}Hata: Yedekleme dizini oluşturulamadı: $BACKUP_DEST${NC}"
            exit 1
        fi
        echo -e "${GREEN}Yedekleme dizini oluşturuldu: ${CYAN}$BACKUP_DEST${NC}"
    else
        echo -e "${YELLOW}Kuru çalıştırma: ${CYAN}Yedekleme dizini oluşturulacak: $BACKUP_DEST${NC}"
    fi
fi

# Başlık bilgisi
echo -e "${GREEN}Proje Yedekleme İşlemi Başlatılıyor${NC}"
echo -e "${CYAN}Yedekleme Ayarları:${NC}"
echo " - Yedekleme Dizini: $BACKUP_DEST"
echo " - Dosya Öneki: $BACKUP_PREFIX"
echo " - Format: $FORMAT"
if [ "$INCLUDE_GIT" = true ]; then
    echo " - Git Dizinleri: Dahil"
else
    echo " - Git Dizinleri: Hariç"
fi
if [ "$INCLUDE_VENDOR" = true ]; then
    echo " - Vendor Dizinleri: Dahil"
else
    echo " - Vendor Dizinleri: Hariç"
fi
if [ "$INCLUDE_NODE_MODULES" = true ]; then
    echo " - Node Modules: Dahil"
else
    echo " - Node Modules: Hariç"
fi
if [ "$INCREMENTAL" = true ]; then
    echo " - Yedekleme Türü: Artırımlı"
else
    echo " - Yedekleme Türü: Tam"
fi
if [ "$DRY_RUN" = true ]; then
    echo " - Kuru Çalıştırma: Evet (gerçek işlem yapılmayacak)"
fi

# Hangi projelerin yedekleneceğini belirle
if [ ${#PROJECT_LIST[@]} -gt 0 ]; then
    echo " - Yedeklenecek Projeler: ${PROJECT_LIST[*]}"
elif [ -n "$SOURCE_REGEX" ]; then
    echo " - Yedeklenecek Projeler: '$SOURCE_REGEX' ile eşleşen projeler"
elif [ "$BACKUP_ALL" = true ]; then
    echo " - Yedeklenecek Projeler: Tüm projeler"
else
    echo -e "${RED}Hata: Yedeklenecek projeler belirtilmedi.${NC}"
    echo "Proje adlarını doğrudan belirtin veya -a/--all ile tüm projeleri ya da -s/--source ile regex kullanın."
    exit 1
fi

echo
echo "--------------------------------------------------------"
echo

# Hariç tutulacak dizinleri tanımla
EXCLUDE_ARGS=()
if [ "$INCLUDE_GIT" = false ]; then
    EXCLUDE_ARGS+=("--exclude=.git")
fi
if [ "$INCLUDE_VENDOR" = false ]; then
    EXCLUDE_ARGS+=("--exclude=vendor")
fi
if [ "$INCLUDE_NODE_MODULES" = false ]; then
    EXCLUDE_ARGS+=("--exclude=node_modules")
fi

# İşlenecek projeleri belirle
cd "$PROJECT_DIR" || exit 1

declare -a PROJECTS_TO_BACKUP
if [ ${#PROJECT_LIST[@]} -gt 0 ]; then
    # Belirtilen projeleri kontrol et
    for project in "${PROJECT_LIST[@]}"; do
        if [ -d "$project" ]; then
            PROJECTS_TO_BACKUP+=("$project")
        else
            echo -e "${YELLOW}Uyarı: '$project' projesi bulunamadı, atlanıyor.${NC}"
        fi
    done
elif [ -n "$SOURCE_REGEX" ]; then
    # Regex ile eşleşen projeleri listele
    PROJECTS_TO_BACKUP=($(find . -maxdepth 1 -type d -not -path "./.*" -not -path "." | sed 's|^\./||' | grep -E "$SOURCE_REGEX" || true))
elif [ "$BACKUP_ALL" = true ]; then
    # Tüm projeleri listele
    PROJECTS_TO_BACKUP=($(find . -maxdepth 1 -type d -not -path "./.*" -not -path "." | sed 's|^\./||' || true))
fi

# Yedeklenecek proje var mı kontrol et
if [ ${#PROJECTS_TO_BACKUP[@]} -eq 0 ]; then
    echo -e "${RED}Hata: Yedeklenecek proje bulunamadı.${NC}"
    exit 1
fi

TOTAL_PROJECTS=${#PROJECTS_TO_BACKUP[@]}
TOTAL_SIZE=0
SUCCESS_COUNT=0
ERROR_COUNT=0
START_TIME=$(date +%s)

echo -e "${CYAN}Toplam ${TOTAL_PROJECTS} proje yedeklenecek.${NC}"
echo

# Geçici dizin oluştur
TEMP_DIR=$(mktemp -d)
if [ $? -ne 0 ]; then
    echo -e "${RED}Hata: Geçici dizin oluşturulamadı.${NC}"
    exit 1
fi

# İşleme başla
COUNTER=0
for project in "${PROJECTS_TO_BACKUP[@]}"; do
    COUNTER=$((COUNTER + 1))

    # Yedek dosya adı oluştur
    if [ "$FORMAT" = "dir" ]; then
        backup_file="${BACKUP_PREFIX}-${project}-${DATE_FORMAT}"
        backup_path="$BACKUP_DEST/$backup_file"
    else
        backup_file="${BACKUP_PREFIX}-${project}-${DATE_FORMAT}.${FORMAT}"
        backup_path="$BACKUP_DEST/$backup_file"
    fi

    echo -e "${CYAN}[$COUNTER/$TOTAL_PROJECTS] ${MAGENTA}$project${NC} yedekleniyor -> ${YELLOW}$backup_file${NC}"

    # Proje boyutunu hesapla
    if [ "$VERBOSE" = true ]; then
        project_size=$(du -sh "$project" | cut -f1)
        echo -e "  Proje boyutu: $project_size"
    fi

    # Kuru çalıştırma kontrolü
    if [ "$DRY_RUN" = true ]; then
        echo -e "${YELLOW}Kuru çalıştırma: Yedeklenecek: $project -> $backup_path${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        echo
        continue
    fi

    # Yedekleme işlemi
    if [ "$FORMAT" = "tar.gz" ]; then
        # TAR.GZ formatında yedekleme
        if [ "$VERBOSE" = true ]; then
            tar -czf "$backup_path" -C "$PROJECT_DIR" "${EXCLUDE_ARGS[@]}" "$project"
        else
            tar -czf "$backup_path" -C "$PROJECT_DIR" "${EXCLUDE_ARGS[@]}" "$project" >/dev/null 2>&1
        fi

        STATUS=$?
        if [ $STATUS -eq 0 ]; then
            echo -e "${GREEN}✓ Yedekleme Başarılı${NC}"
            BACKUP_SIZE=$(du -k "$backup_path" | cut -f1)
            TOTAL_SIZE=$((TOTAL_SIZE + BACKUP_SIZE))
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo -e "${RED}✗ Yedekleme Başarısız: $project${NC}"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        fi
    elif [ "$FORMAT" = "zip" ]; then
        # ZIP formatında yedekleme
        cd "$PROJECT_DIR" || exit 1
        if [ "$VERBOSE" = true ]; then
            zip -r "$backup_path" "$project" -x "*/\.git/*" "*/vendor/*" "*/node_modules/*"
        else
            zip -r "$backup_path" "$project" -x "*/\.git/*" "*/vendor/*" "*/node_modules/*" >/dev/null 2>&1
        fi

        STATUS=$?
        if [ $STATUS -eq 0 ]; then
            echo -e "${GREEN}✓ Yedekleme Başarılı${NC}"
            BACKUP_SIZE=$(du -k "$backup_path" | cut -f1)
            TOTAL_SIZE=$((TOTAL_SIZE + BACKUP_SIZE))
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo -e "${RED}✗ Yedekleme Başarısız: $project${NC}"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        fi
    else
        # DIR formatında yedekleme (klasör kopyalama)
        mkdir -p "$backup_path"

        if [ "$VERBOSE" = true ]; then
            rsync -av "${EXCLUDE_ARGS[@]}" "$project/" "$backup_path/"
        else
            rsync -a "${EXCLUDE_ARGS[@]}" "$project/" "$backup_path/" >/dev/null 2>&1
        fi

        STATUS=$?
        if [ $STATUS -eq 0 ]; then
            echo -e "${GREEN}✓ Yedekleme Başarılı${NC}"
            BACKUP_SIZE=$(du -sk "$backup_path" | cut -f1)
            TOTAL_SIZE=$((TOTAL_SIZE + BACKUP_SIZE))
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo -e "${RED}✗ Yedekleme Başarısız: $project${NC}"
            ERROR_COUNT=$((ERROR_COUNT + 1))
        fi
    fi

    echo
done

# Geçici dizini temizle
rm -rf "$TEMP_DIR"

# İşlem özeti
END_TIME=$(date +%s)
ELAPSED_TIME=$((END_TIME - START_TIME))
ELAPSED_FORMATED=$(printf '%02d:%02d:%02d' $((ELAPSED_TIME/3600)) $((ELAPSED_TIME%3600/60)) $((ELAPSED_TIME%60)))

# MB'a dönüştür
TOTAL_SIZE_MB=$((TOTAL_SIZE / 1024))

echo "--------------------------------------------------------"
echo -e "${GREEN}Proje Yedekleme İşlemi Tamamlandı${NC}"
echo -e "${CYAN}İşlem Özeti:${NC}"
echo
echo -e "Toplam Proje: ${YELLOW}$TOTAL_PROJECTS${NC}"
echo -e "Başarılı Yedekleme: ${GREEN}$SUCCESS_COUNT${NC}"
echo -e "Başarısız: ${RED}$ERROR_COUNT${NC}"
if [ "$DRY_RUN" = false ]; then
    echo -e "Toplam Yedek Boyutu: ${YELLOW}$TOTAL_SIZE_MB MB${NC}"
fi
echo -e "Geçen Süre: ${YELLOW}$ELAPSED_FORMATED${NC}"
echo
echo -e "Yedekleme Dizini: ${CYAN}$BACKUP_DEST${NC}"

# İşlemi tamamla
if [ $ERROR_COUNT -eq 0 ]; then
    if [ "$DRY_RUN" = true ]; then
        echo -e "${GREEN}Kuru çalıştırma tamamlandı. Gerçek yedekleme için --dry-run seçeneğini kaldırın.${NC}"
    else
        echo -e "${GREEN}Tüm projeler başarıyla yedeklendi!${NC}"
    fi
else
    echo -e "${YELLOW}İşlem tamamlandı, ancak bazı hatalar oluştu.${NC}"
    echo -e "${YELLOW}Lütfen hata mesajlarını kontrol edin.${NC}"
fi

echo
echo -e "${GREEN}İşlem tamamlandı: $(date)${NC}"
echo
