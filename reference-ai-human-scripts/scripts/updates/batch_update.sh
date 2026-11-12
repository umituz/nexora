#!/bin/bash

# batch_update.sh - Tüm projelerde ortak bir dosyayı günceller

# Banner göster
clear
echo "============================================================"
echo "              TOPLU DOSYA GÜNCELLEME ARACI                  "
echo "============================================================"
echo

# Parametreleri kontrol et
if [ $# -lt 2 ]; then
    echo "Hata: Yetersiz parametre."
    echo "Kullanım: ./batch_update.sh <dosya-adı> <kaynak-dosya> [--dry-run] [--regex \"<regex>\"]"
    echo "Örnek: ./batch_update.sh .gitignore templates/gitignore_template.txt"
    echo "       ./batch_update.sh composer.json templates/composer.json --regex \"home.*\""
    echo
    echo "Seçenekler:"
    echo "  --dry-run    : Değişiklikleri uygulamadan önce göster"
    echo "  --regex      : Sadece belirtilen regex ile eşleşen projelerde güncelleme yap"
    exit 1
fi

# Parametreleri al
TARGET_FILE="$1"
SOURCE_FILE="$2"
DRY_RUN=false
REGEX=""

# Ek parametreler
shift 2
while [ $# -gt 0 ]; do
    case "$1" in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --regex)
            if [ -z "$2" ]; then
                echo "Hata: --regex seçeneği için bir değer belirtilmedi."
                exit 1
            fi
            REGEX="$2"
            shift 2
            ;;
        *)
            echo "Geçersiz seçenek: $1"
            echo "Kullanım: ./batch_update.sh <dosya-adı> <kaynak-dosya> [--dry-run] [--regex \"<regex>\"]"
            exit 1
            ;;
    esac
done

# Kaynak dosyanın varlığını kontrol et
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Hata: Kaynak dosya ($SOURCE_FILE) bulunamadı!"
    exit 1
fi

# Proje dizinini tanımla
PROJECT_DIR="$(dirname "$0")/projects"

# Dizin var mı kontrol et
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Hata: 'projects' klasörü bulunamadı!"
    echo "Bu scripti Neo projesinin kök dizininden çalıştırın."
    exit 1
fi

echo "Toplu dosya güncellemesi başlatılıyor..."
echo "Hedef dosya: $TARGET_FILE"
echo "Kaynak dosya: $SOURCE_FILE"

if [ "$DRY_RUN" = true ]; then
    echo "NOT: Kuru çalıştırma modu aktif (--dry-run). Dosyalar gerçekte güncellenmeyecek."
fi

if [ -n "$REGEX" ]; then
    echo "Sadece '$REGEX' ile eşleşen projeleri güncelliyorum."
fi

echo

# Geçici dosyalar
UPDATED_LIST=$(mktemp)
SKIPPED_LIST=$(mktemp)
CREATED_LIST=$(mktemp)
ERROR_LIST=$(mktemp)

# Proje dizinlerine git
cd "$PROJECT_DIR" || exit 1

# İlerleme göstergesi için toplam proje sayısı
if [ -n "$REGEX" ]; then
    TOTAL_PROJECTS=$(find . -maxdepth 1 -type d -name "$REGEX" | grep -v "^\.$" | wc -l)
else
    TOTAL_PROJECTS=$(find . -maxdepth 1 -type d | grep -v "^\.$" | wc -l)
fi

COUNTER=0
UPDATED=0
SKIPPED=0
CREATED=0
ERROR=0

echo "İşleniyor [" | tr -d '\n'
PROGRESS_WIDTH=40  # İlerleme çubuğu genişliği

# Projeleri dolaş
find_command="find . -maxdepth 1 -type d"
if [ -n "$REGEX" ]; then
    find_command="$find_command -name \"$REGEX\""
fi
find_command="$find_command | grep -v \"^\.$\""

eval "$find_command" | while read -r project_dir; do
    project_name=$(basename "$project_dir")
    target_path="$project_dir/$TARGET_FILE"

    # İlerleme durumunu güncelle
    COUNTER=$((COUNTER + 1))
    PROGRESS=$((COUNTER * PROGRESS_WIDTH / TOTAL_PROJECTS))

    # İlerleme çubuğunu göster
    echo -ne "\rİşleniyor ["
    for ((i=0; i<PROGRESS_WIDTH; i++)); do
        if [ $i -lt $PROGRESS ]; then
            echo -n "#"
        else
            echo -n " "
        fi
    done
    echo -n "] $COUNTER/$TOTAL_PROJECTS"

    # Hedef dosya var mı kontrol et
    if [ -f "$target_path" ]; then
        # Dosyaları karşılaştır
        if cmp -s "$SOURCE_FILE" "$target_path"; then
            # Dosyalar aynı, güncelleme gerekmiyor
            echo "$project_name" >> "$SKIPPED_LIST"
            SKIPPED=$((SKIPPED + 1))
        else
            # Dosyalar farklı, güncelleme yap
            if [ "$DRY_RUN" = false ]; then
                if cp "$SOURCE_FILE" "$target_path" 2>/dev/null; then
                    echo "$project_name" >> "$UPDATED_LIST"
                    UPDATED=$((UPDATED + 1))
                else
                    echo "$project_name" >> "$ERROR_LIST"
                    ERROR=$((ERROR + 1))
                fi
            else
                # Kuru çalıştırma modunda sadece liste yap
                echo "$project_name" >> "$UPDATED_LIST"
                UPDATED=$((UPDATED + 1))
            fi
        fi
    else
        # Dosya mevcut değil, yeni oluştur
        if [ "$DRY_RUN" = false ]; then
            if cp "$SOURCE_FILE" "$target_path" 2>/dev/null; then
                echo "$project_name" >> "$CREATED_LIST"
                CREATED=$((CREATED + 1))
            else
                echo "$project_name" >> "$ERROR_LIST"
                ERROR=$((ERROR + 1))
            fi
        else
            # Kuru çalıştırma modunda sadece liste yap
            echo "$project_name" >> "$CREATED_LIST"
            CREATED=$((CREATED + 1))
        fi
    fi
done

# Yeni satır ekle
echo -e "\n"

# Sonuçları göster
echo "------------------------------------------------------------"
echo "                TOPLU GÜNCELLEME SONUÇLARI                  "
echo "------------------------------------------------------------"
echo

echo "İşlem özeti:"
echo "  * Toplam İncelenen Proje: $TOTAL_PROJECTS"
echo "  * Güncellenen Dosya: $UPDATED"
echo "  * Yeni Oluşturulan Dosya: $CREATED"
echo "  * Değişiklik Yapılmayan Dosya: $SKIPPED"
echo "  * Hata Oluşan Dosya: $ERROR"
echo

# Listeleri göster
if [ "$UPDATED" -gt 0 ]; then
    echo "Güncellenen projeler:"
    cat "$UPDATED_LIST" | sort | sed 's/^/  * /'
    echo
fi

if [ "$CREATED" -gt 0 ]; then
    echo "Yeni dosya oluşturulan projeler:"
    cat "$CREATED_LIST" | sort | sed 's/^/  * /'
    echo
fi

if [ "$SKIPPED" -gt 0 ]; then
    echo "Değişiklik yapılmayan projeler:"
    cat "$SKIPPED_LIST" | sort | sed 's/^/  * /'
    echo
fi

if [ "$ERROR" -gt 0 ]; then
    echo "Hata oluşan projeler:"
    cat "$ERROR_LIST" | sort | sed 's/^/  * /'
    echo
fi

# Geçici dosyaları temizle
rm -f "$UPDATED_LIST" "$SKIPPED_LIST" "$CREATED_LIST" "$ERROR_LIST"

# Eğer kuru çalıştırma modu aktifse hatırlat
if [ "$DRY_RUN" = true ]; then
    echo "NOT: Bu bir kuru çalıştırma idi (--dry-run). Hiçbir değişiklik gerçekte uygulanmadı."
    echo "Gerçek değişiklikleri uygulamak için --dry-run seçeneğini kaldırın."
fi

echo
echo "İşlem tamamlandı: $(date)"
echo
