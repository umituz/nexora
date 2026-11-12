#!/bin/bash

# search_projects.sh - Projelerde içerik veya proje adı arama scripti

# Banner göster
clear
echo "============================================================"
echo "                 PROJE ARAMA ARACI                          "
echo "============================================================"
echo

# Komut satırı argümanını kontrol et
if [ $# -eq 0 ]; then
    echo "Hata: Arama terimi belirtilmedi."
    echo "Kullanım: ./search_projects.sh <arama-terimi> [--name|--content]"
    echo "Örnek: ./search_projects.sh \"Laravel\" --content"
    echo "       ./search_projects.sh \"home\" --name"
    echo
    echo "Seçenekler:"
    echo "  --name      : Sadece proje adlarında ara (varsayılan)"
    echo "  --content   : Dosya içeriklerinde ara"
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

# Arama terimini al
SEARCH_TERM="$1"
SEARCH_TYPE="name"  # Varsayılan olarak proje adlarında ara

# İkinci parametre belirtilmişse, arama türünü ayarla
if [ $# -eq 2 ]; then
    if [ "$2" == "--content" ]; then
        SEARCH_TYPE="content"
    elif [ "$2" == "--name" ]; then
        SEARCH_TYPE="name"
    else
        echo "Geçersiz seçenek: $2"
        echo "Kullanım: ./search_projects.sh <arama-terimi> [--name|--content]"
        exit 1
    fi
fi

# Arama türüne göre başlık göster
if [ "$SEARCH_TYPE" == "name" ]; then
    echo "\"$SEARCH_TERM\" ifadesini proje adlarında arıyorum..."
    echo
    echo "İşleniyor..."
    echo

    # Proje adlarında arama yap
    RESULTS=$(find "$PROJECT_DIR" -maxdepth 1 -type d -name "*$SEARCH_TERM*" | sort)

    # Sonuçları görüntüle
    if [ -z "$RESULTS" ]; then
        echo "Sonuç bulunamadı: \"$SEARCH_TERM\" ifadesi hiçbir proje adında geçmiyor."
    else
        RESULT_COUNT=$(echo "$RESULTS" | grep -v "^$PROJECT_DIR$" | wc -l | tr -d ' ')
        echo "------------------------------------------------------------"
        echo " PROJE ADI ARAMA SONUÇLARI ($RESULT_COUNT eşleşme)"
        echo "------------------------------------------------------------"

        echo "$RESULTS" | grep -v "^$PROJECT_DIR$" | while read -r project_path; do
            project_name=$(basename "$project_path")
            echo "  * $project_name"
        done
    fi
else
    echo "\"$SEARCH_TERM\" ifadesini proje içeriklerinde arıyorum..."
    echo "Bu işlem, dosya sayısına bağlı olarak biraz zaman alabilir."
    echo
    echo "İşleniyor..."
    echo

    # İçerik araması için geçici dosya oluştur
    TEMP_FILE=$(mktemp)

    # Her projede içerik araması yap
    cd "$PROJECT_DIR" || exit 1

    # İlerleme göstergesini başlat
    TOTAL_PROJECTS=$(find . -maxdepth 1 -type d | grep -v "^\.$" | wc -l)
    COUNTER=0

    find . -maxdepth 1 -type d | grep -v "^\.$" | while read -r project_dir; do
        project_name=$(basename "$project_dir")

        # İlerleme durumunu güncelle
        COUNTER=$((COUNTER + 1))
        printf "\rProje %d/%d: %s" "$COUNTER" "$TOTAL_PROJECTS" "$project_name"

        # İçerik araması yap ve sonuçları geçici dosyaya yaz
        if grep -r --include="*.php" --include="*.js" --include="*.vue" --include="*.html" --include="*.txt" --include="*.md" -l "$SEARCH_TERM" "$project_dir" > /dev/null 2>&1; then
            echo "$project_name" >> "$TEMP_FILE"
        fi
    done

    # Yeni satır ekle
    echo
    echo

    # Sonuçları görüntüle
    if [ ! -s "$TEMP_FILE" ]; then
        echo "Sonuç bulunamadı: \"$SEARCH_TERM\" ifadesi hiçbir dosya içeriğinde geçmiyor."
    else
        RESULT_COUNT=$(wc -l < "$TEMP_FILE" | tr -d ' ')
        echo "------------------------------------------------------------"
        echo " İÇERİK ARAMA SONUÇLARI ($RESULT_COUNT projede eşleşme)"
        echo "------------------------------------------------------------"

        sort "$TEMP_FILE" | while read -r project_name; do
            echo "  * $project_name"
        done
    fi

    # Geçici dosyayı temizle
    rm -f "$TEMP_FILE"
fi

echo
echo "Arama tamamlandı."
echo "Arama tarihi: $(date)"
echo
