#!/bin/bash

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Semboller
CHECK_MARK="✅"
CROSS_MARK="❌"
QUESTION_MARK="❓"
WARNING_MARK="⚠️"

# Gerekli araçların kontrolü
command -v curl >/dev/null 2>&1 || { echo -e "${RED}[-] curl gerekli${NC}" >&2; exit 1; }

# Kullanım kontrolü
if [ $# -ne 2 ]; then
    echo -e "${RED}Kullanım: $0 <ad> <soyad>${NC}"
    echo -e "${YELLOW}Örnek: $0 Zehra Yılmaz${NC}"
    exit 1
fi

FIRSTNAME=$1
LASTNAME=$2
FULLNAME="$FIRSTNAME $LASTNAME"
FULLNAME_LOWER=$(echo "$FULLNAME" | tr '[:upper:]' '[:lower:]')
NAME_SLUG="${FULLNAME_LOWER// /_}"
NAME_DOT="${FULLNAME_LOWER// /.}"

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BASE_DIR="generates/social_media"
REPORT_DIR="${BASE_DIR}/${NAME_SLUG}"
REPORT_HTML="${REPORT_DIR}/${DATE}_social_report.html"
REPORT_MD="${REPORT_DIR}/${DATE}_social_report.md"

# Dizin yapısını oluştur
mkdir -p "$REPORT_DIR"

echo -e "${GREEN}[+] $FULLNAME için sosyal medya araştırması başlatılıyor...${NC}\n"

# HTML rapor başlığı
cat > "$REPORT_HTML" << EOF
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sosyal Medya Raporu - $FULLNAME</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
        }
        .platform-card {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            display: flex;
            align-items: center;
            transition: transform 0.2s;
        }
        .platform-card:hover {
            transform: translateX(10px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .platform-icon {
            width: 40px;
            height: 40px;
            margin-right: 15px;
        }
        .platform-info {
            flex-grow: 1;
        }
        .status {
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 3px;
        }
        .status-found {
            color: #27ae60;
            background-color: #eafaf1;
        }
        .status-not-found {
            color: #c0392b;
            background-color: #fdedec;
        }
        .status-unknown {
            color: #f39c12;
            background-color: #fef9e7;
        }
        .search-variations {
            color: #7f8c8d;
            font-size: 0.9em;
            margin-top: 5px;
        }
        .timestamp {
            color: #95a5a6;
            font-size: 0.8em;
            text-align: right;
            margin-top: 20px;
        }
        .suggestions {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #3498db;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Sosyal Medya Raporu</h1>
        <h2>👤 $FULLNAME</h2>
        <div class="suggestions">
            <h3>🎯 Arama Varyasyonları</h3>
            <ul>
                <li>Tam Ad: $FULLNAME</li>
                <li>Noktalı: $NAME_DOT</li>
                <li>Alt Çizgili: $NAME_SLUG</li>
            </ul>
        </div>
        <div id="platforms">
EOF

# Markdown rapor başlığı
{
    echo "# 🔍 Sosyal Medya Raporu"
    echo "## 👤 $FULLNAME"
    echo "### $(date '+%d %B %Y, %H:%M')"
    echo ""
    echo "## 🎯 Arama Varyasyonları"
    echo "- Tam Ad: $FULLNAME"
    echo "- Noktalı: $NAME_DOT"
    echo "- Alt Çizgili: $NAME_SLUG"
    echo ""
} > "$REPORT_MD"

# Sosyal medya platformları ve kontrol fonksiyonu
check_social_media() {
    local platform=$1
    local url=$2
    local icon=$3

    echo -e "${YELLOW}[*] $platform kontrol ediliyor...${NC}"

    local response=$(curl -s -I "$url" | grep "HTTP" | awk '{print $2}')
    local status_html=""
    local status_md=""

    if [ "$response" == "200" ]; then
        status_html="<span class='status status-found'>$CHECK_MARK Bulundu</span>"
        status_md="$CHECK_MARK Bulundu"
        echo -e "${GREEN}[+] $platform hesabı bulundu: $url${NC}"
    elif [ "$response" == "404" ]; then
        status_html="<span class='status status-not-found'>$CROSS_MARK Bulunamadı</span>"
        status_md="$CROSS_MARK Bulunamadı"
        echo -e "${RED}[-] $platform hesabı bulunamadı${NC}"
    else
        status_html="<span class='status status-unknown'>$QUESTION_MARK Belirsiz</span>"
        status_md="$QUESTION_MARK Belirsiz"
        echo -e "${YELLOW}[?] $platform durumu belirsiz${NC}"
    fi

    # HTML'e ekle
    cat >> "$REPORT_HTML" << EOF
        <div class="platform-card">
            <img src="$icon" alt="$platform" class="platform-icon">
            <div class="platform-info">
                <h3>$platform</h3>
                <p><a href="$url" target="_blank">$url</a></p>
                $status_html
                <div class="search-variations">
                    <small>🔍 Diğer olası profiller:</small><br>
                    <small>• ${url//$NAME_SLUG/$NAME_DOT}</small><br>
                    <small>• ${url//$NAME_SLUG/${FIRSTNAME,,}.$LASTNAME}</small>
                </div>
            </div>
        </div>
EOF

    # Markdown'a ekle
    {
        echo "### $platform"
        echo "- URL: $url"
        echo "- Durum: $status_md"
        echo "- Diğer olası profiller:"
        echo "  - ${url//$NAME_SLUG/$NAME_DOT}"
        echo "  - ${url//$NAME_SLUG/${FIRSTNAME,,}.$LASTNAME}"
        echo ""
    } >> "$REPORT_MD"
}

# Sosyal medya platformlarını kontrol et
check_social_media "LinkedIn" "https://linkedin.com/in/$NAME_SLUG" "https://cdn-icons-png.flaticon.com/512/174/174857.png"
check_social_media "Twitter" "https://twitter.com/$NAME_SLUG" "https://cdn-icons-png.flaticon.com/512/733/733579.png"
check_social_media "Instagram" "https://instagram.com/$NAME_SLUG" "https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
check_social_media "Facebook" "https://facebook.com/$NAME_DOT" "https://cdn-icons-png.flaticon.com/512/174/174848.png"
check_social_media "GitHub" "https://github.com/$NAME_SLUG" "https://cdn-icons-png.flaticon.com/512/733/733553.png"
check_social_media "Medium" "https://medium.com/@$NAME_SLUG" "https://cdn-icons-png.flaticon.com/512/5968/5968933.png"
check_social_media "YouTube" "https://youtube.com/@$NAME_SLUG" "https://cdn-icons-png.flaticon.com/512/1384/1384060.png"
check_social_media "TikTok" "https://tiktok.com/@$NAME_SLUG" "https://cdn-icons-png.flaticon.com/512/3046/3046121.png"

# HTML raporunu tamamla
cat >> "$REPORT_HTML" << EOF
        </div>
        <div class="timestamp">
            <p>Rapor oluşturulma tarihi: $(date '+%d %B %Y, %H:%M')</p>
        </div>
    </div>
</body>
</html>
EOF

echo -e "\n${GREEN}[+] Raporlar oluşturuldu:${NC}"
echo -e "${BLUE}HTML: $REPORT_HTML${NC}"
echo -e "${BLUE}Markdown: $REPORT_MD${NC}"

# Raporu göster
echo -e "\n${YELLOW}[?] Raporu görüntülemek ister misiniz? (E/h)${NC}"
read -r SHOW_REPORT
if [[ $SHOW_REPORT =~ ^[Ee]$ ]] || [[ -z $SHOW_REPORT ]]; then
    if command -v open >/dev/null 2>&1; then
        open "$REPORT_HTML"
    else
        xdg-open "$REPORT_HTML"
    fi
fi
