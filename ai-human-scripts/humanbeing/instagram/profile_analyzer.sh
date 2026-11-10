#!/bin/bash

# Instagram Profil Analiz Aracı
# Gereksinimler: jq, curl, python3

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Gerekli araçların kontrolü
check_requirements() {
    command -v jq >/dev/null 2>&1 || { echo -e "${RED}Error: jq gerekli${NC}" >&2; exit 1; }
    command -v curl >/dev/null 2>&1 || { echo -e "${RED}Error: curl gerekli${NC}" >&2; exit 1; }
    command -v python3 >/dev/null 2>&1 || { echo -e "${RED}Error: python3 gerekli${NC}" >&2; exit 1; }
}

# Instagram oturum çerezi kontrolü
check_session() {
    if [ -z "$INSTAGRAM_COOKIE" ]; then
        echo -e "${RED}Error: INSTAGRAM_COOKIE ortam değişkeni tanımlanmamış${NC}"
        exit 1
    fi
}

# Profil bilgilerini al
get_profile_info() {
    local username=$1
    local output_dir=$2

    echo -e "${GREEN}Profil bilgileri alınıyor...${NC}"
    curl -s -A "Mozilla/5.0" -b "$INSTAGRAM_COOKIE" \
        "https://www.instagram.com/$username/?__a=1" \
        > "${output_dir}/profile_info.json"

    if ! jq -e . "${output_dir}/profile_info.json" >/dev/null 2>&1; then
        echo -e "${RED}Error: Profil bilgileri alınamadı${NC}"
        exit 1
    fi
}

# Gönderi listesini al
get_posts() {
    local username=$1
    local output_dir=$2

    echo -e "${GREEN}Gönderiler alınıyor...${NC}"
    python3 post_analyzer.py --mode list --username "$username" \
        --output "${output_dir}/posts.json"
}

# Takipçi analizini yap
analyze_followers() {
    local username=$1
    local output_dir=$2

    echo -e "${GREEN}Takipçi analizi yapılıyor...${NC}"
    python3 network_analyzer.py --mode followers --username "$username" \
        --output "${output_dir}/followers_analysis.json"
}

# Medya analizini başlat
analyze_media() {
    local output_dir=$1
    local posts_file="${output_dir}/posts.json"

    echo -e "${GREEN}Medya analizi yapılıyor...${NC}"
    jq -r '.posts[].media_url' "$posts_file" | while read -r url; do
        ./media_analyzer.sh "$url" "${output_dir}/media"
    done
}

# Hikaye analizini başlat
analyze_stories() {
    local username=$1
    local output_dir=$2

    echo -e "${GREEN}Hikayeler analiz ediliyor...${NC}"
    python3 story_analyzer.py "$username" "${output_dir}/stories"
}

# Etkileşim analizi
analyze_engagement() {
    local output_dir=$1
    local posts_file="${output_dir}/posts.json"
    local profile_file="${output_dir}/profile_info.json"

    echo -e "${GREEN}Etkileşim analizi yapılıyor...${NC}"
    python3 - <<EOF
import json
import pandas as pd
from datetime import datetime

# Gönderi verilerini oku
with open('${posts_file}') as f:
    posts = json.load(f)['posts']

# Profil verilerini oku
with open('${profile_file}') as f:
    profile = json.load(f)

# Etkileşim metriklerini hesapla
df = pd.DataFrame(posts)
metrics = {
    'total_posts': len(posts),
    'total_likes': df['likes'].sum(),
    'total_comments': df['comments'].sum(),
    'avg_likes_per_post': df['likes'].mean(),
    'avg_comments_per_post': df['comments'].mean(),
    'engagement_rate': (df['likes'].sum() + df['comments'].sum()) /
                      (len(posts) * profile['follower_count']) * 100,
    'posting_frequency': {
        'hour': df.groupby(pd.to_datetime(df['timestamp']).dt.hour)['id'].count().to_dict(),
        'day': df.groupby(pd.to_datetime(df['timestamp']).dt.day_name())['id'].count().to_dict()
    }
}

# Sonuçları kaydet
with open('${output_dir}/engagement_analysis.json', 'w') as f:
    json.dump(metrics, f, indent=2)
EOF
}

# Markdown raporu oluştur
generate_report() {
    local username=$1
    local output_dir=$2
    local report_file="${output_dir}/profile_report.md"

    echo -e "${GREEN}OSINT raporu oluşturuluyor...${NC}"

    {
        echo "# Instagram Profil OSINT Raporu"
        echo "Kullanıcı: $username"
        echo "Oluşturulma Tarihi: $(date)"
        echo
        echo "## Profil Bilgileri"
        jq -r '.user | {username, full_name, biography, external_url, is_private, is_verified, follower_count, following_count, media_count}' \
            "${output_dir}/profile_info.json"
        echo
        echo "## Gönderi İstatistikleri"
        jq -r '.posts | map({type, caption, likes, comments, location, hashtags})' \
            "${output_dir}/posts.json"
        echo
        echo "## Etkileşim Analizi"
        cat "${output_dir}/engagement_analysis.json"
        echo
        echo "## Takipçi Analizi"
        cat "${output_dir}/followers_analysis.json"
        echo
        echo "## Medya Analizi"
        find "${output_dir}/media" -name "analysis.json" -exec cat {} \;
        echo
        echo "## Hikaye Analizi"
        find "${output_dir}/stories" -name "*.json" -exec cat {} \;
    } > "$report_file"
}

main() {
    check_requirements
    check_session

    if [ -z "$1" ]; then
        echo -e "${RED}Kullanım: $0 <username>${NC}"
        exit 1
    fi

    local username=$1
    local output_dir="generates/instagram/profiles/${username}_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$output_dir"/{media,stories}

    get_profile_info "$username" "$output_dir"
    get_posts "$username" "$output_dir"
    analyze_followers "$username" "$output_dir"
    analyze_media "$output_dir"
    analyze_stories "$username" "$output_dir"
    analyze_engagement "$output_dir"
    generate_report "$username" "$output_dir"

    echo -e "${GREEN}Analiz tamamlandı. Rapor: ${output_dir}/profile_report.md${NC}"
}

main "$@"
