#!/bin/bash

# Instagram Medya Analiz Aracı
# Gereksinimler: exiftool, imagemagick, tesseract-ocr, ffmpeg, python3

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Gerekli araçların kontrolü
check_requirements() {
    command -v exiftool >/dev/null 2>&1 || { echo -e "${RED}Error: exiftool gerekli${NC}" >&2; exit 1; }
    command -v convert >/dev/null 2>&1 || { echo -e "${RED}Error: imagemagick gerekli${NC}" >&2; exit 1; }
    command -v tesseract >/dev/null 2>&1 || { echo -e "${RED}Error: tesseract-ocr gerekli${NC}" >&2; exit 1; }
    command -v ffmpeg >/dev/null 2>&1 || { echo -e "${RED}Error: ffmpeg gerekli${NC}" >&2; exit 1; }
    command -v python3 >/dev/null 2>&1 || { echo -e "${RED}Error: python3 gerekli${NC}" >&2; exit 1; }
}

# Medya dosyasını indir
download_media() {
    local url=$1
    local output_dir=$2
    local output_file="${output_dir}/media"

    echo -e "${GREEN}Medya indiriliyor...${NC}"

    # Dosya uzantısını belirle
    if [[ $url == *".mp4"* ]]; then
        output_file="${output_file}.mp4"
        curl -s "$url" -o "$output_file"
    else
        output_file="${output_file}.jpg"
        curl -s "$url" -o "$output_file"
    fi

    if [ ! -f "$output_file" ]; then
        echo -e "${RED}Medya indirilemedi${NC}"
        exit 1
    fi

    echo "$output_file"
}

# EXIF analizi
analyze_exif() {
    local file=$1
    local output_dir=$2

    echo -e "${GREEN}EXIF verileri analiz ediliyor...${NC}"
    exiftool -json "$file" > "${output_dir}/exif.json"
}

# Görsel analiz
analyze_image() {
    local file=$1
    local output_dir=$2

    echo -e "${GREEN}Görsel analiz yapılıyor...${NC}"

    # Renk paleti analizi
    convert "$file" -colors 5 -unique-colors txt:- | tail -n +2 > "${output_dir}/colors.txt"

    # Histogram analizi
    convert "$file" -format %c histogram:info:- > "${output_dir}/histogram.txt"

    # Görsel kalite analizi
    identify -verbose "$file" | grep -E "Quality|Resolution|Compression|Format" > "${output_dir}/quality.txt"
}

# OCR analizi
analyze_text() {
    local file=$1
    local output_dir=$2

    echo -e "${GREEN}Metin analizi yapılıyor...${NC}"
    tesseract "$file" "${output_dir}/text" 2>/dev/null
}

# Yüz analizi
analyze_faces() {
    local file=$1
    local output_dir=$2

    echo -e "${GREEN}Yüz analizi yapılıyor...${NC}"

    python3 - <<EOF
import face_recognition
import json

image = face_recognition.load_image_file("${file}")
face_locations = face_recognition.face_locations(image)
face_landmarks = face_recognition.face_landmarks(image)

result = {
    'face_count': len(face_locations),
    'face_locations': face_locations,
    'landmarks_count': len(face_landmarks),
    'facial_features': {
        'eyes': sum(1 for landmark in face_landmarks if 'eye' in str(landmark)),
        'nose': sum(1 for landmark in face_landmarks if 'nose' in str(landmark)),
        'mouth': sum(1 for landmark in face_landmarks if 'mouth' in str(landmark))
    }
}

with open("${output_dir}/faces.json", "w") as f:
    json.dump(result, f, indent=2)
EOF
}

# Nesne tespiti
analyze_objects() {
    local file=$1
    local output_dir=$2

    echo -e "${GREEN}Nesneler tespit ediliyor...${NC}"
    python3 object_detector.py "$file" "${output_dir}/objects.json"
}

# Video analizi
analyze_video() {
    local file=$1
    local output_dir=$2

    echo -e "${GREEN}Video analizi yapılıyor...${NC}"

    # Video metadata
    ffprobe -v quiet -print_format json -show_format -show_streams "$file" > "${output_dir}/video_info.json"

    # Thumbnail çıkar
    ffmpeg -i "$file" -ss 00:00:01 -vframes 1 "${output_dir}/thumbnail.jpg" 2>/dev/null

    # Thumbnail analizi
    analyze_image "${output_dir}/thumbnail.jpg" "$output_dir"
    analyze_faces "${output_dir}/thumbnail.jpg" "$output_dir"
    analyze_objects "${output_dir}/thumbnail.jpg" "$output_dir"
}

# Analiz raporu oluştur
generate_report() {
    local media_type=$1
    local output_dir=$2
    local report_file="${output_dir}/analysis.json"

    echo -e "${GREEN}Analiz raporu oluşturuluyor...${NC}"

    {
        echo "{"
        echo "  \"timestamp\": \"$(date -u +"%Y-%m-%dT%H:%M:%SZ")\","
        echo "  \"media_type\": \"$media_type\","

        if [ -f "${output_dir}/exif.json" ]; then
            echo "  \"exif_data\": $(cat "${output_dir}/exif.json"),"
        fi

        if [ -f "${output_dir}/colors.txt" ]; then
            echo "  \"color_palette\": $(cat "${output_dir}/colors.txt" | jq -R -s -c 'split("\n")'),"
        fi

        if [ -f "${output_dir}/text.txt" ]; then
            echo "  \"detected_text\": $(cat "${output_dir}/text.txt" | jq -R -s),"
        fi

        if [ -f "${output_dir}/faces.json" ]; then
            echo "  \"face_analysis\": $(cat "${output_dir}/faces.json"),"
        fi

        if [ -f "${output_dir}/objects.json" ]; then
            echo "  \"object_detection\": $(cat "${output_dir}/objects.json"),"
        fi

        if [ -f "${output_dir}/video_info.json" ]; then
            echo "  \"video_metadata\": $(cat "${output_dir}/video_info.json"),"
        fi

        echo "  \"analysis_complete\": true"
        echo "}"
    } | jq '.' > "$report_file"
}

main() {
    check_requirements

    if [ -z "$1" ] || [ -z "$2" ]; then
        echo -e "${RED}Kullanım: $0 <media_url> <output_dir>${NC}"
        exit 1
    fi

    local media_url=$1
    local output_dir=$2
    mkdir -p "$output_dir"

    local media_file=$(download_media "$media_url" "$output_dir")
    local media_type=$(file -b --mime-type "$media_file")

    analyze_exif "$media_file" "$output_dir"

    if [[ $media_type == image/* ]]; then
        analyze_image "$media_file" "$output_dir"
        analyze_text "$media_file" "$output_dir"
        analyze_faces "$media_file" "$output_dir"
        analyze_objects "$media_file" "$output_dir"
        generate_report "image" "$output_dir"
    elif [[ $media_type == video/* ]]; then
        analyze_video "$media_file" "$output_dir"
        generate_report "video" "$output_dir"
    else
        echo -e "${RED}Desteklenmeyen medya tipi: $media_type${NC}"
        exit 1
    fi

    echo -e "${GREEN}Analiz tamamlandı. Rapor: ${output_dir}/analysis.json${NC}"
}

main "$@"
