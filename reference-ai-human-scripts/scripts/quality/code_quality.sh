#!/bin/bash

# code_quality.sh - Neo projelerinde kod kalite kontrolü yapan araç

# Renkli çıktı için ANSI renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # Renk yok (Normal)

# Banner göster
clear
echo -e "${CYAN}============================================================${NC}"
echo -e "${CYAN}                KOD KALİTE KONTROL ARACI                    ${NC}"
echo -e "${CYAN}============================================================${NC}"
echo

# Varsayılan değerler
SCAN_PHP=false
SCAN_JS=false
SCAN_VUE=false
SCAN_ALL=false
FIX_MODE=false
VERBOSE=false
GENERATE_REPORT=false
REPORT_FORMAT="console"
REPORT_FILE="code_quality_report.md"
EXCLUDE_PATTERNS=""
ONLY_PROJECT=""
CHECK_COMPLEXITY=false
CHECK_DUPLICATIONS=false
SHOW_SUMMARY=true

# Yardım fonksiyonu
show_help() {
    echo -e "Kullanım: ${GREEN}./code_quality.sh [seçenekler] [proje_adı1 proje_adı2 ...]${NC}"
    echo
    echo -e "Bu script, proje kodlarının kalitesini kontrol eder ve standartlara uygunluğunu denetler."
    echo
    echo -e "Seçenekler:"
    echo -e "  ${YELLOW}-h, --help${NC}             Bu yardım mesajını gösterir"
    echo -e "  ${YELLOW}-p, --php${NC}              PHP dosyalarını kontrol eder"
    echo -e "  ${YELLOW}-j, --js${NC}               JavaScript dosyalarını kontrol eder"
    echo -e "  ${YELLOW}-v, --vue${NC}              Vue dosyalarını kontrol eder"
    echo -e "  ${YELLOW}-a, --all${NC}              Tüm desteklenen dosya türlerini kontrol eder"
    echo -e "  ${YELLOW}-f, --fix${NC}              Tespit edilen sorunları mümkünse otomatik düzeltir"
    echo -e "  ${YELLOW}--verbose${NC}              Ayrıntılı çıktı verir"
    echo -e "  ${YELLOW}--report${NC}               Rapor oluşturur"
    echo -e "  ${YELLOW}--format <format>${NC}      Rapor formatı (console, markdown, json, html)"
    echo -e "  ${YELLOW}--output <dosya>${NC}       Rapor çıktı dosyası (varsayılan: code_quality_report.md)"
    echo -e "  ${YELLOW}--exclude <desen>${NC}      Belirtilen desene uyan dosyaları hariç tutar"
    echo -e "  ${YELLOW}--complexity${NC}           Kod karmaşıklığını kontrol eder"
    echo -e "  ${YELLOW}--duplications${NC}         Kod tekrarlarını kontrol eder"
    echo -e "  ${YELLOW}--no-summary${NC}           Özet bilgileri göstermez"
    echo
    echo -e "Örnekler:"
    echo -e "  ${GREEN}./code_quality.sh --all${NC}"
    echo -e "  ${GREEN}./code_quality.sh --php --js --fix proje1 proje2${NC}"
    echo -e "  ${GREEN}./code_quality.sh --all --report --format markdown --output rapor.md${NC}"
    echo -e "  ${GREEN}./code_quality.sh --php --exclude 'vendor|tests' --complexity${NC}"
    echo
    exit 0
}

# Parametreleri işle
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_help
            ;;
        -p|--php)
            SCAN_PHP=true
            shift
            ;;
        -j|--js)
            SCAN_JS=true
            shift
            ;;
        -v|--vue)
            SCAN_VUE=true
            shift
            ;;
        -a|--all)
            SCAN_ALL=true
            shift
            ;;
        -f|--fix)
            FIX_MODE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --report)
            GENERATE_REPORT=true
            shift
            ;;
        --format)
            if [[ $# -gt 1 ]]; then
                REPORT_FORMAT="$2"
                shift 2
            else
                echo -e "${RED}Hata: --format için değer belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --output)
            if [[ $# -gt 1 ]]; then
                REPORT_FILE="$2"
                shift 2
            else
                echo -e "${RED}Hata: --output için değer belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --exclude)
            if [[ $# -gt 1 ]]; then
                EXCLUDE_PATTERNS="$2"
                shift 2
            else
                echo -e "${RED}Hata: --exclude için değer belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --complexity)
            CHECK_COMPLEXITY=true
            shift
            ;;
        --duplications)
            CHECK_DUPLICATIONS=true
            shift
            ;;
        --no-summary)
            SHOW_SUMMARY=false
            shift
            ;;
        -*)
            echo -e "${RED}Hata: Bilinmeyen seçenek: $1${NC}"
            exit 1
            ;;
        *)
            if [[ -z "$ONLY_PROJECT" ]]; then
                ONLY_PROJECT="$1"
            else
                ONLY_PROJECT="$ONLY_PROJECT $1"
            fi
            shift
            ;;
    esac
done

# Eğer hiçbir dil seçilmediyse, --all gibi davran
if [[ "$SCAN_PHP" == "false" && "$SCAN_JS" == "false" && "$SCAN_VUE" == "false" && "$SCAN_ALL" == "false" ]]; then
    SCAN_ALL=true
fi

# --all seçeneği, tüm dilleri etkinleştirir
if [[ "$SCAN_ALL" == "true" ]]; then
    SCAN_PHP=true
    SCAN_JS=true
    SCAN_VUE=true
fi

# Proje dizinini tanımla
PROJECT_DIR="$(dirname "$0")/projects"

# Dizin var mı kontrol et
if [[ ! -d "$PROJECT_DIR" ]]; then
    echo -e "${RED}Hata: 'projects' klasörü bulunamadı!${NC}"
    echo -e "${RED}Bu scripti Neo projesinin kök dizininden çalıştırın.${NC}"
    exit 1
fi

# Gerekli araçların varlığını kontrol et
check_tools() {
    local missing_tools=()

    if [[ "$SCAN_PHP" == "true" ]]; then
        if ! command -v php &> /dev/null; then
            missing_tools+=("php")
        fi

        if ! command -v phpcs &> /dev/null; then
            missing_tools+=("phpcs (PHP_CodeSniffer)")
        fi

        if [[ "$FIX_MODE" == "true" ]] && ! command -v phpcbf &> /dev/null; then
            missing_tools+=("phpcbf (PHP Code Beautifier)")
        fi

        if [[ "$CHECK_COMPLEXITY" == "true" ]] && ! command -v phpmd &> /dev/null; then
            missing_tools+=("phpmd (PHP Mess Detector)")
        fi
    fi

    if [[ "$SCAN_JS" == "true" || "$SCAN_VUE" == "true" ]]; then
        if ! command -v node &> /dev/null; then
            missing_tools+=("node.js")
        fi

        if ! command -v eslint &> /dev/null; then
            missing_tools+=("eslint")
        fi

        if [[ "$CHECK_COMPLEXITY" == "true" ]] && ! command -v jscpd &> /dev/null; then
            missing_tools+=("jscpd (JavaScript Copy-Paste Detector)")
        fi
    fi

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        echo -e "${RED}Hata: Aşağıdaki araçlar eksik:${NC}"
        for tool in "${missing_tools[@]}"; do
            echo -e "  ${RED}*${NC} $tool"
        done
        echo
        echo -e "${YELLOW}Bu araçları yüklemek için:${NC}"
        echo -e "  ${CYAN}PHP araçları:${NC} composer global require squizlabs/php_codesniffer phpmd/phpmd"
        echo -e "  ${CYAN}JS araçları:${NC} npm install -g eslint jscpd"
        echo
        exit 1
    fi
}

# Rapor başlangıcı
output_begin() {
    local date=$(date +"%Y-%m-%d %H:%M:%S")

    case "$REPORT_FORMAT" in
        console)
            echo -e "\n${CYAN}============================================================${NC}"
            echo -e "${CYAN}                KOD KALİTE KONTROL RAPORU                   ${NC}"
            echo -e "${CYAN}============================================================${NC}"
            echo
            echo -e "${YELLOW}Oluşturulma Tarihi:${NC} $date"
            echo -e "${YELLOW}Kontrol Edilen Diller:${NC}"
            [[ "$SCAN_PHP" == "true" ]] && echo -e "  ${GREEN}*${NC} PHP"
            [[ "$SCAN_JS" == "true" ]] && echo -e "  ${GREEN}*${NC} JavaScript"
            [[ "$SCAN_VUE" == "true" ]] && echo -e "  ${GREEN}*${NC} Vue.js"
            echo
            ;;
        markdown)
            echo "# Kod Kalite Kontrol Raporu" > "$REPORT_FILE"
            echo >> "$REPORT_FILE"
            echo "**Oluşturulma Tarihi:** $date" >> "$REPORT_FILE"
            echo >> "$REPORT_FILE"
            echo "**Kontrol Edilen Diller:**" >> "$REPORT_FILE"
            [[ "$SCAN_PHP" == "true" ]] && echo "* PHP" >> "$REPORT_FILE"
            [[ "$SCAN_JS" == "true" ]] && echo "* JavaScript" >> "$REPORT_FILE"
            [[ "$SCAN_VUE" == "true" ]] && echo "* Vue.js" >> "$REPORT_FILE"
            echo >> "$REPORT_FILE"
            ;;
        json)
            echo "{" > "$REPORT_FILE"
            echo "  \"report_date\": \"$date\"," >> "$REPORT_FILE"
            echo "  \"languages\": {" >> "$REPORT_FILE"
            echo "    \"php\": $([ "$SCAN_PHP" == "true" ] && echo "true" || echo "false")," >> "$REPORT_FILE"
            echo "    \"javascript\": $([ "$SCAN_JS" == "true" ] && echo "true" || echo "false")," >> "$REPORT_FILE"
            echo "    \"vue\": $([ "$SCAN_VUE" == "true" ] && echo "true" || echo "false")" >> "$REPORT_FILE"
            echo "  }," >> "$REPORT_FILE"
            echo "  \"projects\": [" >> "$REPORT_FILE"
            ;;
        html)
            echo "<!DOCTYPE html>" > "$REPORT_FILE"
            echo "<html lang=\"tr\">" >> "$REPORT_FILE"
            echo "<head>" >> "$REPORT_FILE"
            echo "  <meta charset=\"UTF-8\">" >> "$REPORT_FILE"
            echo "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" >> "$REPORT_FILE"
            echo "  <title>Kod Kalite Kontrol Raporu</title>" >> "$REPORT_FILE"
            echo "  <style>" >> "$REPORT_FILE"
            echo "    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }" >> "$REPORT_FILE"
            echo "    h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }" >> "$REPORT_FILE"
            echo "    h2 { color: #444; margin-top: 20px; }" >> "$REPORT_FILE"
            echo "    .error { color: #d9534f; }" >> "$REPORT_FILE"
            echo "    .warning { color: #f0ad4e; }" >> "$REPORT_FILE"
            echo "    .ok { color: #5cb85c; }" >> "$REPORT_FILE"
            echo "    .project { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 4px; }" >> "$REPORT_FILE"
            echo "    .summary { background-color: #f8f9fa; padding: 15px; margin-top: 20px; }" >> "$REPORT_FILE"
            echo "  </style>" >> "$REPORT_FILE"
            echo "</head>" >> "$REPORT_FILE"
            echo "<body>" >> "$REPORT_FILE"
            echo "  <h1>Kod Kalite Kontrol Raporu</h1>" >> "$REPORT_FILE"
            echo "  <p><strong>Oluşturulma Tarihi:</strong> $date</p>" >> "$REPORT_FILE"
            echo "  <p><strong>Kontrol Edilen Diller:</strong></p>" >> "$REPORT_FILE"
            echo "  <ul>" >> "$REPORT_FILE"
            [[ "$SCAN_PHP" == "true" ]] && echo "    <li>PHP</li>" >> "$REPORT_FILE"
            [[ "$SCAN_JS" == "true" ]] && echo "    <li>JavaScript</li>" >> "$REPORT_FILE"
            [[ "$SCAN_VUE" == "true" ]] && echo "    <li>Vue.js</li>" >> "$REPORT_FILE"
            echo "  </ul>" >> "$REPORT_FILE"
            ;;
    esac
}

# Rapor bölüm başlığı
output_section() {
    local section_title="$1"

    case "$REPORT_FORMAT" in
        console)
            echo -e "\n${YELLOW}$section_title${NC}"
            echo -e "${YELLOW}$(printf '=%.0s' $(seq 1 ${#section_title}))${NC}"
            ;;
        markdown)
            echo "## $section_title" >> "$REPORT_FILE"
            echo >> "$REPORT_FILE"
            ;;
        json)
            # JSON için bölüm başlıkları kullanılmaz, projeler direkt listeye eklenir
            ;;
        html)
            echo "  <h2>$section_title</h2>" >> "$REPORT_FILE"
            ;;
    esac
}

# Proje başlangıcı
output_project_begin() {
    local project_name="$1"

    case "$REPORT_FORMAT" in
        console)
            echo -e "\n${GREEN}Proje: $project_name${NC}"
            echo -e "${GREEN}$(printf '-%.0s' $(seq 1 $((${#project_name} + 8))))${NC}"
            ;;
        markdown)
            echo "### Proje: $project_name" >> "$REPORT_FILE"
            echo >> "$REPORT_FILE"
            ;;
        json)
            if [[ "$project_name" != "OVERALL" ]]; then
                if [[ "$json_first_project" != "true" ]]; then
                    echo "," >> "$REPORT_FILE"
                fi
                json_first_project="true"
                echo "    {" >> "$REPORT_FILE"
                echo "      \"name\": \"$project_name\"," >> "$REPORT_FILE"
                echo "      \"issues\": [" >> "$REPORT_FILE"
                json_first_issue="false"
            fi
            ;;
        html)
            echo "  <div class=\"project\">" >> "$REPORT_FILE"
            echo "    <h3>Proje: $project_name</h3>" >> "$REPORT_FILE"
            ;;
    esac
}

# Sorun raporu
output_issue() {
    local file="$1"
    local line="$2"
    local severity="$3"  # error, warning, info
    local message="$4"
    local rule="$5"

    case "$REPORT_FORMAT" in
        console)
            if [[ "$severity" == "error" ]]; then
                echo -e "  ${RED}HATA${NC} $file:$line - $message [$rule]"
            elif [[ "$severity" == "warning" ]]; then
                echo -e "  ${YELLOW}UYARI${NC} $file:$line - $message [$rule]"
            else
                echo -e "  ${BLUE}BİLGİ${NC} $file:$line - $message [$rule]"
            fi
            ;;
        markdown)
            local severity_text
            if [[ "$severity" == "error" ]]; then
                severity_text="**HATA**"
            elif [[ "$severity" == "warning" ]]; then
                severity_text="**UYARI**"
            else
                severity_text="**BİLGİ**"
            fi
            echo "- $severity_text $file:$line - $message [$rule]" >> "$REPORT_FILE"
            ;;
        json)
            if [[ "$json_first_issue" == "true" ]]; then
                echo "," >> "$REPORT_FILE"
            else
                json_first_issue="true"
            fi
            echo "        {" >> "$REPORT_FILE"
            echo "          \"file\": \"$file\"," >> "$REPORT_FILE"
            echo "          \"line\": $line," >> "$REPORT_FILE"
            echo "          \"severity\": \"$severity\"," >> "$REPORT_FILE"
            echo "          \"message\": \"$message\"," >> "$REPORT_FILE"
            echo "          \"rule\": \"$rule\"" >> "$REPORT_FILE"
            echo "        }" >> "$REPORT_FILE"
            ;;
        html)
            local css_class
            if [[ "$severity" == "error" ]]; then
                css_class="error"
            elif [[ "$severity" == "warning" ]]; then
                css_class="warning"
            else
                css_class="info"
            fi
            echo "    <p class=\"$css_class\">$file:$line - $message [$rule]</p>" >> "$REPORT_FILE"
            ;;
    esac
}

# Proje sonu
output_project_end() {
    local error_count="$1"
    local warning_count="$2"
    local hint_count="$3"

    case "$REPORT_FORMAT" in
        console)
            echo -e "\n  ${PURPLE}Özet:${NC} $error_count hata, $warning_count uyarı, $hint_count ipucu"
            ;;
        markdown)
            echo >> "$REPORT_FILE"
            echo "**Özet:** $error_count hata, $warning_count uyarı, $hint_count ipucu" >> "$REPORT_FILE"
            echo >> "$REPORT_FILE"
            ;;
        json)
            if [[ "$first_project" != "OVERALL" ]]; then
                echo "      ]," >> "$REPORT_FILE"
                echo "      \"summary\": {" >> "$REPORT_FILE"
                echo "        \"error_count\": $error_count," >> "$REPORT_FILE"
                echo "        \"warning_count\": $warning_count," >> "$REPORT_FILE"
                echo "        \"hint_count\": $hint_count" >> "$REPORT_FILE"
                echo "      }" >> "$REPORT_FILE"
                echo "    }" >> "$REPORT_FILE"
            fi
            ;;
        html)
            echo "    <div class=\"summary\">" >> "$REPORT_FILE"
            echo "      <p><strong>Özet:</strong> $error_count hata, $warning_count uyarı, $hint_count ipucu</p>" >> "$REPORT_FILE"
            echo "    </div>" >> "$REPORT_FILE"
            echo "  </div>" >> "$REPORT_FILE"
            ;;
    esac
}

# Rapor sonu
output_end() {
    local total_errors="$1"
    local total_warnings="$2"
    local total_hints="$3"
    local scanned_projects="$4"
    local clean_projects="$5"

    case "$REPORT_FORMAT" in
        console)
            echo -e "\n${CYAN}============================================================${NC}"
            echo -e "${CYAN}                     GENEL SONUÇLAR                        ${NC}"
            echo -e "${CYAN}============================================================${NC}"
            echo
            echo -e "${YELLOW}Toplam Taranılan Proje:${NC} $scanned_projects"
            echo -e "${YELLOW}Temiz Proje Sayısı:${NC} $clean_projects"
            echo -e "${YELLOW}Toplam Hata:${NC} $total_errors"
            echo -e "${YELLOW}Toplam Uyarı:${NC} $total_warnings"
            echo -e "${YELLOW}Toplam İpucu:${NC} $total_hints"
            echo
            echo -e "Rapor oluşturulma tarihi: $(date)"
            echo
            ;;
        markdown)
            echo "## Genel Sonuçlar" >> "$REPORT_FILE"
            echo >> "$REPORT_FILE"
            echo "| Metrik | Değer |" >> "$REPORT_FILE"
            echo "|--------|-------|" >> "$REPORT_FILE"
            echo "| Toplam Taranan Proje | $scanned_projects |" >> "$REPORT_FILE"
            echo "| Temiz Proje Sayısı | $clean_projects |" >> "$REPORT_FILE"
            echo "| Toplam Hata | $total_errors |" >> "$REPORT_FILE"
            echo "| Toplam Uyarı | $total_warnings |" >> "$REPORT_FILE"
            echo "| Toplam İpucu | $total_hints |" >> "$REPORT_FILE"
            echo >> "$REPORT_FILE"
            echo "_Rapor oluşturulma tarihi: $(date)_" >> "$REPORT_FILE"

            echo -e "${GREEN}Rapor başarıyla oluşturuldu: ${REPORT_FILE}${NC}"
            ;;
        json)
            echo "  ]," >> "$REPORT_FILE"
            echo "  \"summary\": {" >> "$REPORT_FILE"
            echo "    \"total_projects\": $scanned_projects," >> "$REPORT_FILE"
            echo "    \"clean_projects\": $clean_projects," >> "$REPORT_FILE"
            echo "    \"total_errors\": $total_errors," >> "$REPORT_FILE"
            echo "    \"total_warnings\": $total_warnings," >> "$REPORT_FILE"
            echo "    \"total_hints\": $total_hints," >> "$REPORT_FILE"
            echo "    \"report_date\": \"$(date)\"" >> "$REPORT_FILE"
            echo "  }" >> "$REPORT_FILE"
            echo "}" >> "$REPORT_FILE"

            echo -e "${GREEN}Rapor başarıyla oluşturuldu: ${REPORT_FILE}${NC}"
            ;;
        html)
            echo "  <div class=\"summary\">" >> "$REPORT_FILE"
            echo "    <h2>Genel Sonuçlar</h2>" >> "$REPORT_FILE"
            echo "    <ul>" >> "$REPORT_FILE"
            echo "      <li><strong>Toplam Taranan Proje:</strong> $scanned_projects</li>" >> "$REPORT_FILE"
            echo "      <li><strong>Temiz Proje Sayısı:</strong> $clean_projects</li>" >> "$REPORT_FILE"
            echo "      <li><strong>Toplam Hata:</strong> $total_errors</li>" >> "$REPORT_FILE"
            echo "      <li><strong>Toplam Uyarı:</strong> $total_warnings</li>" >> "$REPORT_FILE"
            echo "      <li><strong>Toplam İpucu:</strong> $total_hints</li>" >> "$REPORT_FILE"
            echo "    </ul>" >> "$REPORT_FILE"
            echo "    <p><em>Rapor oluşturulma tarihi: $(date)</em></p>" >> "$REPORT_FILE"
            echo "  </div>" >> "$REPORT_FILE"
            echo "</body>" >> "$REPORT_FILE"
            echo "</html>" >> "$REPORT_FILE"

            echo -e "${GREEN}Rapor başarıyla oluşturuldu: ${REPORT_FILE}${NC}"
            ;;
    esac
}

# PHP kod kontrolü
check_php() {
    local project_dir="$1"
    local project_name="$2"
    local error_count=0
    local warning_count=0
    local hint_count=0

    echo -e "  ${BLUE}PHP kodu kontrol ediliyor...${NC}"

    # PHP Code Sniffer ile kod standartlarını kontrol et
    if [[ -d "$project_dir" ]]; then
        local phpcs_output=""

        if [[ -n "$EXCLUDE_PATTERNS" ]]; then
            phpcs_output=$(phpcs --standard=PSR12 --extensions=php --ignore=$EXCLUDE_PATTERNS "$project_dir" 2>&1)
        else
            phpcs_output=$(phpcs --standard=PSR12 --extensions=php "$project_dir" 2>&1)
        fi

        # Çıktıyı işle
        local issue_count=$(echo "$phpcs_output" | grep -c "ERROR\|WARNING")

        if [[ "$issue_count" -gt 0 ]]; then
            echo "$phpcs_output" | grep -E "^[^ ].*\.(php|inc):" | while read -r line; do
                local file=$(echo "$line" | cut -d ':' -f 1)
                local line_num=$(echo "$line" | cut -d ':' -f 2)
                local issue_type=$(echo "$line" | grep -o 'ERROR\|WARNING')
                local message=$(echo "$line" | cut -d ' ' -f 4- | sed 's/^[ \t]*//')
                local rule=""

                if [[ "$issue_type" == "ERROR" ]]; then
                    error_count=$((error_count + 1))
                    output_issue "$file" "$line_num" "error" "$message" "PSR12"
                else
                    warning_count=$((warning_count + 1))
                    output_issue "$file" "$line_num" "warning" "$message" "PSR12"
                fi
            done
        else
            echo -e "  ${GREEN}PHP kontrol: Sorun bulunamadı${NC}"
        fi

        # Eğer --fix modu etkinse ve sorun bulunduysa düzelt
        if [[ "$FIX_MODE" == "true" && "$issue_count" -gt 0 ]]; then
            echo -e "  ${YELLOW}PHP kodları PSR12 standardına göre düzeltiliyor...${NC}"

            if [[ -n "$EXCLUDE_PATTERNS" ]]; then
                phpcbf --standard=PSR12 --extensions=php --ignore=$EXCLUDE_PATTERNS "$project_dir" > /dev/null 2>&1
            else
                phpcbf --standard=PSR12 --extensions=php "$project_dir" > /dev/null 2>&1
            fi

            echo -e "  ${GREEN}PHP kod düzeltme tamamlandı.${NC}"
        fi

        # Eğer kod karmaşıklığı kontrolü istenmişse PHPMD çalıştır
        if [[ "$CHECK_COMPLEXITY" == "true" ]]; then
            echo -e "  ${BLUE}PHP kod karmaşıklığı kontrol ediliyor...${NC}"

            local phpmd_output=""

            if [[ -n "$EXCLUDE_PATTERNS" ]]; then
                phpmd_output=$(phpmd "$project_dir" text codesize,unusedcode,naming --exclude "$EXCLUDE_PATTERNS" 2>&1)
            else
                phpmd_output=$(phpmd "$project_dir" text codesize,unusedcode,naming 2>&1)
            fi

            if [[ -n "$phpmd_output" && "$phpmd_output" != *"Processing"* ]]; then
                echo "$phpmd_output" | grep -E "^[^ ].*\.php:" | while read -r line; do
                    local file=$(echo "$line" | cut -d ':' -f 1)
                    local line_num=$(echo "$line" | cut -d ':' -f 2)
                    local message=$(echo "$line" | cut -d ' ' -f 3-)
                    local rule=$(echo "$message" | grep -o -E '\([A-Za-z]+\)' | tr -d '()')

                    hint_count=$((hint_count + 1))
                    output_issue "$file" "$line_num" "info" "$message" "PHPMD:$rule"
                done
            else
                echo -e "  ${GREEN}PHP karmaşıklık kontrolü: Sorun bulunamadı${NC}"
            fi
        fi
    fi

    return 0
}

# JavaScript kod kontrolü
check_js() {
    local project_dir="$1"
    local project_name="$2"
    local error_count=0
    local warning_count=0
    local hint_count=0

    echo -e "  ${BLUE}JavaScript kodu kontrol ediliyor...${NC}"

    # ESLint ile kod standartlarını kontrol et
    if [[ -d "$project_dir" ]]; then
        # Proje klasöründe .eslintrc var mı kontrol et
        local eslint_config=""
        if [[ -f "$project_dir/.eslintrc" || -f "$project_dir/.eslintrc.js" || -f "$project_dir/.eslintrc.json" ]]; then
            eslint_config="--config $project_dir/.eslintrc"
        fi

        local eslint_output=""

        if [[ -n "$EXCLUDE_PATTERNS" ]]; then
            eslint_output=$(eslint $eslint_config --ext .js "$project_dir" --ignore-pattern "$EXCLUDE_PATTERNS" 2>&1 || true)
        else
            eslint_output=$(eslint $eslint_config --ext .js "$project_dir" 2>&1 || true)
        fi

        # Çıktıyı işle
        local issue_count=$(echo "$eslint_output" | grep -c "error\|warning")

        if [[ "$issue_count" -gt 0 ]]; then
            echo "$eslint_output" | grep -E "^[^ ].*\.js:" | while read -r line; do
                local file=$(echo "$line" | cut -d ':' -f 1)
                local line_num=$(echo "$line" | cut -d ':' -f 2)
                local col_num=$(echo "$line" | cut -d ':' -f 3)
                local issue_type=$(echo "$line" | grep -o 'error\|warning')
                local message=$(echo "$line" | cut -d ' ' -f 4- | sed 's/^[ \t]*//')
                local rule=$(echo "$message" | grep -o -E '\([a-z-]+\)' | tr -d '()')

                if [[ "$issue_type" == "error" ]]; then
                    error_count=$((error_count + 1))
                    output_issue "$file" "$line_num:$col_num" "error" "$message" "ESLint:$rule"
                else
                    warning_count=$((warning_count + 1))
                    output_issue "$file" "$line_num:$col_num" "warning" "$message" "ESLint:$rule"
                fi
            done
        else
            echo -e "  ${GREEN}JavaScript kontrol: Sorun bulunamadı${NC}"
        fi

        # Eğer --fix modu etkinse ve sorun bulunduysa düzelt
        if [[ "$FIX_MODE" == "true" && "$issue_count" -gt 0 ]]; then
            echo -e "  ${YELLOW}JavaScript kodları düzeltiliyor...${NC}"

            if [[ -n "$EXCLUDE_PATTERNS" ]]; then
                eslint $eslint_config --ext .js --fix "$project_dir" --ignore-pattern "$EXCLUDE_PATTERNS" > /dev/null 2>&1 || true
            else
                eslint $eslint_config --ext .js --fix "$project_dir" > /dev/null 2>&1 || true
            fi

            echo -e "  ${GREEN}JavaScript kod düzeltme tamamlandı.${NC}"
        fi

        # Kod tekrarlarını kontrol et
        if [[ "$CHECK_DUPLICATIONS" == "true" ]]; then
            echo -e "  ${BLUE}JavaScript kod tekrarları kontrol ediliyor...${NC}"

            local jscpd_output=""

            if [[ -n "$EXCLUDE_PATTERNS" ]]; then
                jscpd_output=$(jscpd --min-lines 5 --min-tokens 70 --ignore "$EXCLUDE_PATTERNS" "$project_dir" 2>&1 || true)
            else
                jscpd_output=$(jscpd --min-lines 5 --min-tokens 70 "$project_dir" 2>&1 || true)
            fi

            local dup_count=$(echo "$jscpd_output" | grep -c "clones found")

            if [[ "$dup_count" -gt 0 ]]; then
                echo "$jscpd_output" | grep -A 2 "Found" | while read -r line; do
                    hint_count=$((hint_count + 1))
                    output_issue "$project_dir" "N/A" "info" "Kod tekrarı tespit edildi: $line" "JSCPD"
                done
            else
                echo -e "  ${GREEN}JavaScript kod tekrarı kontrolü: Sorun bulunamadı${NC}"
            fi
        fi
    fi

    return 0
}

# Vue kod kontrolü
check_vue() {
    local project_dir="$1"
    local project_name="$2"
    local error_count=0
    local warning_count=0
    local hint_count=0

    echo -e "  ${BLUE}Vue.js kodu kontrol ediliyor...${NC}"

    # ESLint ile kod standartlarını kontrol et
    if [[ -d "$project_dir" ]]; then
        # Proje klasöründe .eslintrc var mı kontrol et
        local eslint_config=""
        if [[ -f "$project_dir/.eslintrc" || -f "$project_dir/.eslintrc.js" || -f "$project_dir/.eslintrc.json" ]]; then
            eslint_config="--config $project_dir/.eslintrc"
        fi

        local eslint_output=""

        if [[ -n "$EXCLUDE_PATTERNS" ]]; then
            eslint_output=$(eslint $eslint_config --ext .vue "$project_dir" --ignore-pattern "$EXCLUDE_PATTERNS" 2>&1 || true)
        else
            eslint_output=$(eslint $eslint_config --ext .vue "$project_dir" 2>&1 || true)
        fi

        # Çıktıyı işle
        local issue_count=$(echo "$eslint_output" | grep -c "error\|warning")

        if [[ "$issue_count" -gt 0 ]]; then
            echo "$eslint_output" | grep -E "^[^ ].*\.vue:" | while read -r line; do
                local file=$(echo "$line" | cut -d ':' -f 1)
                local line_num=$(echo "$line" | cut -d ':' -f 2)
                local col_num=$(echo "$line" | cut -d ':' -f 3)
                local issue_type=$(echo "$line" | grep -o 'error\|warning')
                local message=$(echo "$line" | cut -d ' ' -f 4- | sed 's/^[ \t]*//')
                local rule=$(echo "$message" | grep -o -E '\([a-z/-]+\)' | tr -d '()')

                if [[ "$issue_type" == "error" ]]; then
                    error_count=$((error_count + 1))
                    output_issue "$file" "$line_num:$col_num" "error" "$message" "ESLint:$rule"
                else
                    warning_count=$((warning_count + 1))
                    output_issue "$file" "$line_num:$col_num" "warning" "$message" "ESLint:$rule"
                fi
            done
        else
            echo -e "  ${GREEN}Vue.js kontrol: Sorun bulunamadı${NC}"
        fi

        # Eğer --fix modu etkinse ve sorun bulunduysa düzelt
        if [[ "$FIX_MODE" == "true" && "$issue_count" -gt 0 ]]; then
            echo -e "  ${YELLOW}Vue.js kodları düzeltiliyor...${NC}"

            if [[ -n "$EXCLUDE_PATTERNS" ]]; then
                eslint $eslint_config --ext .vue --fix "$project_dir" --ignore-pattern "$EXCLUDE_PATTERNS" > /dev/null 2>&1 || true
            else
                eslint $eslint_config --ext .vue --fix "$project_dir" > /dev/null 2>&1 || true
            fi

            echo -e "  ${GREEN}Vue.js kod düzeltme tamamlandı.${NC}"
        fi
    fi

    return 0
}

# Ana işlem
main() {
    # Gerekli araçların varlığını kontrol et
    check_tools

    # Başlangıç bilgilerini göster
    echo -e "Kod kalite kontrolü başlatılıyor..."
    echo -e "İşlenecek diller:"
    [[ "$SCAN_PHP" == "true" ]] && echo -e "  ${GREEN}*${NC} PHP"
    [[ "$SCAN_JS" == "true" ]] && echo -e "  ${GREEN}*${NC} JavaScript"
    [[ "$SCAN_VUE" == "true" ]] && echo -e "  ${GREEN}*${NC} Vue.js"
    echo

    # Rapor başlangıcı
    if [[ "$GENERATE_REPORT" == "true" ]]; then
        output_begin
    fi

    # İşlenecek projeleri belirle
    declare -a projects

    if [[ -n "$ONLY_PROJECT" ]]; then
        # Belirtilen projeleri işle
        for proj in $ONLY_PROJECT; do
            if [[ -d "$PROJECT_DIR/$proj" ]]; then
                projects+=("$proj")
            else
                echo -e "${RED}Hata: '$proj' projesi bulunamadı!${NC}"
            fi
        done
    else
        # Tüm projeleri işle
        while IFS= read -r -d '' dir; do
            proj=$(basename "$dir")
            projects+=("$proj")
        done < <(find "$PROJECT_DIR" -maxdepth 1 -type d -not -path "$PROJECT_DIR" -print0 | sort -z)
    fi

    # Toplam proje sayısını göster
    TOTAL_PROJECTS=${#projects[@]}
    echo -e "Toplam $TOTAL_PROJECTS proje işlenecek."
    echo

    # Özet istatistikler
    TOTAL_ERRORS=0
    TOTAL_WARNINGS=0
    TOTAL_HINTS=0
    CLEAN_PROJECTS=0

    # Projeleri işle
    output_section "PROJE SONUÇLARI"

    for project in "${projects[@]}"; do
        local project_path="$PROJECT_DIR/$project"
        local project_errors=0
        local project_warnings=0
        local project_hints=0

        output_project_begin "$project"

        # PHP kontrolü
        if [[ "$SCAN_PHP" == "true" ]]; then
            check_php "$project_path" "$project"
        fi

        # JavaScript kontrolü
        if [[ "$SCAN_JS" == "true" ]]; then
            check_js "$project_path" "$project"
        fi

        # Vue kontrolü
        if [[ "$SCAN_VUE" == "true" ]]; then
            check_vue "$project_path" "$project"
        fi

        # Proje özetini göster
        output_project_end "$project_errors" "$project_warnings" "$project_hints"

        # Genel istatistikleri güncelle
        TOTAL_ERRORS=$((TOTAL_ERRORS + project_errors))
        TOTAL_WARNINGS=$((TOTAL_WARNINGS + project_warnings))
        TOTAL_HINTS=$((TOTAL_HINTS + project_hints))

        # Temiz projeleri say
        if [[ $project_errors -eq 0 && $project_warnings -eq 0 ]]; then
            CLEAN_PROJECTS=$((CLEAN_PROJECTS + 1))
        fi
    done

    # Özet göster
    if [[ "$SHOW_SUMMARY" == "true" ]]; then
        output_end "$TOTAL_ERRORS" "$TOTAL_WARNINGS" "$TOTAL_HINTS" "$TOTAL_PROJECTS" "$CLEAN_PROJECTS"
    fi

    # İşlem sonu
    if [[ "$GENERATE_REPORT" != "true" ]]; then
        echo -e "\nKod kalite kontrolü tamamlandı."
        echo -e "İşlem tarihi: $(date)"
    fi

    exit 0
}

# Ana işlemi başlat
main
