#!/bin/bash
# project_copymove.sh - Neo projelerini kopyalama/taşıma aracı

# Renkli çıktı için ANSI renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # Renk yok (Normal)

# Banner göster
clear
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}            PROJE KOPYALAMA/TAŞIMA ARACI                    ${NC}"
echo -e "${CYAN}============================================================${NC}"
echo

# Varsayılan değerler
MODE="copy" # Varsayılan mod kopyalama
SOURCE_DIR="$(dirname "$0")/projects"
TARGET_DIR="$(dirname "$0")/projects_target"
INCLUDE_VENDOR=false
INCLUDE_NODE=false
INCLUDE_GIT=false
EXCLUDE_PATTERNS=""
VERBOSE=false
DRY_RUN=false
FORCE=false
SOURCE_REGEX=""
RENAME_PATTERN=""
RENAME_REPLACE=""

# Yardım fonksiyonu
show_help() {
    echo -e "Kullanım: ${GREEN}./project_copymove.sh [seçenekler] [proje_adı1 proje_adı2 ...]${NC}"
    echo
    echo -e "Bu script, Neo projesindeki alt projeleri kopyalama veya taşıma işlemleri yapar."
    echo
    echo -e "Seçenekler:"
    echo -e "  ${YELLOW}-h, --help${NC}                Bu yardım mesajını gösterir"
    echo -e "  ${YELLOW}-c, --copy${NC}                Kopyalama modu (varsayılan)"
    echo -e "  ${YELLOW}-m, --move${NC}                Taşıma modu"
    echo -e "  ${YELLOW}-s, --source <desen>${NC}      Kaynak projeleri regex ile belirle"
    echo -e "  ${YELLOW}-t, --target <dizin>${NC}      Hedef dizini belirle (varsayılan: ./projects_target)"
    echo -e "  ${YELLOW}-v, --vendor${NC}              vendor dizinlerini dahil et"
    echo -e "  ${YELLOW}-n, --node${NC}                node_modules dizinlerini dahil et"
    echo -e "  ${YELLOW}-g, --git${NC}                 .git dizinlerini dahil et"
    echo -e "  ${YELLOW}-e, --exclude <desen>${NC}     Belirtilen desene uyan dosyaları hariç tut"
    echo -e "  ${YELLOW}--rename <desen:yeni>${NC}     Proje isimlerini değiştir (regex:yeni)"
    echo -e "  ${YELLOW}--dry-run${NC}                 İşlemi simüle et, gerçekte değişiklik yapma"
    echo -e "  ${YELLOW}--force${NC}                   Hedef dizin zaten varsa üzerine yaz"
    echo -e "  ${YELLOW}--verbose${NC}                 Ayrıntılı çıktı göster"
    echo
    echo -e "Örnekler:"
    echo -e "  ${GREEN}./project_copymove.sh proje1 proje2${NC}             # proje1 ve proje2'yi kopyalar"
    echo -e "  ${GREEN}./project_copymove.sh --move --target ../yedek${NC}  # Tüm projeleri ../yedek dizinine taşır"
    echo -e "  ${GREEN}./project_copymove.sh --source \"^api\" --verbose${NC} # api ile başlayan projeleri kopyalar"
    echo -e "  ${GREEN}./project_copymove.sh --rename \"old-:new-\" proje1${NC} # proje isimlerini değiştirir"
    echo
    exit 0
}

# Parametreleri işle
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_help
            ;;
        -c|--copy)
            MODE="copy"
            shift
            ;;
        -m|--move)
            MODE="move"
            shift
            ;;
        -s|--source)
            if [[ $# -gt 1 ]]; then
                SOURCE_REGEX="$2"
                shift 2
            else
                echo -e "${RED}Hata: --source için desen belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        -t|--target)
            if [[ $# -gt 1 ]]; then
                TARGET_DIR="$2"
                shift 2
            else
                echo -e "${RED}Hata: --target için dizin belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        -v|--vendor)
            INCLUDE_VENDOR=true
            shift
            ;;
        -n|--node)
            INCLUDE_NODE=true
            shift
            ;;
        -g|--git)
            INCLUDE_GIT=true
            shift
            ;;
        -e|--exclude)
            if [[ $# -gt 1 ]]; then
                EXCLUDE_PATTERNS="$2"
                shift 2
            else
                echo -e "${RED}Hata: --exclude için desen belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --rename)
            if [[ $# -gt 1 ]]; then
                # Regex:replace formatını ayrıştır
                if [[ "$2" =~ (.*):(.*)$ ]]; then
                    RENAME_PATTERN="${BASH_REMATCH[1]}"
                    RENAME_REPLACE="${BASH_REMATCH[2]}"
                else
                    echo -e "${RED}Hata: --rename için geçersiz format. 'desen:yerine' şeklinde olmalı.${NC}"
                    exit 1
                fi
                shift 2
            else
                echo -e "${RED}Hata: --rename için değer belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        -*)
            echo -e "${RED}Hata: Bilinmeyen seçenek: $1${NC}"
            exit 1
            ;;
        *)
            # Proje adlarını bir diziye ekle
            PROJECTS+=("$1")
            shift
            ;;
    esac
done

# projects klasörü var mı kontrol et
if [[ ! -d "$SOURCE_DIR" ]]; then
    echo -e "${RED}Hata: '$SOURCE_DIR' dizini bulunamadı!${NC}"
    echo -e "${RED}Bu scripti Neo projesinin kök dizininden çalıştırın.${NC}"
    exit 1
fi

# Hedef dizini kontrol et
if [[ -d "$TARGET_DIR" && "$FORCE" != "true" && "$DRY_RUN" != "true" ]]; then
    echo -e "${RED}Hata: Hedef dizin '$TARGET_DIR' zaten var!${NC}"
    echo -e "${RED}Üzerine yazmak için --force seçeneğini kullanın.${NC}"
    exit 1
fi

# Hedef dizini oluştur (dry-run modunda değilse)
if [[ "$DRY_RUN" != "true" ]]; then
    if [[ ! -d "$TARGET_DIR" ]]; then
        mkdir -p "$TARGET_DIR"
    fi
fi

# İşlenecek projeleri belirle
declare -a PROJECTS_TO_PROCESS

if [[ ${#PROJECTS[@]} -gt 0 ]]; then
    # Belirtilen projeleri işle
    for proj in "${PROJECTS[@]}"; do
        if [[ -d "$SOURCE_DIR/$proj" ]]; then
            PROJECTS_TO_PROCESS+=("$proj")
        else
            echo -e "${RED}Uyarı: '$proj' projesi bulunamadı, atlanıyor.${NC}"
        fi
    done
elif [[ -n "$SOURCE_REGEX" ]]; then
    # Regex ile eşleşen projeleri işle
    while IFS= read -r -d '' dir; do
        proj=$(basename "$dir")
        if [[ "$proj" =~ $SOURCE_REGEX ]]; then
            PROJECTS_TO_PROCESS+=("$proj")
        fi
    done < <(find "$SOURCE_DIR" -maxdepth 1 -type d -not -path "$SOURCE_DIR" -print0 | sort -z)
else
    # Tüm projeleri işle
    while IFS= read -r -d '' dir; do
        proj=$(basename "$dir")
        PROJECTS_TO_PROCESS+=("$proj")
    done < <(find "$SOURCE_DIR" -maxdepth 1 -type d -not -path "$SOURCE_DIR" -print0 | sort -z)
fi

# İşlenecek proje sayısını göster
echo -e "${BLUE}İşlem: ${NC}$([ "$MODE" == "copy" ] && echo "Kopyalama" || echo "Taşıma")"
echo -e "${BLUE}Hedef dizin: ${NC}$TARGET_DIR"
echo -e "${BLUE}Toplam ${#PROJECTS_TO_PROCESS[@]} proje işlenecek.${NC}"

if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}DRY-RUN modu: Herhangi bir değişiklik yapılmayacak.${NC}"
fi

echo

# Dışlanacak dosya ve dizinleri ayarla
EXCLUDE_OPTS=""
if [[ "$INCLUDE_VENDOR" != "true" ]]; then
    EXCLUDE_OPTS="$EXCLUDE_OPTS --exclude='*/vendor/*'"
fi

if [[ "$INCLUDE_NODE" != "true" ]]; then
    EXCLUDE_OPTS="$EXCLUDE_OPTS --exclude='*/node_modules/*'"
fi

if [[ "$INCLUDE_GIT" != "true" ]]; then
    EXCLUDE_OPTS="$EXCLUDE_OPTS --exclude='*/.git/*'"
fi

if [[ -n "$EXCLUDE_PATTERNS" ]]; then
    EXCLUDE_OPTS="$EXCLUDE_OPTS --exclude='$EXCLUDE_PATTERNS'"
fi

# Her projeyi işle
for proj in "${PROJECTS_TO_PROCESS[@]}"; do
    # Yeniden adlandırma işlemini uygula
    if [[ -n "$RENAME_PATTERN" && -n "$RENAME_REPLACE" ]]; then
        target_proj=$(echo "$proj" | sed "s/$RENAME_PATTERN/$RENAME_REPLACE/g")
    else
        target_proj="$proj"
    fi

    echo -e "${YELLOW}İşleniyor: ${NC}$proj"

    if [[ "$VERBOSE" == "true" ]]; then
        # Proje boyutunu göster
        proj_size=$(du -sh "$SOURCE_DIR/$proj" | cut -f1)
        echo -e "  ${BLUE}Boyut: ${NC}$proj_size"
        if [[ "$proj" != "$target_proj" ]]; then
            echo -e "  ${BLUE}Yeni isim: ${NC}$target_proj"
        fi
    fi

    # Dry-run modunda ise sadece simüle et
    if [[ "$DRY_RUN" == "true" ]]; then
        if [[ "$MODE" == "copy" ]]; then
            echo -e "  ${GREEN}[DRY-RUN] Kopyalanacak: ${NC}$SOURCE_DIR/$proj -> $TARGET_DIR/$target_proj"
        else
            echo -e "  ${GREEN}[DRY-RUN] Taşınacak: ${NC}$SOURCE_DIR/$proj -> $TARGET_DIR/$target_proj"
        fi
        continue
    fi

    # Hedef dizin var mı kontrol et
    if [[ -d "$TARGET_DIR/$target_proj" ]]; then
        if [[ "$FORCE" == "true" ]]; then
            echo -e "  ${YELLOW}Hedef dizin zaten var, siliniyor: ${NC}$TARGET_DIR/$target_proj"
            rm -rf "$TARGET_DIR/$target_proj"
        else
            echo -e "  ${RED}Hata: Hedef dizin zaten var: ${NC}$TARGET_DIR/$target_proj"
            echo -e "  ${RED}Üzerine yazmak için --force seçeneğini kullanın. Bu proje atlanıyor.${NC}"
            continue
        fi
    fi

    # Kopyalama veya taşıma işlemini gerçekleştir
    if [[ "$MODE" == "copy" ]]; then
        cp_cmd="cp -r $EXCLUDE_OPTS \"$SOURCE_DIR/$proj\" \"$TARGET_DIR/$target_proj\""
        echo -e "  ${GREEN}Kopyalanıyor...${NC}"
        eval "$cp_cmd"
        if [[ $? -eq 0 ]]; then
            echo -e "  ${GREEN}Başarıyla kopyalandı: ${NC}$SOURCE_DIR/$proj -> $TARGET_DIR/$target_proj"
        else
            echo -e "  ${RED}Kopyalama başarısız oldu: ${NC}$SOURCE_DIR/$proj"
        fi
    else # move
        mv_cmd="mv \"$SOURCE_DIR/$proj\" \"$TARGET_DIR/$target_proj\""
        echo -e "  ${GREEN}Taşınıyor...${NC}"
        eval "$mv_cmd"
        if [[ $? -eq 0 ]]; then
            echo -e "  ${GREEN}Başarıyla taşındı: ${NC}$SOURCE_DIR/$proj -> $TARGET_DIR/$target_proj"
        else
            echo -e "  ${RED}Taşıma başarısız oldu: ${NC}$SOURCE_DIR/$proj"
        fi
    fi
done

echo
echo -e "${GREEN}İşlem tamamlandı: $(date)${NC}"
