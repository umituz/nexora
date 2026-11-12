#!/bin/bash

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Gerekli araçların kontrolü
command -v curl >/dev/null 2>&1 || { echo -e "${RED}[-] curl gerekli${NC}" >&2; exit 1; }

# Kullanım kontrolü
if [ $# -ne 3 ]; then
    echo -e "${RED}Kullanım: $0 <email@address.com> <ad> <soyad>${NC}"
    echo -e "${YELLOW}Örnek: $0 john.doe@example.com John Doe${NC}"
    exit 1
fi

EMAIL=$1
FIRSTNAME=$2
LASTNAME=$3
FULLNAME="$FIRSTNAME $LASTNAME"
FULLNAME_LOWER=$(echo "$FULLNAME" | tr '[:upper:]' '[:lower:]')

# E-posta kullanıcı adını düzenle
EMAIL_USERNAME=$(echo $EMAIL | cut -d@ -f1)
EMAIL_USERNAME_CLEAN=$(echo $EMAIL_USERNAME | tr '.' '_')

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BASE_DIR="generates"
EMAIL_DIR="${BASE_DIR}/${EMAIL_USERNAME_CLEAN}"
REPORT_MD="${EMAIL_DIR}/${DATE}_osint_report.md"
PASSWORD_FILE="${EMAIL_DIR}/${DATE}_potential_passwords.txt"
TEMP_FILE="${EMAIL_DIR}/${DATE}_temp_passwords.txt"

# Dizin yapısını oluştur
mkdir -p "$EMAIL_DIR"

echo -e "${GREEN}[+] $FULLNAME ($EMAIL) için OSINT araştırması başlatılıyor...${NC}\n"

# Markdown rapor başlığı
{
    echo "# OSINT Araştırma Raporu"
    echo "## $FULLNAME ($EMAIL)"
    echo "### $(date '+%d %B %Y, %H:%M')"
    echo ""
    echo "## 1. Temel Bilgiler"
    echo "- İsim: $FULLNAME"
    echo "- E-posta: $EMAIL"
    echo "- Kullanıcı adı: $EMAIL_USERNAME"
    echo ""
} > "$REPORT_MD"

# Şifre tahminleme
echo -e "${YELLOW}[*] Potansiyel şifreler oluşturuluyor...${NC}"
{
    echo "## 2. Potansiyel Şifre Analizi"
    echo ""
    echo "### 2.1 Kişisel Bilgi Bazlı Şifreler"
    echo ""

    # Kişisel bilgilerden şifre oluştur
    {
        # Temel kombinasyonlar
        echo "$FIRSTNAME$LASTNAME"
        echo "$LASTNAME$FIRSTNAME"
        echo "${FIRSTNAME}123"
        echo "${LASTNAME}123"
        echo "${FIRSTNAME}${LASTNAME}123"
        echo "${FIRSTNAME}${LASTNAME}!"
        echo "${FIRSTNAME}@${LASTNAME}"
        echo "${FIRSTNAME}.${LASTNAME}"
        echo "${FIRSTNAME}_${LASTNAME}"
        echo "${EMAIL_USERNAME}123"
        echo "${EMAIL_USERNAME}!"
        echo "${EMAIL_USERNAME}@2024"

        # Küçük harfli versiyonlar
        FIRSTNAME_LOWER=$(echo $FIRSTNAME | tr '[:upper:]' '[:lower:]')
        LASTNAME_LOWER=$(echo $LASTNAME | tr '[:upper:]' '[:lower:]')
        echo "$FIRSTNAME_LOWER$LASTNAME_LOWER"
        echo "${FIRSTNAME_LOWER}${LASTNAME_LOWER}123"
        echo "${FIRSTNAME_LOWER}${LASTNAME_LOWER}!"
        echo "${FIRSTNAME_LOWER}.${LASTNAME_LOWER}"

        # Yaygın yıl kombinasyonları
        for year in {1960..2005}; do
            echo "${FIRSTNAME_LOWER}${year}"
            echo "${LASTNAME_LOWER}${year}"
            echo "${FIRSTNAME_LOWER}${LASTNAME_LOWER}${year}"
        done

        # Özel karakter substitution
        echo "${FIRSTNAME_LOWER}${LASTNAME_LOWER}" | sed 's/a/@/g'
        echo "${FIRSTNAME_LOWER}${LASTNAME_LOWER}" | sed 's/i/1/g'
        echo "${FIRSTNAME_LOWER}${LASTNAME_LOWER}" | sed 's/o/0/g'
        echo "${FIRSTNAME_LOWER}${LASTNAME_LOWER}" | sed 's/s/\$/g'

        # Yaygın ekler
        for suffix in 123 1234 12345 111 222 333 2023 2024; do
            echo "${FIRSTNAME_LOWER}${suffix}"
            echo "${LASTNAME_LOWER}${suffix}"
            echo "${EMAIL_USERNAME}${suffix}"
        done

        # Özel karakterli versiyonlar
        for special in '!' '@' '#' '$' '*' '.' '_' '-'; do
            echo "${FIRSTNAME_LOWER}${special}${LASTNAME_LOWER}"
            echo "${EMAIL_USERNAME}${special}123"
        done
    } > "$TEMP_FILE"

    # Yaygın şifre listelerinden ekleme
    PASSWORDS_DIR="$(dirname "$0")/Passwords"

    echo -e "${YELLOW}[*] Şifre listeleri ekleniyor...${NC}"

    # Corporate şifreler
    if [ -f "${PASSWORDS_DIR}/common_corporate_passwords.lst" ]; then
        echo -e "${GREEN}[+] Kurumsal şifreler ekleniyor...${NC}"
        head -n 500 "${PASSWORDS_DIR}/common_corporate_passwords.lst" >> "$TEMP_FILE"
    fi

    # Darkweb top 1000
    if [ -f "${PASSWORDS_DIR}/darkweb2017-top1000.txt" ]; then
        echo -e "${GREEN}[+] Darkweb şifreleri ekleniyor...${NC}"
        cat "${PASSWORDS_DIR}/darkweb2017-top1000.txt" >> "$TEMP_FILE"
    fi

    # XATO Net top 1000
    if [ -f "${PASSWORDS_DIR}/xato-net-10-million-passwords-1000.txt" ]; then
        echo -e "${GREEN}[+] XATO Net şifreleri ekleniyor...${NC}"
        cat "${PASSWORDS_DIR}/xato-net-10-million-passwords-1000.txt" >> "$TEMP_FILE"
    fi

    # Default credentials
    if [ -f "${PASSWORDS_DIR}/cirt-default-passwords.txt" ]; then
        echo -e "${GREEN}[+] Default credentials ekleniyor...${NC}"
        head -n 200 "${PASSWORDS_DIR}/cirt-default-passwords.txt" >> "$TEMP_FILE"
    fi

    # Tekrar eden şifreleri temizle ve sırala
    sort -u "$TEMP_FILE" > "$PASSWORD_FILE"
    rm "$TEMP_FILE"

    # Raporda şifre istatistiklerini göster
    TOTAL_PASSWORDS=$(wc -l < "$PASSWORD_FILE")
    echo "Toplam ${TOTAL_PASSWORDS} benzersiz potansiyel şifre oluşturuldu ve ${PASSWORD_FILE} dosyasına kaydedildi."
    echo ""
    echo "### 2.2 Şifre Kaynakları"
    echo "- Kişisel bilgi kombinasyonları"
    echo "- Yaygın kurumsal şifreler"
    echo "- Darkweb 2017 top 1000"
    echo "- XATO Net top 1000"
    echo "- Default credentials"
    echo ""
    echo "### 2.3 Şifre Analizi"
    echo "- Kişisel bilgi bazlı: Ad, soyad ve e-posta kombinasyonları"
    echo "- Yıl bazlı: 1960-2005 arası doğum yılı tahminleri"
    echo "- Özel karakter substitution: @ yerine a, 1 yerine i, vb."
    echo "- Yaygın ekler: 123, !, @, #, vb."
    echo ""
} >> "$REPORT_MD"

# Haveibeenpwned API kontrolü
echo -e "${YELLOW}[*] Veri ihlallerini kontrol ediliyor...${NC}"
{
    echo "## 3. Veri İhlali Kontrolü"
    echo ""
    BREACH_DATA=$(curl -s "https://haveibeenpwned.com/api/v3/breachedaccount/$EMAIL" -H "hibp-api-key: YOUR_API_KEY")
    if [ $? -eq 0 ] && [ ! -z "$BREACH_DATA" ]; then
        echo "⚠️ **Veri ihlali tespit edildi!**"
        echo "\`\`\`json"
        echo "$BREACH_DATA"
        echo "\`\`\`"
    else
        echo "✅ Bilinen veri ihlali bulunamadı"
    fi
    echo ""
} >> "$REPORT_MD"

# Sosyal medya kontrolleri
echo -e "\n${YELLOW}[*] Sosyal medya hesapları aranıyor...${NC}"
{
    echo "## 4. Sosyal Medya Taraması"
    echo ""
} >> "$REPORT_MD"

# Profesyonel platformlar
{
    echo "### 4.1 Profesyonel Platformlar"
    echo ""
} >> "$REPORT_MD"

PROF_PLATFORMS=(
    "https://github.com/$EMAIL_USERNAME"
    "https://linkedin.com/in/$EMAIL_USERNAME"
    "https://linkedin.com/in/${FULLNAME_LOWER// /-}"
    "https://medium.com/@$EMAIL_USERNAME"
    "https://dev.to/$EMAIL_USERNAME"
)

for platform in "${PROF_PLATFORMS[@]}"; do
    response=$(curl -s -I "$platform" | grep "HTTP" | awk '{print $2}')
    if [ "$response" == "200" ]; then
        echo "- ✅ $platform" >> "$REPORT_MD"
        echo -e "${GREEN}[+] Bulundu: $platform${NC}"
    fi
done

# Sosyal platformlar
{
    echo ""
    echo "### 4.2 Sosyal Platformlar"
    echo ""
} >> "$REPORT_MD"

SOCIAL_PLATFORMS=(
    "https://twitter.com/$EMAIL_USERNAME"
    "https://instagram.com/$EMAIL_USERNAME"
    "https://facebook.com/${FULLNAME_LOWER// /.}"
)

for platform in "${SOCIAL_PLATFORMS[@]}"; do
    response=$(curl -s -I "$platform" | grep "HTTP" | awk '{print $2}')
    if [ "$response" == "200" ]; then
        echo "- ✅ $platform" >> "$REPORT_MD"
        echo -e "${GREEN}[+] Bulundu: $platform${NC}"
    fi
done

# Google dorking önerileri
echo -e "\n${YELLOW}[*] Arama önerileri hazırlanıyor...${NC}"
{
    echo ""
    echo "## 5. Arama Önerileri"
    echo ""
    echo "### 5.1 E-posta Bazlı Aramalar"
    echo "- \`\"$EMAIL\"\` (tam eşleşme)"
    echo "- \`\"$EMAIL_USERNAME\"\` (kullanıcı adı)"
    echo ""
    echo "### 5.2 İsim Bazlı Aramalar"
    echo "- \`\"$FULLNAME\"\` (tam isim)"
    echo "- \`\"$FIRSTNAME $LASTNAME\" filetype:pdf\` (dokümanlar)"
    echo "- \`\"$FULLNAME\" (blog OR github OR linkedin OR twitter)\` (sosyal profiller)"
    echo ""
    echo "### 5.3 Özel Aramalar"
    echo "- \`\"$EMAIL\" (leak OR breach OR dump OR database)\` (veri sızıntıları)"
    echo "- \`\"$FULLNAME\" (cv OR resume OR curriculum vitae)\` (özgeçmiş)"
    echo ""
} >> "$REPORT_MD"

echo -e "${GREEN}[+] Rapor oluşturuldu: $REPORT_MD${NC}"
echo -e "${GREEN}[+] Potansiyel şifreler kaydedildi: $PASSWORD_FILE${NC}"

# Raporu göster
echo -e "\n${YELLOW}[?] Raporu görüntülemek ister misiniz? (E/h)${NC}"
read -r SHOW_REPORT
if [[ $SHOW_REPORT =~ ^[Ee]$ ]] || [[ -z $SHOW_REPORT ]]; then
    if command -v bat >/dev/null 2>&1; then
        bat "$REPORT_MD"
    else
        cat "$REPORT_MD"
    fi
fi
