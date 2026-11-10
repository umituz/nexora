#!/bin/bash

# generate_docs.sh - Neo projeleri için dokümantasyon oluşturma aracı

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
echo -e "${CYAN}           DOKÜMANTASYON OLUŞTURMA ARACI                   ${NC}"
echo -e "${CYAN}============================================================${NC}"
echo

# Varsayılan değerler
SOURCE_DIR="$(dirname "$0")/projects"
OUTPUT_DIR="$(dirname "$0")/docs"
DOC_TYPE="all"  # readme, api, phpdoc
VERBOSE=false
FORCE=false
INCLUDE_TOC=true
TEMPLATES_DIR="$(dirname "$0")/templates"
INCLUDE_SCREENSHOTS=false
GENERATE_GRAPH=false
EXCLUDE_PATTERNS=""
PROJECT_REGEX=""
FORMAT="markdown"
CREATE_PDF=false
CREATE_WEBSITE=false
SITE_PREFIX=""

# Yardım fonksiyonu
show_help() {
    echo -e "Kullanım: ${GREEN}./generate_docs.sh [seçenekler] [proje_adı1 proje_adı2 ...]${NC}"
    echo
    echo -e "Bu script, Neo projeleri için dokümantasyon oluşturur."
    echo
    echo -e "Seçenekler:"
    echo -e "  ${YELLOW}-h, --help${NC}                Bu yardım mesajını gösterir"
    echo -e "  ${YELLOW}-t, --type <tip>${NC}          Oluşturulacak dokümantasyon tipi:"
    echo -e "                              ${BLUE}readme${NC}  - README dosyaları oluşturur"
    echo -e "                              ${BLUE}api${NC}     - API dokümantasyonu oluşturur"
    echo -e "                              ${BLUE}phpdoc${NC}  - PHP sınıf dokümantasyonu oluşturur"
    echo -e "                              ${BLUE}jsdoc${NC}   - JavaScript dokümantasyonu oluşturur"
    echo -e "                              ${BLUE}all${NC}     - Tüm dokümantasyon tiplerini oluşturur (varsayılan)"
    echo -e "  ${YELLOW}-o, --output <dizin>${NC}      Çıktı dizini (varsayılan: ./docs)"
    echo -e "  ${YELLOW}-s, --source <desen>${NC}      Kaynak projeleri regex ile belirle"
    echo -e "  ${YELLOW}--templates <dizin>${NC}       Şablon dizini (varsayılan: ./templates)"
    echo -e "  ${YELLOW}--format <format>${NC}         Çıktı formatı (markdown, html, gitbook, pdf)"
    echo -e "  ${YELLOW}--pdf${NC}                     PDF dosyaları da oluştur"
    echo -e "  ${YELLOW}--website${NC}                 Statik web sitesi oluştur"
    echo -e "  ${YELLOW}--site-prefix <url>${NC}       Web sitesi URL öneki"
    echo -e "  ${YELLOW}--exclude <desen>${NC}         Belirtilen desene uyan dosyaları hariç tut"
    echo -e "  ${YELLOW}--no-toc${NC}                  İçindekiler tablosunu oluşturma"
    echo -e "  ${YELLOW}--screenshots${NC}             Ekran görüntüleri ekle (varsa)"
    echo -e "  ${YELLOW}--graph${NC}                   Sınıf/Modül ilişki grafiğini oluştur"
    echo -e "  ${YELLOW}--force${NC}                   Mevcut dosyaların üzerine yaz"
    echo -e "  ${YELLOW}--verbose${NC}                 Ayrıntılı çıktı göster"
    echo
    echo -e "Örnekler:"
    echo -e "  ${GREEN}./generate_docs.sh --type readme proje1 proje2${NC}"
    echo -e "  ${GREEN}./generate_docs.sh --type api --source \"^api\" --output ./apidocs${NC}"
    echo -e "  ${GREEN}./generate_docs.sh --type all --website --site-prefix \"https://docs.example.com/\"${NC}"
    echo
    exit 0
}

# Parametreleri işle
while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)
            show_help
            ;;
        -t|--type)
            if [[ $# -gt 1 ]]; then
                case "$2" in
                    readme|api|phpdoc|jsdoc|all)
                        DOC_TYPE="$2"
                        shift 2
                        ;;
                    *)
                        echo -e "${RED}Hata: Geçersiz dokümantasyon tipi '$2'. Desteklenen tipler: readme, api, phpdoc, jsdoc, all${NC}"
                        exit 1
                        ;;
                esac
            else
                echo -e "${RED}Hata: --type için değer belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        -o|--output)
            if [[ $# -gt 1 ]]; then
                OUTPUT_DIR="$2"
                shift 2
            else
                echo -e "${RED}Hata: --output için dizin belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        -s|--source)
            if [[ $# -gt 1 ]]; then
                PROJECT_REGEX="$2"
                shift 2
            else
                echo -e "${RED}Hata: --source için desen belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --templates)
            if [[ $# -gt 1 ]]; then
                TEMPLATES_DIR="$2"
                shift 2
            else
                echo -e "${RED}Hata: --templates için dizin belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --format)
            if [[ $# -gt 1 ]]; then
                case "$2" in
                    markdown|html|gitbook|pdf)
                        FORMAT="$2"
                        shift 2
                        ;;
                    *)
                        echo -e "${RED}Hata: Geçersiz format '$2'. Desteklenen formatlar: markdown, html, gitbook, pdf${NC}"
                        exit 1
                        ;;
                esac
            else
                echo -e "${RED}Hata: --format için değer belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --pdf)
            CREATE_PDF=true
            shift
            ;;
        --website)
            CREATE_WEBSITE=true
            FORMAT="html"
            shift
            ;;
        --site-prefix)
            if [[ $# -gt 1 ]]; then
                SITE_PREFIX="$2"
                shift 2
            else
                echo -e "${RED}Hata: --site-prefix için URL belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --exclude)
            if [[ $# -gt 1 ]]; then
                EXCLUDE_PATTERNS="$2"
                shift 2
            else
                echo -e "${RED}Hata: --exclude için desen belirtilmedi.${NC}"
                exit 1
            fi
            ;;
        --no-toc)
            INCLUDE_TOC=false
            shift
            ;;
        --screenshots)
            INCLUDE_SCREENSHOTS=true
            shift
            ;;
        --graph)
            GENERATE_GRAPH=true
            shift
            ;;
        --force)
            FORCE=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        -*)
            echo -e "${RED}Hata: Bilinmeyen seçenek: $1${NC}"
            exit 1
            ;;
        *)
            # Proje adlarını bir diziye ekle
            PROJECTS+=("$1")
            shift
            ;;
    esac
done

# Kaynak dizini kontrol et
if [[ ! -d "$SOURCE_DIR" ]]; then
    echo -e "${RED}Hata: Kaynak dizin '$SOURCE_DIR' bulunamadı!${NC}"
    echo -e "${RED}Bu scripti Neo projesinin kök dizininden çalıştırın.${NC}"
    exit 1
fi

# Şablon dizinini kontrol et
if [[ ! -d "$TEMPLATES_DIR" ]]; then
    echo -e "${YELLOW}Uyarı: Şablon dizini '$TEMPLATES_DIR' bulunamadı. Varsayılan şablonlar kullanılacak.${NC}"
    # Temel şablonları oluştur
    mkdir -p "$TEMPLATES_DIR"

    # README şablonu
    cat > "$TEMPLATES_DIR/readme_template.md" << 'EOF'
# {PROJECT_NAME}

## Açıklama

{PROJECT_DESCRIPTION}

## Özellikler

- Özellik 1
- Özellik 2
- Özellik 3

## Kurulum

```bash
composer require {VENDOR}/{PACKAGE}
```

## Kullanım

```php
$example = new Example();
$example->run();
```

## Yapılandırma

```php
// Yapılandırma örneği
```

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.
EOF

    # API şablonu
    cat > "$TEMPLATES_DIR/api_template.md" << 'EOF'
# {PROJECT_NAME} API Dokümantasyonu

## Genel Bakış

{API_DESCRIPTION}

## Endpoints

### `GET /api/{ENDPOINT}`

**Açıklama:** {ENDPOINT_DESCRIPTION}

**Parametreler:**
- `param1`: Parametre açıklaması
- `param2`: Parametre açıklaması

**Yanıt:**
```json
{
  "example": "response"
}
```

## Hata Kodları

- `400`: Geçersiz istek
- `401`: Yetkilendirme hatası
- `404`: Kaynak bulunamadı
- `500`: Sunucu hatası
EOF

    echo -e "${GREEN}Varsayılan şablonlar oluşturuldu.${NC}"
fi

# Çıktı dizinini oluştur
if [[ ! -d "$OUTPUT_DIR" ]]; then
    mkdir -p "$OUTPUT_DIR"
    echo -e "${GREEN}Çıktı dizini oluşturuldu: $OUTPUT_DIR${NC}"
elif [[ "$FORCE" != "true" ]]; then
    echo -e "${YELLOW}Çıktı dizini zaten var. Üzerine yazmak için --force seçeneğini kullanın.${NC}"
    echo -e "${YELLOW}İşlem durduruluyor...${NC}"
    exit 1
fi

# İşlenecek projeleri belirle
declare -a PROJECTS_TO_PROCESS

if [[ ${#PROJECTS[@]} -gt 0 ]]; then
    # Belirtilen projeleri işle
    for proj in "${PROJECTS[@]}"; do
        if [[ -d "$SOURCE_DIR/$proj" ]]; then
            PROJECTS_TO_PROCESS+=("$proj")
        else
            echo -e "${RED}Uyarı: '$proj' projesi bulunamadı, atlanıyor.${NC}"
        fi
    done
elif [[ -n "$PROJECT_REGEX" ]]; then
    # Regex ile eşleşen projeleri işle
    while IFS= read -r -d '' dir; do
        proj=$(basename "$dir")
        if [[ "$proj" =~ $PROJECT_REGEX ]]; then
            PROJECTS_TO_PROCESS+=("$proj")
        fi
    done < <(find "$SOURCE_DIR" -maxdepth 1 -type d -not -path "$SOURCE_DIR" -print0 | sort -z)
else
    # Tüm projeleri işle
    while IFS= read -r -d '' dir; do
        proj=$(basename "$dir")
        PROJECTS_TO_PROCESS+=("$proj")
    done < <(find "$SOURCE_DIR" -maxdepth 1 -type d -not -path "$SOURCE_DIR" -print0 | sort -z)
fi

# İşlenecek proje sayısını göster
echo -e "${BLUE}Dokümantasyon türü: ${NC}$DOC_TYPE"
echo -e "${BLUE}Çıktı dizini: ${NC}$OUTPUT_DIR"
echo -e "${BLUE}Çıktı formatı: ${NC}$FORMAT"
echo -e "${BLUE}Toplam ${#PROJECTS_TO_PROCESS[@]} proje işlenecek.${NC}"
echo

# README oluşturma fonksiyonu
generate_readme() {
    local project="$1"
    local output_dir="$2"

    echo -e "${YELLOW}$project için README oluşturuluyor...${NC}"

    # Proje bilgilerini topla
    local project_dir="$SOURCE_DIR/$project"
    local composer_file="$project_dir/composer.json"
    local description=""
    local vendor=""
    local package=""

    if [[ -f "$composer_file" ]]; then
        if command -v jq &> /dev/null; then
            description=$(jq -r '.description // "Bu proje için bir açıklama eklenmemiş."' "$composer_file")
            vendor=$(jq -r '.name // ""' "$composer_file" | cut -d "/" -f 1)
            package=$(jq -r '.name // ""' "$composer_file" | cut -d "/" -f 2)
        else
            # jq yoksa grep ve sed ile basit bir çözüm
            description=$(grep '"description"' "$composer_file" | head -1 | sed 's/.*"description": *"\(.*\)",/\1/')
            name=$(grep '"name"' "$composer_file" | head -1 | sed 's/.*"name": *"\(.*\)",/\1/')
            vendor=$(echo "$name" | cut -d "/" -f 1)
            package=$(echo "$name" | cut -d "/" -f 2)
        fi
    else
        description="Bu proje için bir açıklama eklenmemiş."
        vendor="vendor"
        package="$project"
    fi

    # README şablonunu kullan
    local template="$TEMPLATES_DIR/readme_template.md"
    local output_file="$output_dir/$project/README.md"

    # Çıktı dizinini oluştur
    mkdir -p "$output_dir/$project"

    # Şablonu doldur
    cat "$template" | \
    sed "s/{PROJECT_NAME}/$project/g" | \
    sed "s/{PROJECT_DESCRIPTION}/$description/g" | \
    sed "s/{VENDOR}/$vendor/g" | \
    sed "s/{PACKAGE}/$package/g" \
    > "$output_file"

    echo -e "${GREEN}README oluşturuldu: $output_file${NC}"
}

# API dokümantasyonu oluşturma fonksiyonu
generate_api_docs() {
    local project="$1"
    local output_dir="$2"

    echo -e "${YELLOW}$project için API dokümantasyonu oluşturuluyor...${NC}"

    # Proje API dosyalarını bul
    local project_dir="$SOURCE_DIR/$project"
    local api_controllers_dir="$project_dir/src/Http/Controllers/Api"

    if [[ ! -d "$api_controllers_dir" ]]; then
        echo -e "${YELLOW}API kontrolcü dizini bulunamadı: $api_controllers_dir. Bu proje atlanıyor.${NC}"
        return
    fi

    # Çıktı dizinini oluştur
    local output_subdir="$output_dir/$project/api"
    mkdir -p "$output_subdir"

    # API genel bakış sayfasını oluştur
    local template="$TEMPLATES_DIR/api_template.md"
    local output_index="$output_subdir/index.md"

    # Şablonu doldur
    cat "$template" | \
    sed "s/{PROJECT_NAME}/$project/g" | \
    sed "s/{API_DESCRIPTION}/Bu API, $project projesi için geliştirilmiştir./g" | \
    sed "s/{ENDPOINT}/endpoints/g" | \
    sed "s/{ENDPOINT_DESCRIPTION}/Endpoint açıklaması/g" \
    > "$output_index"

    # Kontrolcüleri işle
    local controllers_found=0

    while IFS= read -r -d '' controller_file; do
        ((controllers_found++))

        # Kontrolcü adını al
        local controller_name=$(basename "$controller_file" .php)

        # Dosyadan endpoint bilgilerini çıkar (basit bir yaklaşım)
        local endpoints=$(grep -E "function [a-zA-Z0-9_]+\(" "$controller_file" | sed 's/.*function \([a-zA-Z0-9_]\+\).*/\1/')

        # Kontrolcü dokümantasyonunu oluştur
        local controller_doc="$output_subdir/${controller_name}.md"

        echo "# $controller_name" > "$controller_doc"
        echo >> "$controller_doc"
        echo "Bu kontrolcü, $project projesinin API endpointlerini içerir." >> "$controller_doc"
        echo >> "$controller_doc"
        echo "## Endpointler" >> "$controller_doc"
        echo >> "$controller_doc"

        # Her endpoint için bilgi ekle
        while read -r endpoint; do
            echo "### \`$endpoint\`" >> "$controller_doc"
            echo >> "$controller_doc"
            echo "**Açıklama:** Bu endpoint için açıklama." >> "$controller_doc"
            echo >> "$controller_doc"
            echo "**Parametreler:**" >> "$controller_doc"
            echo "- Parametre bilgileri" >> "$controller_doc"
            echo >> "$controller_doc"
            echo "**Yanıt:**" >> "$controller_doc"
            echo "\`\`\`json" >> "$controller_doc"
            echo "{" >> "$controller_doc"
            echo "  \"success\": true" >> "$controller_doc"
            echo "}" >> "$controller_doc"
            echo "\`\`\`" >> "$controller_doc"
            echo >> "$controller_doc"
        done <<< "$endpoints"

        echo -e "${GREEN}Kontrolcü dokümantasyonu oluşturuldu: $controller_doc${NC}"
    done < <(find "$api_controllers_dir" -name "*.php" -type f -print0)

    if [[ $controllers_found -eq 0 ]]; then
        echo -e "${YELLOW}API kontrolcü dosyası bulunamadı. Örnek bir API dokümantasyonu oluşturuluyor.${NC}"
    else
        echo -e "${GREEN}Toplam $controllers_found API kontrolcü dokümantasyonu oluşturuldu.${NC}"
    fi
}

# PHP dokümantasyonu oluşturma fonksiyonu
generate_php_docs() {
    local project="$1"
    local output_dir="$2"

    echo -e "${YELLOW}$project için PHP sınıf dokümantasyonu oluşturuluyor...${NC}"

    # Proje kaynak dizinini bul
    local project_dir="$SOURCE_DIR/$project"
    local src_dir="$project_dir/src"

    if [[ ! -d "$src_dir" ]]; then
        echo -e "${YELLOW}Kaynak dizini bulunamadı: $src_dir. Bu proje atlanıyor.${NC}"
        return
    fi

    # Çıktı dizinini oluştur
    local output_subdir="$output_dir/$project/phpdoc"
    mkdir -p "$output_subdir"

    # phpDocumentor veya benzer bir araç var mı kontrol et
    if command -v phpDocumentor &> /dev/null; then
        phpDocumentor --directory "$src_dir" --target "$output_subdir" --title "$project PHP Dokümantasyonu" > /dev/null 2>&1

        if [[ $? -eq 0 ]]; then
            echo -e "${GREEN}PHP dokümantasyonu oluşturuldu: $output_subdir${NC}"
        else
            echo -e "${RED}phpDocumentor çalıştırılırken hata oluştu.${NC}"
        fi
    else
        echo -e "${YELLOW}phpDocumentor bulunamadı. Manuel PHP dokümantasyonu oluşturuluyor.${NC}"

        # Basit bir PHP sınıf dokümantasyonu oluştur
        local output_index="$output_subdir/index.md"

        echo "# $project PHP Sınıf Dokümantasyonu" > "$output_index"
        echo >> "$output_index"
        echo "Bu dokümantasyon, $project projesinin PHP sınıflarını içerir." >> "$output_index"
        echo >> "$output_index"
        echo "## Sınıflar" >> "$output_index"
        echo >> "$output_index"

        # Sınıfları bul ve listele
        local classes_found=0

        while IFS= read -r -d '' php_file; do
            # Sınıf adını dosya yolundan çıkar
            local rel_path="${php_file#$src_dir/}"
            local class_name=$(basename "$php_file" .php)

            # Namespace'i çıkar
            local namespace=$(grep -E "^namespace" "$php_file" | head -1 | sed 's/namespace \(.*\);/\1/')

            ((classes_found++))

            echo "- [$class_name]($class_name.md) - \`$namespace\\$class_name\`" >> "$output_index"

            # Sınıf dokümantasyonu oluştur
            local class_doc="$output_subdir/${class_name}.md"

            echo "# $class_name" > "$class_doc"
            echo >> "$class_doc"
            echo "**Namespace:** \`$namespace\`" >> "$class_doc"
            echo >> "$class_doc"

            # Sınıf açıklamasını çıkar (DocBlock yorumundan)
            local class_description=$(grep -A 5 -E "\/\*\*" "$php_file" | grep -E " \* [^@]" | head -1 | sed 's/ \* \(.*\)/\1/')

            if [[ -n "$class_description" ]]; then
                echo "$class_description" >> "$class_doc"
                echo >> "$class_doc"
            else
                echo "Bu sınıf için bir açıklama eklenmemiş." >> "$class_doc"
                echo >> "$class_doc"
            fi

            # Metodları listele
            echo "## Metodlar" >> "$class_doc"
            echo >> "$class_doc"

            local methods=$(grep -E "function [a-zA-Z0-9_]+\(" "$php_file" | sed 's/.*function \([a-zA-Z0-9_]\+\).*/\1/')

            if [[ -n "$methods" ]]; then
                while read -r method; do
                    echo "### $method()" >> "$class_doc"
                    echo >> "$class_doc"
                    echo "Metod açıklaması." >> "$class_doc"
                    echo >> "$class_doc"
                    echo "**Parametreler:**" >> "$class_doc"
                    echo "- Parametre bilgileri" >> "$class_doc"
                    echo >> "$class_doc"
                    echo "**Dönüş Değeri:**" >> "$class_doc"
                    echo "Dönüş değeri açıklaması." >> "$class_doc"
                    echo >> "$class_doc"
                done <<< "$methods"
            else
                echo "Bu sınıfta metod bulunamadı." >> "$class_doc"
            fi
        done < <(find "$src_dir" -name "*.php" -type f -print0)

        if [[ $classes_found -eq 0 ]]; then
            echo -e "${YELLOW}PHP sınıf dosyası bulunamadı.${NC}"
        else
            echo -e "${GREEN}Toplam $classes_found PHP sınıf dokümantasyonu oluşturuldu.${NC}"
        fi
    fi
}

# JavaScript dokümantasyonu oluşturma fonksiyonu
generate_js_docs() {
    local project="$1"
    local output_dir="$2"

    echo -e "${YELLOW}$project için JavaScript dokümantasyonu oluşturuluyor...${NC}"

    # Proje JavaScript dizinini bul
    local project_dir="$SOURCE_DIR/$project"
    local js_dir="$project_dir/resources/js"

    if [[ ! -d "$js_dir" ]]; then
        echo -e "${YELLOW}JavaScript dizini bulunamadı: $js_dir. Bu proje atlanıyor.${NC}"
        return
    fi

    # Çıktı dizinini oluştur
    local output_subdir="$output_dir/$project/jsdoc"
    mkdir -p "$output_subdir"

    # JSDoc veya benzer bir araç var mı kontrol et
    if command -v jsdoc &> /dev/null; then
        jsdoc "$js_dir" -d "$output_subdir" -r > /dev/null 2>&1

        if [[ $? -eq 0 ]]; then
            echo -e "${GREEN}JavaScript dokümantasyonu oluşturuldu: $output_subdir${NC}"
        else
            echo -e "${RED}JSDoc çalıştırılırken hata oluştu.${NC}"
        fi
    else
        echo -e "${YELLOW}JSDoc bulunamadı. Manuel JavaScript dokümantasyonu oluşturuluyor.${NC}"

        # Basit bir JavaScript dokümantasyonu oluştur
        local output_index="$output_subdir/index.md"

        echo "# $project JavaScript Dokümantasyonu" > "$output_index"
        echo >> "$output_index"
        echo "Bu dokümantasyon, $project projesinin JavaScript kodlarını içerir." >> "$output_index"
        echo >> "$output_index"
        echo "## Modüller" >> "$output_index"
        echo >> "$output_index"

        # JavaScript dosyalarını bul
        local js_files_found=0

        while IFS= read -r -d '' js_file; do
            # Dosya adını al
            local rel_path="${js_file#$js_dir/}"
            local js_name=$(basename "$js_file" .js)

            ((js_files_found++))

            echo "- [$js_name]($js_name.md) - \`$rel_path\`" >> "$output_index"

            # Dosya dokümantasyonu oluştur
            local js_doc="$output_subdir/${js_name}.md"

            echo "# $js_name" > "$js_doc"
            echo >> "$js_doc"
            echo "**Dosya Yolu:** \`$rel_path\`" >> "$js_doc"
            echo >> "$js_doc"

            # Fonksiyonları ve sınıfları çıkar
            echo "## İçerik" >> "$js_doc"
            echo >> "$js_doc"

            # Fonksiyonları bul
            local functions=$(grep -E "function [a-zA-Z0-9_]+\(" "$js_file" | sed 's/.*function \([a-zA-Z0-9_]\+\).*/\1/' || true)

            if [[ -n "$functions" ]]; then
                echo "### Fonksiyonlar" >> "$js_doc"
                echo >> "$js_doc"

                while read -r func; do
                    echo "#### $func()" >> "$js_doc"
                    echo >> "$js_doc"
                    echo "Fonksiyon açıklaması." >> "$js_doc"
                    echo >> "$js_doc"
                    echo "**Parametreler:**" >> "$js_doc"
                    echo "- Parametre bilgileri" >> "$js_doc"
                    echo >> "$js_doc"
                    echo "**Dönüş Değeri:**" >> "$js_doc"
                    echo "Dönüş değeri açıklaması." >> "$js_doc"
                    echo >> "$js_doc"
                done <<< "$functions"
            fi

            # Sınıfları bul
            local classes=$(grep -E "class [a-zA-Z0-9_]+" "$js_file" | sed 's/.*class \([a-zA-Z0-9_]\+\).*/\1/' || true)

            if [[ -n "$classes" ]]; then
                echo "### Sınıflar" >> "$js_doc"
                echo >> "$js_doc"

                while read -r class; do
                    echo "#### $class" >> "$js_doc"
                    echo >> "$js_doc"
                    echo "Sınıf açıklaması." >> "$js_doc"
                    echo >> "$js_doc"
                    echo "**Metodlar:**" >> "$js_doc"
                    echo "- Metod bilgileri" >> "$js_doc"
                    echo >> "$js_doc"
                done <<< "$classes"
            fi

            if [[ -z "$functions" && -z "$classes" ]]; then
                echo "Bu dosyada fonksiyon veya sınıf bulunamadı." >> "$js_doc"
            fi
        done < <(find "$js_dir" -name "*.js" -type f -print0)

        if [[ $js_files_found -eq 0 ]]; then
            echo -e "${YELLOW}JavaScript dosyası bulunamadı.${NC}"
        else
            echo -e "${GREEN}Toplam $js_files_found JavaScript dosya dokümantasyonu oluşturuldu.${NC}"
        fi
    fi
}

# HTML formatına dönüştürme fonksiyonu
convert_to_html() {
    local project="$1"
    local output_dir="$2"

    echo -e "${YELLOW}$project için dokümanları HTML formatına dönüştürülüyor...${NC}"

    # Pandoc kurulu mu kontrol et
    if ! command -v pandoc &> /dev/null; then
        echo -e "${RED}Pandoc bulunamadı. HTML dönüşümü yapılamıyor.${NC}"
        return
    fi

    # Markdown dosyalarını bul ve HTML'e dönüştür
    local docs_processed=0

    while IFS= read -r -d '' md_file; do
        local html_file="${md_file%.md}.html"

        # HTML şablonu
        local html_header='<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>'$(basename "${md_file%.md}")'</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; max-width: 900px; margin: 0 auto; }
        h1, h2, h3, h4, h5, h6 { color: #333; }
        code { background-color: #f5f5f5; padding: 2px 5px; border-radius: 3px; }
        pre { background-color: #f5f5f5; padding: 15px; border-radius: 3px; overflow-x: auto; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background-color: #f2f2f2; }
        img { max-width: 100%; }
    </style>
</head>
<body>
'
        local html_footer='
</body>
</html>'

        # Markdown'ı HTML'e dönüştür
        pandoc -f markdown -t html "$md_file" -o "$html_file" --standalone --metadata title="$(basename "${md_file%.md}")"

        # HTML dosyası oluşturulduysa başlık ve alt bilgiyi ekle
        if [[ -f "$html_file" ]]; then
            # Geçici olarak içeriği sakla
            local html_content=$(cat "$html_file")

            # Şablonu uygula
            echo "$html_header" > "$html_file"
            echo "$html_content" >> "$html_file"
            echo "$html_footer" >> "$html_file"

            ((docs_processed++))
        fi
    done < <(find "$output_dir/$project" -name "*.md" -type f -print0)

    echo -e "${GREEN}Toplam $docs_processed doküman HTML formatına dönüştürüldü.${NC}"
}

# Statik web sitesi oluşturma fonksiyonu
generate_website() {
    local output_dir="$1"

    echo -e "${YELLOW}Statik web sitesi oluşturuluyor...${NC}"

    # Üst seviye index sayfası oluştur
    local index_file="$output_dir/index.html"

    cat > "$index_file" << EOF
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neo Projeleri Dokümantasyonu</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; max-width: 900px; margin: 0 auto; }
        h1, h2, h3, h4, h5, h6 { color: #333; }
        .project-list { display: flex; flex-wrap: wrap; gap: 20px; }
        .project-card { border: 1px solid #ddd; border-radius: 5px; padding: 15px; width: 250px; }
        .project-card h3 { margin-top: 0; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Neo Projeleri Dokümantasyonu</h1>
    <p>Bu site, Neo projelerinin dokümantasyonunu içerir.</p>

    <h2>Projeler</h2>
    <div class="project-list">
EOF

    # Projeleri listele
    for project_dir in "$output_dir"/*; do
        if [[ -d "$project_dir" && $(basename "$project_dir") != "assets" ]]; then
            local project=$(basename "$project_dir")

            cat >> "$index_file" << EOF
        <div class="project-card">
            <h3><a href="$project/index.html">$project</a></h3>
            <p>
EOF

            # Dokümantasyon türlerini listele
            if [[ -f "$project_dir/README.md" || -f "$project_dir/README.html" ]]; then
                echo "                <a href=\"$project/README.html\">README</a><br>" >> "$index_file"
            fi

            if [[ -d "$project_dir/api" ]]; then
                echo "                <a href=\"$project/api/index.html\">API Dokümantasyonu</a><br>" >> "$index_file"
            fi

            if [[ -d "$project_dir/phpdoc" ]]; then
                echo "                <a href=\"$project/phpdoc/index.html\">PHP Dokümantasyonu</a><br>" >> "$index_file"
            fi

            if [[ -d "$project_dir/jsdoc" ]]; then
                echo "                <a href=\"$project/jsdoc/index.html\">JavaScript Dokümantasyonu</a><br>" >> "$index_file"
            fi

            cat >> "$index_file" << EOF
            </p>
        </div>
EOF
        fi
    done

    cat >> "$index_file" << EOF
    </div>

    <footer>
        <hr>
        <p>Son güncelleme: $(date)</p>
    </footer>
</body>
</html>
EOF

    echo -e "${GREEN}Statik web sitesi oluşturuldu: $index_file${NC}"
}

# PDF oluşturma fonksiyonu
generate_pdf() {
    local project="$1"
    local output_dir="$2"

    echo -e "${YELLOW}$project için PDF dosyaları oluşturuluyor...${NC}"

    # wkhtmltopdf kurulu mu kontrol et
    if ! command -v wkhtmltopdf &> /dev/null; then
        echo -e "${RED}wkhtmltopdf bulunamadı. PDF dönüşümü yapılamıyor.${NC}"
        return
    fi

    # HTML dosyalarını bul ve PDF'e dönüştür
    local pdfs_created=0

    while IFS= read -r -d '' html_file; do
        local pdf_file="${html_file%.html}.pdf"

        wkhtmltopdf "$html_file" "$pdf_file" > /dev/null 2>&1

        if [[ -f "$pdf_file" ]]; then
            ((pdfs_created++))
        fi
    done < <(find "$output_dir/$project" -name "*.html" -type f -print0)

    echo -e "${GREEN}Toplam $pdfs_created PDF dosyası oluşturuldu.${NC}"
}

# İlişki grafiği oluşturma fonksiyonu
generate_relationship_graph() {
    local project="$1"
    local output_dir="$2"

    echo -e "${YELLOW}$project için ilişki grafiği oluşturuluyor...${NC}"

    # dot (Graphviz) kurulu mu kontrol et
    if ! command -v dot &> /dev/null; then
        echo -e "${RED}Graphviz bulunamadı. İlişki grafiği oluşturulamıyor.${NC}"
        return
    fi

    # Çıktı dizinini oluştur
    local output_subdir="$output_dir/$project/graphs"
    mkdir -p "$output_subdir"

    # DOT dosyası oluştur
    local dot_file="$output_subdir/relationships.dot"
    local png_file="$output_subdir/relationships.png"

    echo "digraph G {" > "$dot_file"
    echo "  rankdir=LR;" >> "$dot_file"
    echo "  node [shape=box, style=filled, fillcolor=lightblue];" >> "$dot_file"

    # Sınıfları bul ve ilişkileri çıkar
    local project_dir="$SOURCE_DIR/$project"
    local src_dir="$project_dir/src"

    if [[ ! -d "$src_dir" ]]; then
        echo -e "${YELLOW}Kaynak dizini bulunamadı: $src_dir. Grafik oluşturulamıyor.${NC}"
        return
    fi

    # Sınıfları ve ilişkileri çıkar
    local classes=""
    local relationships=""

    while IFS= read -r -d '' php_file; do
        local class_name=$(basename "$php_file" .php)

        classes="$classes  \"$class_name\";\n"

        # PHP sınıfında kullanılan diğer sınıfları bul
        local deps=$(grep -E "(use|extends|implements) [A-Za-z0-9\\\]+" "$php_file" | \
                    sed -E 's/.*[ \t](use|extends|implements) +([A-Za-z0-9\\]+).*/\2/' | \
                    grep -v "^use" | grep -v ";" | \
                    awk -F"\\\\" '{print $NF}' || true)

        if [[ -n "$deps" ]]; then
            while read -r dep; do
                if [[ -n "$dep" ]]; then
                    relationships="$relationships  \"$class_name\" -> \"$dep\";\n"
                fi
            done <<< "$deps"
        fi
    done < <(find "$src_dir" -name "*.php" -type f -print0)

    echo -e "$classes" >> "$dot_file"
    echo -e "$relationships" >> "$dot_file"
    echo "}" >> "$dot_file"

    # DOT dosyasını PNG'ye dönüştür
    dot -Tpng "$dot_file" -o "$png_file"

    if [[ -f "$png_file" ]]; then
        echo -e "${GREEN}İlişki grafiği oluşturuldu: $png_file${NC}"
    else
        echo -e "${RED}İlişki grafiği oluşturulamadı.${NC}"
    fi
}

# Projeler için dokümantasyon oluştur
for project in "${PROJECTS_TO_PROCESS[@]}"; do
    echo -e "\n${BLUE}[$project] için dokümantasyon oluşturuluyor...${NC}"

    # Proje dizini oluştur
    mkdir -p "$OUTPUT_DIR/$project"

    # Dokümantasyon tipine göre işlem yap
    if [[ "$DOC_TYPE" == "readme" || "$DOC_TYPE" == "all" ]]; then
        generate_readme "$project" "$OUTPUT_DIR"
    fi

    if [[ "$DOC_TYPE" == "api" || "$DOC_TYPE" == "all" ]]; then
        generate_api_docs "$project" "$OUTPUT_DIR"
    fi

    if [[ "$DOC_TYPE" == "phpdoc" || "$DOC_TYPE" == "all" ]]; then
        generate_php_docs "$project" "$OUTPUT_DIR"
    fi

    if [[ "$DOC_TYPE" == "jsdoc" || "$DOC_TYPE" == "all" ]]; then
        generate_js_docs "$project" "$OUTPUT_DIR"
    fi

    # Grafik oluştur (isteğe bağlı)
    if [[ "$GENERATE_GRAPH" == "true" ]]; then
        generate_relationship_graph "$project" "$OUTPUT_DIR"
    fi

    # HTML'e dönüştür
    if [[ "$FORMAT" == "html" ]]; then
        convert_to_html "$project" "$OUTPUT_DIR"
    fi

    # PDF oluştur (isteğe bağlı)
    if [[ "$CREATE_PDF" == "true" ]]; then
        generate_pdf "$project" "$OUTPUT_DIR"
    fi

    echo -e "${GREEN}[$project] için dokümantasyon tamamlandı.${NC}"
done

# Web sitesi oluştur (isteğe bağlı)
if [[ "$CREATE_WEBSITE" == "true" ]]; then
    generate_website "$OUTPUT_DIR"
fi

echo
echo -e "${GREEN}Tüm dokümantasyon işlemleri tamamlandı. Çıktı dizini: $OUTPUT_DIR${NC}"
echo -e "${GREEN}İşlem tarihi: $(date)${NC}"
