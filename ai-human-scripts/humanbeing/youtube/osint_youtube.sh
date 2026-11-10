#!/bin/bash

# YouTube OSINT Aracı
# Gereksinimler: jq, curl, python3

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# API anahtarını kontrol et
if [ -z "$YOUTUBE_API_KEY" ]; then
    echo -e "${RED}Error: YOUTUBE_API_KEY ortam değişkeni tanımlanmamış${NC}"
    exit 1
fi

# Gerekli araçların kontrolü
check_requirements() {
    command -v jq >/dev/null 2>&1 || { echo -e "${RED}Error: jq gerekli${NC}" >&2; exit 1; }
    command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl gerekli${NC}" >&2; exit 1; }
}

# Kanal bilgilerini al
get_channel_info() {
    local channel_id=$1
    local output_dir=$2

    echo -e "${GREEN}Kanal bilgileri alınıyor...${NC}"
    curl -s "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channel_id}&key=${YOUTUBE_API_KEY}" \
        > "${output_dir}/channel_info.json"
}

# Kanal videolarını al
get_channel_videos() {
    local channel_id=$1
    local output_dir=$2
    local next_page_token=""
    local video_ids=()

    echo -e "${GREEN}Kanal videoları alınıyor...${NC}"

    while true; do
        local url="https://www.googleapis.com/youtube/v3/search?part=id&channelId=${channel_id}&maxResults=50&type=video&key=${YOUTUBE_API_KEY}"
        if [ ! -z "$next_page_token" ]; then
            url="${url}&pageToken=${next_page_token}"
        fi

        local response=$(curl -s "$url")
        local videos=$(echo "$response" | jq -r '.items[].id.videoId')
        video_ids+=($videos)

        next_page_token=$(echo "$response" | jq -r '.nextPageToken')
        if [ "$next_page_token" == "null" ]; then
            break
        fi
    done

    printf "%s\n" "${video_ids[@]}" > "${output_dir}/video_ids.txt"
}

# Video detaylarını al
get_video_details() {
    local output_dir=$1
    local video_ids_file="${output_dir}/video_ids.txt"
    local batch_size=50
    local total_videos=$(wc -l < "$video_ids_file")
    local current=0

    echo -e "${GREEN}Video detayları alınıyor...${NC}"

    while read -r -d '\n' -a batch_ids; do
        local ids=$(IFS=,; echo "${batch_ids[*]}")
        curl -s "https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${ids}&key=${YOUTUBE_API_KEY}" \
            >> "${output_dir}/video_details.json"

        current=$((current + ${#batch_ids[@]}))
        echo -e "${YELLOW}İlerleme: $current / $total_videos${NC}"
    done < <(xargs -n $batch_size < "$video_ids_file")
}

# Yorum analizini başlat
analyze_comments() {
    local output_dir=$1
    local video_ids_file="${output_dir}/video_ids.txt"

    echo -e "${GREEN}Yorumlar analiz ediliyor...${NC}"
    while read -r video_id; do
        python3 comment_analyzer.py "$video_id" "${output_dir}/comments"
    done < "$video_ids_file"
}

# Thumbnail analizini başlat
analyze_thumbnails() {
    local output_dir=$1
    local video_ids_file="${output_dir}/video_ids.txt"

    echo -e "${GREEN}Thumbnaillar analiz ediliyor...${NC}"
    while read -r video_id; do
        ./thumbnail_analyzer.sh "$video_id"
    done < "$video_ids_file"
}

# Markdown raporu oluştur
generate_report() {
    local channel_id=$1
    local output_dir=$2
    local report_file="${output_dir}/osint_report.md"

    echo -e "${GREEN}OSINT raporu oluşturuluyor...${NC}"

    {
        echo "# YouTube Kanal OSINT Raporu"
        echo "Kanal ID: $channel_id"
        echo "Oluşturulma Tarihi: $(date)"
        echo
        echo "## Kanal Bilgileri"
        jq -r '.items[0] | {title: .snippet.title, description: .snippet.description, publishedAt: .snippet.publishedAt, country: .snippet.country, viewCount: .statistics.viewCount, subscriberCount: .statistics.subscriberCount, videoCount: .statistics.videoCount}' \
            "${output_dir}/channel_info.json"
        echo
        echo "## Video İstatistikleri"
        jq -r '.items[] | {title: .snippet.title, publishedAt: .snippet.publishedAt, viewCount: .statistics.viewCount, likeCount: .statistics.likeCount, commentCount: .statistics.commentCount}' \
            "${output_dir}/video_details.json"
        echo
        echo "## Yorum Analizi"
        find "${output_dir}/comments" -name "*.json" -exec cat {} \;
        echo
        echo "## Thumbnail Analizi"
        find "generates/youtube/thumbnails" -name "thumbnail_report.md" -exec cat {} \;
    } > "$report_file"
}

main() {
    check_requirements

    if [ -z "$1" ]; then
        echo -e "${RED}Kullanım: $0 <channel_id>${NC}"
        exit 1
    fi

    local channel_id=$1
    local output_dir="generates/youtube/channels/${channel_id}_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$output_dir/comments"

    get_channel_info "$channel_id" "$output_dir"
    get_channel_videos "$channel_id" "$output_dir"
    get_video_details "$output_dir"
    analyze_comments "$output_dir"
    analyze_thumbnails "$output_dir"
    generate_report "$channel_id" "$output_dir"

    echo -e "${GREEN}Analiz tamamlandı. Rapor: ${output_dir}/osint_report.md${NC}"
}

main "$@"
