#!/bin/bash

# YouTube Thumbnail Analiz Aracı
# Gereksinimler: tesseract-ocr, imagemagick, face_recognition, python3, torch, transformers

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Gerekli araçların kontrolü
check_requirements() {
    command -v convert >/dev/null 2>&1 || { echo -e "${RED}Error: imagemagick gerekli${NC}" >&2; exit 1; }
    command -v tesseract >/dev/null 2>&1 || { echo -e "${RED}Error: tesseract-ocr gerekli${NC}" >&2; exit 1; }
    python3 -c "import face_recognition" 2>/dev/null || { echo -e "${RED}Error: face_recognition python paketi gerekli${NC}" >&2; exit 1; }
}

# Thumbnail URL'sini oluştur
get_thumbnail_url() {
    local video_id=$1
    echo "https://img.youtube.com/vi/${video_id}/maxresdefault.jpg"
}

# Thumbnail'i indir
download_thumbnail() {
    local url=$1
    local output_dir=$2
    local output_file="${output_dir}/thumbnail.jpg"

    echo -e "${GREEN}Thumbnail indiriliyor...${NC}"
    curl -s "$url" -o "$output_file"

    if [ ! -f "$output_file" ]; then
        echo -e "${RED}Thumbnail indirilemedi${NC}"
        exit 1
    fi
}

# OCR analizi
analyze_text() {
    local output_dir=$1
    local image="${output_dir}/thumbnail.jpg"

    echo -e "${GREEN}Metinler analiz ediliyor...${NC}"
    tesseract "$image" "${output_dir}/text" 2>/dev/null
}

# Renk analizi
analyze_colors() {
    local output_dir=$1
    local image="${output_dir}/thumbnail.jpg"

    echo -e "${GREEN}Renk paleti analiz ediliyor...${NC}"
    convert "$image" -colors 5 -unique-colors txt:- | tail -n +2 > "${output_dir}/colors.txt"
}

# Yüz analizi
analyze_faces() {
    local output_dir=$1
    local image="${output_dir}/thumbnail.jpg"

    echo -e "${GREEN}Yüz analizi yapılıyor...${NC}"

    python3 - <<EOF
import face_recognition
import json

image = face_recognition.load_image_file("${image}")
face_locations = face_recognition.face_locations(image)
face_landmarks = face_recognition.face_landmarks(image)

result = {
    "face_count": len(face_locations),
    "face_locations": face_locations,
    "landmarks_count": len(face_landmarks)
}

with open("${output_dir}/faces.json", "w") as f:
    json.dump(result, f, indent=2)
EOF
}

# Nesne tespiti
analyze_objects() {
    local output_dir=$1
    local image="${output_dir}/thumbnail.jpg"

    echo -e "${GREEN}Nesneler tespit ediliyor...${NC}"
    python3 object_detector.py "$image" "${output_dir}/objects.json"
}

# Markdown raporu oluştur
generate_report() {
    local output_dir=$1
    local report_file="${output_dir}/thumbnail_report.md"

    echo -e "${GREEN}Rapor oluşturuluyor...${NC}"

    {
        echo "# Thumbnail Analiz Raporu"
        echo "Oluşturulma Tarihi: $(date)"
        echo
        echo "## Tespit Edilen Metinler"
        cat "${output_dir}/text.txt"
        echo
        echo "## Renk Paleti"
        echo "\`\`\`"
        cat "${output_dir}/colors.txt"
        echo "\`\`\`"
        echo
        echo "## Yüz Analizi"
        echo "\`\`\`json"
        cat "${output_dir}/faces.json"
        echo "\`\`\`"
        echo
        echo "## Tespit Edilen Nesneler"
        echo "\`\`\`json"
        cat "${output_dir}/objects.json"
        echo "\`\`\`"
    } > "$report_file"
}

main() {
    check_requirements

    if [ -z "$1" ]; then
        echo -e "${RED}Kullanım: $0 <video_id>${NC}"
        exit 1
    fi

    local video_id=$1
    local output_dir="generates/youtube/thumbnails/${video_id}_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$output_dir"

    local thumbnail_url=$(get_thumbnail_url "$video_id")
    download_thumbnail "$thumbnail_url" "$output_dir"

    analyze_text "$output_dir"
    analyze_colors "$output_dir"
    analyze_faces "$output_dir"
    analyze_objects "$output_dir"
    generate_report "$output_dir"

    echo -e "${GREEN}Analiz tamamlandı. Rapor: ${output_dir}/thumbnail_report.md${NC}"
}

main "$@"
