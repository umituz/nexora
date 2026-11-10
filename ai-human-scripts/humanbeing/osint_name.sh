#!/bin/bash

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Gerekli araçların kontrolü
command -v curl >/dev/null 2>&1 || { echo -e "${RED}[-] curl gerekli${NC}" >&2; exit 1; }

# Kullanım kontrolü
if [ $# -ne 2 ]; then
    echo -e "${RED}Kullanım: $0 <ad> <soyad>${NC}"
    echo -e "${YELLOW}Örnek: $0 John Doe${NC}"
    exit 1
fi

FIRSTNAME=$1
LASTNAME=$2
FULLNAME="$FIRSTNAME $LASTNAME"
FULLNAME_LOWER=$(echo "$FULLNAME" | tr '[:upper:]' '[:lower:]')
NAME_SLUG="${FULLNAME_LOWER// /_}"

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BASE_DIR="generates"
NAME_DIR="${BASE_DIR}/${NAME_SLUG}"
REPORT_MD="${NAME_DIR}/${DATE}_osint_report.md"

# Dizin yapısını oluştur
mkdir -p "$NAME_DIR"

echo -e "${GREEN}[+] $FULLNAME için OSINT araştırması başlatılıyor...${NC}\n"

# Markdown rapor başlığı
{
    echo "# OSINT Araştırma Raporu"
    echo "## $FULLNAME"
    echo "### $(date '+%d %B %Y, %H:%M')"
    echo ""
    echo "## 1. Profesyonel Profiller"
    echo ""
} > "$REPORT_MD"

# Profesyonel platformlar
PROF_PLATFORMS=(
    "https://linkedin.com/in/$NAME_SLUG"
    "https://github.com/$NAME_SLUG"
    "https://medium.com/@$NAME_SLUG"
    "https://dev.to/$NAME_SLUG"
    "https://scholar.google.com/citations?user=$NAME_SLUG"
    "https://www.researchgate.net/profile/$NAME_SLUG"
)

for platform in "${PROF_PLATFORMS[@]}"; do
    response=$(curl -s -I "$platform" | grep "HTTP" | awk '{print $2}')
    if [ "$response" == "200" ]; then
        echo "- ✅ $platform" >> "$REPORT_MD"
        echo -e "${GREEN}[+] Bulundu: $platform${NC}"
    fi
done

# Sosyal medya kontrolleri
echo -e "\n${YELLOW}[*] Sosyal medya hesapları aranıyor...${NC}"
{
    echo ""
    echo "## 2. Sosyal Medya Profilleri"
    echo ""
} >> "$REPORT_MD"

SOCIAL_PLATFORMS=(
    "https://twitter.com/$NAME_SLUG"
    "https://instagram.com/$NAME_SLUG"
    "https://facebook.com/${FULLNAME_LOWER// /.}"
)

for platform in "${SOCIAL_PLATFORMS[@]}"; do
    response=$(curl -s -I "$platform" | grep "HTTP" | awk '{print $2}')
    if [ "$response" == "200" ]; then
        echo "- ✅ $platform" >> "$REPORT_MD"
        echo -e "${GREEN}[+] Bulundu: $platform${NC}"
    fi
done

# Arama önerileri
echo -e "\n${YELLOW}[*] Arama önerileri hazırlanıyor...${NC}"
{
    echo ""
    echo "## 3. Arama Önerileri"
    echo ""
    echo "### 3.1 Temel Aramalar"
    echo "- \`\"$FULLNAME\"\` (tam isim)"
    echo "- \`\"$FIRSTNAME $LASTNAME\" filetype:pdf\` (dokümanlar)"
    echo "- \`\"$FULLNAME\" (linkedin OR github OR twitter)\` (sosyal profiller)"
    echo ""
    echo "### 3.2 Profesyonel Aramalar"
    echo "- \`\"$FULLNAME\" (cv OR resume OR curriculum vitae)\` (özgeçmiş)"
    echo "- \`\"$FULLNAME\" (conference OR paper OR research)\` (akademik)"
    echo "- \`\"$FULLNAME\" (company OR organization OR workplace)\` (iş yeri)"
    echo ""
    echo "### 3.3 Haber ve Medya"
    echo "- \`\"$FULLNAME\" (news OR article OR interview)\` (haberler)"
    echo "- \`\"$FULLNAME\" (blog OR website OR portfolio)\` (kişisel siteler)"
    echo "- \`\"$FULLNAME\" (youtube OR video OR podcast)\` (medya)"
    echo ""
} >> "$REPORT_MD"

echo -e "${GREEN}[+] Rapor oluşturuldu: $REPORT_MD${NC}"

# Raporu göster
echo -e "\n${YELLOW}[?] Raporu görüntülemek ister misiniz? (E/h)${NC}"
read -r SHOW_REPORT
if [[ $SHOW_REPORT =~ ^[Ee]$ ]] || [[ -z $SHOW_REPORT ]]; then
    less "$REPORT_MD"
fi
