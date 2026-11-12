#!/bin/bash

# project_stats.sh - Projeler hakkında istatistikler toplayan script

# Banner göster
clear
echo "============================================================"
echo "                 PROJE İSTATİSTİKLERİ                       "
echo "============================================================"
echo

# Proje dizinini tanımla
PROJECT_DIR="$(dirname "$0")/projects"

# Dizin var mı kontrol et
if [ ! -d "$PROJECT_DIR" ]; then
    echo "Hata: 'projects' klasörü bulunamadı!"
    echo "Bu scripti Neo projesinin kök dizininden çalıştırın."
    exit 1
fi

# Seçenekleri değerlendirme
SORT_BY="name"  # Varsayılan sıralama: isim
DETAIL_LEVEL="basic"  # Varsayılan detay seviyesi: temel

# Parametreleri işle
while [ $# -gt 0 ]; do
    case "$1" in
        --sort-size)
            SORT_BY="size"
            shift
            ;;
        --sort-files)
            SORT_BY="files"
            shift
            ;;
        --sort-date)
            SORT_BY="date"
            shift
            ;;
        --detailed)
            DETAIL_LEVEL="detailed"
            shift
            ;;
        --help)
            echo "Kullanım: ./project_stats.sh [seçenekler]"
            echo
            echo "Seçenekler:"
            echo "  --sort-size    : Projeleri boyuta göre sırala (büyükten küçüğe)"
            echo "  --sort-files   : Projeleri dosya sayısına göre sırala (büyükten küçüğe)"
            echo "  --sort-date    : Projeleri son değişiklik tarihine göre sırala (yeniden eskiye)"
            echo "  --detailed     : Detaylı istatistikler göster (dosya türleri, satır sayıları vb.)"
            echo "  --help         : Bu yardım mesajını göster"
            exit 0
            ;;
        *)
            echo "Geçersiz seçenek: $1"
            echo "Yardım için: ./project_stats.sh --help"
            exit 1
            ;;
    esac
done

echo "Proje istatistikleri toplanıyor..."
echo "Bu işlem projelerinizin sayısına ve boyutuna bağlı olarak zaman alabilir."
echo

# Geçici dosya oluştur
TEMP_FILE=$(mktemp)

# İstatistik toplamaya başla
cd "$PROJECT_DIR" || exit 1

# İlerleme göstergesi için toplam proje sayısını hesapla
TOTAL_PROJECTS=$(find . -maxdepth 1 -type d | grep -v "^\.$" | wc -l)
COUNTER=0

echo "İşleniyor [" | tr -d '\n'
PROGRESS_WIDTH=40  # İlerleme çubuğu genişliği

find . -maxdepth 1 -type d | grep -v "^\.$" | while read -r project_dir; do
    project_name=$(basename "$project_dir")

    # İlerleme durumunu güncelle
    COUNTER=$((COUNTER + 1))
    PROGRESS=$((COUNTER * PROGRESS_WIDTH / TOTAL_PROJECTS))

    # İlerleme çubuğunu güncelle (sadece her 5 projede bir)
    if [ $((COUNTER % 5)) -eq 0 ] || [ "$COUNTER" -eq "$TOTAL_PROJECTS" ]; then
        echo -ne "\rİşleniyor ["
        for ((i=0; i<PROGRESS_WIDTH; i++)); do
            if [ $i -lt $PROGRESS ]; then
                echo -n "#"
            else
                echo -n " "
            fi
        done
        echo -n "] $COUNTER/$TOTAL_PROJECTS"
    fi

    # Proje boyutunu hesapla
    if [ "$(uname)" == "Darwin" ]; then  # macOS
        project_size=$(du -sk "$project_dir" | cut -f1)
    else  # Linux ve diğerleri
        project_size=$(du -sk "$project_dir" | awk '{print $1}')
    fi

    # Dosya sayısını hesapla
    file_count=$(find "$project_dir" -type f | wc -l | tr -d ' ')

    # Son değişiklik tarihini bul
    last_modified=$(find "$project_dir" -type f -exec stat -f "%m" {} \; 2>/dev/null | sort -nr | head -1)
    if [ -z "$last_modified" ]; then
        last_modified=0
    fi

    # Detaylı istatistikler istenirse ek bilgileri topla
    if [ "$DETAIL_LEVEL" == "detailed" ]; then
        # PHP dosya sayısı
        php_count=$(find "$project_dir" -name "*.php" | wc -l | tr -d ' ')

        # JavaScript dosya sayısı
        js_count=$(find "$project_dir" -name "*.js" | wc -l | tr -d ' ')

        # Vue dosya sayısı
        vue_count=$(find "$project_dir" -name "*.vue" | wc -l | tr -d ' ')

        # CSS/SCSS dosya sayısı
        css_count=$(find "$project_dir" -name "*.css" -o -name "*.scss" | wc -l | tr -d ' ')

        # Resim dosya sayısı
        img_count=$(find "$project_dir" -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" | wc -l | tr -d ' ')

        # Sonuçları geçici dosyaya yaz (gelişmiş format)
        echo "$project_name|$project_size|$file_count|$last_modified|$php_count|$js_count|$vue_count|$css_count|$img_count" >> "$TEMP_FILE"
    else
        # Sonuçları geçici dosyaya yaz (temel format)
        echo "$project_name|$project_size|$file_count|$last_modified" >> "$TEMP_FILE"
    fi
done

# Yeni satır ekle
echo -e "\n"

# Sıralama türüne göre sırala ve görüntüle
echo "------------------------------------------------------------"
echo "                    PROJE İSTATİSTİKLERİ                    "
echo "------------------------------------------------------------"

if [ "$DETAIL_LEVEL" == "detailed" ]; then
    echo "Proje Adı                      | Boyut (KB) | Dosyalar | Son Değişiklik | PHP | JS | Vue | CSS | Resim"
    echo "--------------------------------|------------|----------|----------------|-----|----|----|-----|-------"
else
    echo "Proje Adı                      | Boyut (KB) | Dosyalar | Son Değişiklik"
    echo "--------------------------------|------------|----------|----------------"
fi

case "$SORT_BY" in
    "size")
        sort_field=2
        sort_order="-rn"  # Büyükten küçüğe sayısal sıralama
        echo "Projeleri BOYUTA göre sıralıyorum (büyükten küçüğe)..."
        ;;
    "files")
        sort_field=3
        sort_order="-rn"  # Büyükten küçüğe sayısal sıralama
        echo "Projeleri DOSYA SAYISINA göre sıralıyorum (büyükten küçüğe)..."
        ;;
    "date")
        sort_field=4
        sort_order="-rn"  # Yeniden eskiye sayısal sıralama
        echo "Projeleri SON DEĞİŞİKLİK TARİHİNE göre sıralıyorum (yeniden eskiye)..."
        ;;
    *)
        sort_field=1
        sort_order=""     # Alfabetik sıralama
        echo "Projeleri İSME göre sıralıyorum (alfabetik)..."
        ;;
esac

echo

if [ "$DETAIL_LEVEL" == "detailed" ]; then
    # Detaylı format için görüntüleme
    sort -t '|' -k "$sort_field" $sort_order "$TEMP_FILE" | while IFS='|' read -r name size files date php js vue css img; do
        # Tarih formatını dönüştür
        if [ "$date" -gt 0 ]; then
            formatted_date=$(date -r "$date" "+%Y-%m-%d %H:%M" 2>/dev/null)
        else
            formatted_date="Bilinmiyor"
        fi

        # Boyutu daha okunaklı formata dönüştür
        if [ "$size" -gt 1024 ]; then
            readable_size="$(echo "scale=1; $size/1024" | bc) MB"
        else
            readable_size="$size KB"
        fi

        # Çıktıyı yazdır
        printf "%-30s | %-10s | %-8s | %-14s | %-3s | %-2s | %-2s | %-3s | %-5s\n" "$name" "$readable_size" "$files" "$formatted_date" "$php" "$js" "$vue" "$css" "$img"
    done
else
    # Temel format için görüntüleme
    sort -t '|' -k "$sort_field" $sort_order "$TEMP_FILE" | while IFS='|' read -r name size files date; do
        # Tarih formatını dönüştür
        if [ "$date" -gt 0 ]; then
            formatted_date=$(date -r "$date" "+%Y-%m-%d %H:%M" 2>/dev/null)
        else
            formatted_date="Bilinmiyor"
        fi

        # Boyutu daha okunaklı formata dönüştür
        if [ "$size" -gt 1024 ]; then
            readable_size="$(echo "scale=1; $size/1024" | bc) MB"
        else
            readable_size="$size KB"
        fi

        # Çıktıyı yazdır
        printf "%-30s | %-10s | %-8s | %-14s\n" "$name" "$readable_size" "$files" "$formatted_date"
    done
fi

# Özet bilgisi
echo
echo "============================================================"
echo "                      ÖZET BİLGİLER                         "
echo "============================================================"
echo

# Toplam projeyi bul
project_count=$(wc -l < "$TEMP_FILE")
echo "Toplam Proje Sayısı: $project_count"

# Toplam boyutu bul
total_size=$(awk -F'|' '{total += $2} END {print total}' "$TEMP_FILE")
if [ "$total_size" -gt 1048576 ]; then  # 1 GB'dan büyükse
    echo "Toplam Boyut: $(echo "scale=2; $total_size/1048576" | bc) GB"
elif [ "$total_size" -gt 1024 ]; then   # 1 MB'dan büyükse
    echo "Toplam Boyut: $(echo "scale=2; $total_size/1024" | bc) MB"
else
    echo "Toplam Boyut: $total_size KB"
fi

# Toplam dosya sayısını bul
total_files=$(awk -F'|' '{total += $3} END {print total}' "$TEMP_FILE")
echo "Toplam Dosya Sayısı: $total_files"

# En büyük proje
largest_project=$(sort -t '|' -k2 -rn "$TEMP_FILE" | head -1)
largest_name=$(echo "$largest_project" | cut -d'|' -f1)
largest_size=$(echo "$largest_project" | cut -d'|' -f2)
if [ "$largest_size" -gt 1024 ]; then
    echo "En Büyük Proje: $largest_name ($(echo "scale=1; $largest_size/1024" | bc) MB)"
else
    echo "En Büyük Proje: $largest_name ($largest_size KB)"
fi

# En fazla dosyaya sahip proje
most_files_project=$(sort -t '|' -k3 -rn "$TEMP_FILE" | head -1)
most_files_name=$(echo "$most_files_project" | cut -d'|' -f1)
most_files_count=$(echo "$most_files_project" | cut -d'|' -f3)
echo "En Fazla Dosyaya Sahip Proje: $most_files_name ($most_files_count dosya)"

# En yeni proje
newest_project=$(sort -t '|' -k4 -rn "$TEMP_FILE" | head -1)
newest_name=$(echo "$newest_project" | cut -d'|' -f1)
newest_date=$(echo "$newest_project" | cut -d'|' -f4)
if [ "$newest_date" -gt 0 ]; then
    formatted_newest_date=$(date -r "$newest_date" "+%Y-%m-%d %H:%M" 2>/dev/null)
    echo "En Son Değiştirilen Proje: $newest_name ($formatted_newest_date)"
else
    echo "En Son Değiştirilen Proje: Belirlenemedi"
fi

# Detaylı istatistikler istenirse ek özet bilgileri göster
if [ "$DETAIL_LEVEL" == "detailed" ]; then
    echo
    echo "Dosya Türü İstatistikleri:"

    # PHP dosyaları toplam
    php_total=$(awk -F'|' '{total += $5} END {print total}' "$TEMP_FILE")
    echo "  * PHP Dosyaları: $php_total"

    # JavaScript dosyaları toplam
    js_total=$(awk -F'|' '{total += $6} END {print total}' "$TEMP_FILE")
    echo "  * JavaScript Dosyaları: $js_total"

    # Vue dosyaları toplam
    vue_total=$(awk -F'|' '{total += $7} END {print total}' "$TEMP_FILE")
    echo "  * Vue Dosyaları: $vue_total"

    # CSS/SCSS dosyaları toplam
    css_total=$(awk -F'|' '{total += $8} END {print total}' "$TEMP_FILE")
    echo "  * CSS/SCSS Dosyaları: $css_total"

    # Resim dosyaları toplam
    img_total=$(awk -F'|' '{total += $9} END {print total}' "$TEMP_FILE")
    echo "  * Resim Dosyaları: $img_total"
fi

# Geçici dosyayı temizle
rm -f "$TEMP_FILE"

echo
echo "Rapor oluşturulma tarihi: $(date)"
echo
