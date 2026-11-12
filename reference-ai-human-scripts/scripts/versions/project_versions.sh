#!/bin/bash

# project_versions.sh - Neo projelerinde git durumunu kontrol eder ve versiyon bilgilerini raporlar

# Banner göster
clear
echo "============================================================"
echo "               GİT DURUM KONTROL ARACI                      "
echo "============================================================"
echo

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Argümanları tanımla
SHOW_ALL=false
SHOW_MODIFIED=false
SHOW_UNPUSHED=false
SHOW_STAGED=false
SHOW_UNTRACKED=false
SHOW_BRANCHES=false
SHOW_RECENT=false
RECENT_COMMITS=5
OUTPUT_FORMAT="console"
OUTPUT_FILE=""
REGEX=""
SORT_BY="name"

# Yardım mesajı
function show_help {
    echo -e "${BLUE}Neo Git Durum Kontrol Aracı${NC}"
    echo
    echo "Bu script, Neo projesi içindeki tüm projelerin git durumunu kontrol eder."
    echo
    echo "Kullanım: ./project_versions.sh [seçenekler]"
    echo
    echo "Seçenekler:"
    echo "  -a, --all             Tüm git bilgilerini göster"
    echo "  -m, --modified        Değiştirilmiş dosyaları göster"
    echo "  -s, --staged          Stage edilmiş değişiklikleri göster"
    echo "  -u, --unpushed        Push edilmemiş commitleri göster"
    echo "  -n, --untracked       Takip edilmeyen dosyaları göster"
    echo "  -b, --branches        Dal (branch) bilgilerini göster"
    echo "  -r, --recent [n]      Son n adet commiti göster (varsayılan: 5)"
    echo "  --sort-name           İsme göre sırala (varsayılan)"
    echo "  --sort-date           En son commit tarihine göre sırala"
    echo "  --sort-changes        Değişiklik sayısına göre sırala"
    echo "  --regex \"<pattern>\"   Sadece belirtilen regex ile eşleşen projeleri kontrol et"
    echo "  -o, --output <dosya>  Sonuçları belirtilen dosyaya yaz"
    echo "  --format <format>     Çıktı formatı: console (varsayılan), markdown, csv"
    echo "  -h, --help            Bu yardım mesajını göster"
    echo
    echo "Örnekler:"
    echo "  ./project_versions.sh --all                     # Tüm git bilgilerini göster"
    echo "  ./project_versions.sh --modified --unpushed     # Değiştirilmiş ve push edilmemiş projeleri göster"
    echo "  ./project_versions.sh --recent 10               # Son 10 commiti göster"
    echo "  ./project_versions.sh --all --regex \"web.*\"     # web ile başlayan projelerin tüm git bilgilerini göster"
    echo "  ./project_versions.sh --all --format markdown -o git_report.md  # Markdown rapor oluştur"
    exit 0
}

# Parametreleri kontrol et
if [ $# -eq 0 ]; then
    show_help
fi

# Argümanları işle
while [ $# -gt 0 ]; do
    case "$1" in
        -h|--help)
            show_help
            ;;
        -a|--all)
            SHOW_ALL=true
            SHOW_MODIFIED=true
            SHOW_UNPUSHED=true
            SHOW_STAGED=true
            SHOW_UNTRACKED=true
            SHOW_BRANCHES=true
            SHOW_RECENT=true
            shift
            ;;
        -m|--modified)
            SHOW_MODIFIED=true
            shift
            ;;
        -s|--staged)
            SHOW_STAGED=true
            shift
            ;;
        -u|--unpushed)
            SHOW_UNPUSHED=true
            shift
            ;;
        -n|--untracked)
            SHOW_UNTRACKED=true
            shift
            ;;
        -b|--branches)
            SHOW_BRANCHES=true
            shift
            ;;
        -r|--recent)
            SHOW_RECENT=true
            if [[ $2 =~ ^[0-9]+$ ]]; then
                RECENT_COMMITS=$2
                shift
            fi
            shift
            ;;
        --sort-name)
            SORT_BY="name"
            shift
            ;;
        --sort-date)
            SORT_BY="date"
            shift
            ;;
        --sort-changes)
            SORT_BY="changes"
            shift
            ;;
        --regex)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --regex seçeneği için bir değer belirtilmedi.${NC}"
                exit 1
            fi
            REGEX="$2"
            shift 2
            ;;
        -o|--output)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --output seçeneği için bir dosya adı belirtilmedi.${NC}"
                exit 1
            fi
            OUTPUT_FILE="$2"
            shift 2
            ;;
        --format)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --format seçeneği için bir format belirtilmedi.${NC}"
                exit 1
            fi
            if [ "$2" != "console" ] && [ "$2" != "markdown" ] && [ "$2" != "csv" ]; then
                echo -e "${RED}Hata: Geçersiz format. Desteklenen formatlar: console, markdown, csv${NC}"
                exit 1
            fi
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        *)
            echo -e "${RED}Hata: Bilinmeyen parametre: $1${NC}"
            echo "Yardım için: ./project_versions.sh --help"
            exit 1
            ;;
    esac
done

# Hiçbir gösterge seçilmediyse, yardım göster
if [ "$SHOW_MODIFIED" = false ] && [ "$SHOW_UNPUSHED" = false ] && [ "$SHOW_STAGED" = false ] && [ "$SHOW_UNTRACKED" = false ] && [ "$SHOW_BRANCHES" = false ] && [ "$SHOW_RECENT" = false ]; then
    echo -e "${YELLOW}Uyarı: Hiçbir git durumu seçilmedi. Tüm durumları gösteriyorum.${NC}"
    SHOW_ALL=true
    SHOW_MODIFIED=true
    SHOW_UNPUSHED=true
    SHOW_STAGED=true
    SHOW_UNTRACKED=true
    SHOW_BRANCHES=true
    SHOW_RECENT=true
fi

# Proje dizinini tanımla
PROJECT_DIR="$(dirname "$0")/projects"

# Dizin var mı kontrol et
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Hata: 'projects' klasörü bulunamadı!${NC}"
    echo "Bu scripti Neo projesinin kök dizininden çalıştırın."
    exit 1
fi

# Çıktı fonksiyonları
output_begin() {
    if [ "$OUTPUT_FORMAT" = "markdown" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "# Neo Projeleri Git Durum Raporu" > "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo "Oluşturulma tarihi: $(date)" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo "# Neo Projeleri Git Durum Raporu"
            echo ""
            echo "Oluşturulma tarihi: $(date)"
            echo ""
        fi
    elif [ "$OUTPUT_FORMAT" = "csv" ]; then
        CSV_HEADER="Proje Adı,Git Repo,Dal,Son Commit,Son Commit Tarihi,Değişiklik Sayısı,Stage Edilen,Takip Edilmeyen,Push Edilmemiş"
        if [ -n "$OUTPUT_FILE" ]; then
            echo "$CSV_HEADER" > "$OUTPUT_FILE"
        else
            echo "$CSV_HEADER"
        fi
    else
        # Console formatı başlığı
        if [ -n "$OUTPUT_FILE" ]; then
            echo "============================================================" > "$OUTPUT_FILE"
            echo "               NEO PROJELERİ GİT DURUM RAPORU               " >> "$OUTPUT_FILE"
            echo "============================================================" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo "Oluşturulma tarihi: $(date)" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo "============================================================"
            echo "               NEO PROJELERİ GİT DURUM RAPORU               "
            echo "============================================================"
            echo ""
            echo "Oluşturulma tarihi: $(date)"
            echo ""
        fi
    fi
}

output_section() {
    local section_title="$1"

    if [ "$OUTPUT_FORMAT" = "markdown" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "## $section_title" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo "## $section_title"
            echo ""
        fi
    elif [ "$OUTPUT_FORMAT" = "console" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "------------------------------------------------------------" >> "$OUTPUT_FILE"
            echo "$section_title" >> "$OUTPUT_FILE"
            echo "------------------------------------------------------------" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo "------------------------------------------------------------"
            echo "$section_title"
            echo "------------------------------------------------------------"
            echo ""
        fi
    fi
    # CSV formatında section başlığı olmaz
}

output_project_begin() {
    local project_name="$1"
    local git_status="$2"
    local current_branch="$3"
    local last_commit="$4"
    local last_commit_date="$5"
    local changes_count="$6"
    local staged_count="$7"
    local untracked_count="$8"
    local unpushed_count="$9"

    if [ "$OUTPUT_FORMAT" = "markdown" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "### $project_name" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo "- **Git Durumu:** $git_status" >> "$OUTPUT_FILE"
            echo "- **Aktif Dal:** $current_branch" >> "$OUTPUT_FILE"
            echo "- **Son Commit:** $last_commit" >> "$OUTPUT_FILE"
            echo "- **Son Commit Tarihi:** $last_commit_date" >> "$OUTPUT_FILE"
            echo "- **Değişiklik Sayısı:** $changes_count" >> "$OUTPUT_FILE"
            echo "- **Stage Edilen:** $staged_count" >> "$OUTPUT_FILE"
            echo "- **Takip Edilmeyen:** $untracked_count" >> "$OUTPUT_FILE"
            echo "- **Push Edilmemiş:** $unpushed_count" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo "### $project_name"
            echo ""
            echo "- **Git Durumu:** $git_status"
            echo "- **Aktif Dal:** $current_branch"
            echo "- **Son Commit:** $last_commit"
            echo "- **Son Commit Tarihi:** $last_commit_date"
            echo "- **Değişiklik Sayısı:** $changes_count"
            echo "- **Stage Edilen:** $staged_count"
            echo "- **Takip Edilmeyen:** $untracked_count"
            echo "- **Push Edilmemiş:** $unpushed_count"
            echo ""
        fi
    elif [ "$OUTPUT_FORMAT" = "csv" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "\"$project_name\",\"$git_status\",\"$current_branch\",\"$last_commit\",\"$last_commit_date\",$changes_count,$staged_count,$untracked_count,$unpushed_count" >> "$OUTPUT_FILE"
        else
            echo "\"$project_name\",\"$git_status\",\"$current_branch\",\"$last_commit\",\"$last_commit_date\",$changes_count,$staged_count,$untracked_count,$unpushed_count"
        fi
    else
        # Console formatı
        if [ -n "$OUTPUT_FILE" ]; then
            echo "=== $project_name ===" >> "$OUTPUT_FILE"
            echo "Git Durumu: $git_status" >> "$OUTPUT_FILE"
            echo "Aktif Dal: $current_branch" >> "$OUTPUT_FILE"
            echo "Son Commit: $last_commit" >> "$OUTPUT_FILE"
            echo "Son Commit Tarihi: $last_commit_date" >> "$OUTPUT_FILE"
            echo "Değişiklik Sayısı: $changes_count" >> "$OUTPUT_FILE"
            echo "Stage Edilen: $staged_count" >> "$OUTPUT_FILE"
            echo "Takip Edilmeyen: $untracked_count" >> "$OUTPUT_FILE"
            echo "Push Edilmemiş: $unpushed_count" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo -e "${CYAN}=== $project_name ===${NC}"
            echo -e "Git Durumu: $git_status"
            echo -e "Aktif Dal: $current_branch"
            echo -e "Son Commit: $last_commit"
            echo -e "Son Commit Tarihi: $last_commit_date"
            echo -e "Değişiklik Sayısı: $changes_count"
            echo -e "Stage Edilen: $staged_count"
            echo -e "Takip Edilmeyen: $untracked_count"
            echo -e "Push Edilmemiş: $unpushed_count"
            echo ""
        fi
    fi
}

output_sub_section() {
    local title="$1"
    local content="$2"

    if [ "$OUTPUT_FORMAT" = "markdown" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "#### $title" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo '```' >> "$OUTPUT_FILE"
            echo "$content" >> "$OUTPUT_FILE"
            echo '```' >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo "#### $title"
            echo ""
            echo '```'
            echo "$content"
            echo '```'
            echo ""
        fi
    elif [ "$OUTPUT_FORMAT" = "console" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "--- $title ---" >> "$OUTPUT_FILE"
            echo "$content" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo -e "${YELLOW}--- $title ---${NC}"
            echo "$content"
            echo ""
        fi
    fi
    # CSV formatında alt bölümler yok
}

output_summary() {
    local total_projects="$1"
    local git_projects="$2"
    local modified_projects="$3"
    local clean_projects="$4"
    local unpushed_projects="$5"

    if [ "$OUTPUT_FORMAT" = "markdown" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "## Özet" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo "- **Toplam Proje Sayısı:** $total_projects" >> "$OUTPUT_FILE"
            echo "- **Git Projeleri:** $git_projects" >> "$OUTPUT_FILE"
            echo "- **Değişiklik İçeren Projeler:** $modified_projects" >> "$OUTPUT_FILE"
            echo "- **Temiz Projeler:** $clean_projects" >> "$OUTPUT_FILE"
            echo "- **Push Edilmemiş Commit İçeren Projeler:** $unpushed_projects" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo "## Özet"
            echo ""
            echo "- **Toplam Proje Sayısı:** $total_projects"
            echo "- **Git Projeleri:** $git_projects"
            echo "- **Değişiklik İçeren Projeler:** $modified_projects"
            echo "- **Temiz Projeler:** $clean_projects"
            echo "- **Push Edilmemiş Commit İçeren Projeler:** $unpushed_projects"
            echo ""
        fi
    elif [ "$OUTPUT_FORMAT" = "csv" ]; then
        if [ -n "$OUTPUT_FILE" ]; then
            echo "\"ÖZET\",\"Toplam: $total_projects\",\"Git: $git_projects\",\"Değişiklik: $modified_projects\",\"Temiz: $clean_projects\",\"Push Edilmemiş: $unpushed_projects\",,," >> "$OUTPUT_FILE"
        else
            echo "\"ÖZET\",\"Toplam: $total_projects\",\"Git: $git_projects\",\"Değişiklik: $modified_projects\",\"Temiz: $clean_projects\",\"Push Edilmemiş: $unpushed_projects\",,,"
        fi
    else
        # Console formatı
        if [ -n "$OUTPUT_FILE" ]; then
            echo "============================================================" >> "$OUTPUT_FILE"
            echo "                         ÖZET                               " >> "$OUTPUT_FILE"
            echo "============================================================" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
            echo "Toplam Proje Sayısı: $total_projects" >> "$OUTPUT_FILE"
            echo "Git Projeleri: $git_projects" >> "$OUTPUT_FILE"
            echo "Değişiklik İçeren Projeler: $modified_projects" >> "$OUTPUT_FILE"
            echo "Temiz Projeler: $clean_projects" >> "$OUTPUT_FILE"
            echo "Push Edilmemiş Commit İçeren Projeler: $unpushed_projects" >> "$OUTPUT_FILE"
            echo "" >> "$OUTPUT_FILE"
        else
            echo "============================================================"
            echo "                         ÖZET                               "
            echo "============================================================"
            echo ""
            echo -e "Toplam Proje Sayısı: ${YELLOW}$total_projects${NC}"
            echo -e "Git Projeleri: ${YELLOW}$git_projects${NC}"
            echo -e "Değişiklik İçeren Projeler: ${YELLOW}$modified_projects${NC}"
            echo -e "Temiz Projeler: ${YELLOW}$clean_projects${NC}"
            echo -e "Push Edilmemiş Commit İçeren Projeler: ${YELLOW}$unpushed_projects${NC}"
            echo ""
        fi
    fi
}

# Başlangıç mesajı
echo -e "${GREEN}Git durum kontrolü başlatılıyor...${NC}"
echo "Taranacak dizin: $PROJECT_DIR"

if [ -n "$REGEX" ]; then
    echo -e "Sadece ${CYAN}'$REGEX'${NC} ile eşleşen projeler işlenecek."
fi

echo "Sıralama kriteri: $SORT_BY"
echo

# Projeler için geçici dosya
TEMP_FILE=$(mktemp)

# İlerleme göstergesi için toplam proje sayısı
if [ -n "$REGEX" ]; then
    TOTAL_PROJECTS=$(find "$PROJECT_DIR" -maxdepth 1 -type d -name "$REGEX" | grep -v "^$PROJECT_DIR$" | wc -l)
else
    TOTAL_PROJECTS=$(find "$PROJECT_DIR" -maxdepth 1 -type d | grep -v "^$PROJECT_DIR$" | wc -l)
fi

COUNTER=0
GIT_PROJECTS=0
MODIFIED_PROJECTS=0
UNPUSHED_PROJECTS=0
CLEAN_PROJECTS=0

# Projeleri dolaş
cd "$PROJECT_DIR" || exit 1

echo -e "${CYAN}Projeler taranıyor...${NC}"
echo -ne "İşleniyor: 0/$TOTAL_PROJECTS"

find_command="find . -maxdepth 1 -type d"
if [ -n "$REGEX" ]; then
    find_command="$find_command -name \"$REGEX\""
fi
find_command="$find_command | grep -v \"^\.$\""

eval "$find_command" | while read -r project_dir; do
    project_name=$(basename "$project_dir")
    COUNTER=$((COUNTER + 1))

    # İlerleme göster
    echo -ne "\rİşleniyor: $COUNTER/$TOTAL_PROJECTS"

    # Git repo mu kontrol et
    if [ -d "$project_dir/.git" ]; then
        GIT_PROJECTS=$((GIT_PROJECTS + 1))

        # Projeye git
        cd "$project_dir" || continue

        # Git durumunu al
        git_status=$(git status -s)
        current_branch=$(git branch --show-current)
        last_commit=$(git log -1 --pretty=format:"%h: %s" 2>/dev/null || echo "Commit yok")
        last_commit_date=$(git log -1 --pretty=format:"%cd" --date=format:"%Y-%m-%d %H:%M" 2>/dev/null || echo "Tarih yok")
        last_commit_timestamp=$(git log -1 --pretty=format:"%ct" 2>/dev/null || echo "0")

        # Sayıları hesapla
        changes_count=$(git status -s | wc -l)
        staged_count=$(git diff --name-only --cached | wc -l)
        untracked_count=$(git ls-files --others --exclude-standard | wc -l)
        unpushed_count=$(git log @{u}.. 2>/dev/null | grep -c "^commit" || echo "0")

        # Push edilmeyen commit varsa, projeler listesine ekle
        if [ "$unpushed_count" -gt 0 ]; then
            UNPUSHED_PROJECTS=$((UNPUSHED_PROJECTS + 1))
        fi

        # Değişiklik varsa, değiştirilmiş projeler listesine ekle
        if [ "$changes_count" -gt 0 ]; then
            MODIFIED_PROJECTS=$((MODIFIED_PROJECTS + 1))
        else
            CLEAN_PROJECTS=$((CLEAN_PROJECTS + 1))
        fi

        # Bilgileri geçici dosyaya yaz - sıralama için kullanılacak
        if [ "$SORT_BY" = "date" ]; then
            echo "$project_name|$last_commit_timestamp|$current_branch|$last_commit|$last_commit_date|$changes_count|$staged_count|$untracked_count|$unpushed_count|$git_status" >> "$TEMP_FILE"
        elif [ "$SORT_BY" = "changes" ]; then
            echo "$project_name|$changes_count|$current_branch|$last_commit|$last_commit_date|$last_commit_timestamp|$staged_count|$untracked_count|$unpushed_count|$git_status" >> "$TEMP_FILE"
        else # name
            echo "$project_name|$project_name|$current_branch|$last_commit|$last_commit_date|$changes_count|$staged_count|$untracked_count|$unpushed_count|$git_status" >> "$TEMP_FILE"
        fi

        # Ana dizine geri dön
        cd "$PROJECT_DIR" || exit 1
    fi
done

echo # Yeni satır

# Çıktı başlat
output_begin

# Sıralama
if [ "$SORT_BY" = "date" ]; then
    # Tarihe göre sırala (en yeni en üstte)
    sort -t '|' -k2 -nr "$TEMP_FILE" > "${TEMP_FILE}.sorted"
elif [ "$SORT_BY" = "changes" ]; then
    # Değişiklik sayısına göre sırala (en çok değişiklik en üstte)
    sort -t '|' -k2 -nr "$TEMP_FILE" > "${TEMP_FILE}.sorted"
else
    # İsme göre sırala
    sort -t '|' -k1 "$TEMP_FILE" > "${TEMP_FILE}.sorted"
fi

# Projeleri dolaş ve çıktıyı oluştur
output_section "Proje Detayları"

while IFS='|' read -r name sort_key branch last_commit date changes staged untracked unpushed status; do
    # Git durumunu belirle
    if [ "$changes" -eq 0 ] && [ "$unpushed" -eq 0 ]; then
        git_status_text="Temiz"
    elif [ "$changes" -gt 0 ] && [ "$unpushed" -gt 0 ]; then
        git_status_text="Değişiklik var ve push edilmemiş commit var"
    elif [ "$changes" -gt 0 ]; then
        git_status_text="Değişiklik var"
    elif [ "$unpushed" -gt 0 ]; then
        git_status_text="Push edilmemiş commit var"
    else
        git_status_text="Bilinmiyor"
    fi

    # Proje başlığını ve temel bilgileri yaz
    output_project_begin "$name" "$git_status_text" "$branch" "$last_commit" "$date" "$changes" "$staged" "$untracked" "$unpushed"

    # Eğer konsol çıktısı değilse veya dosyaya yazılıyorsa renklendirmeyi kaldır
    if [ "$OUTPUT_FORMAT" != "console" ] || [ -n "$OUTPUT_FILE" ]; then
        unset RED GREEN YELLOW BLUE MAGENTA CYAN GRAY NC
    fi

    # Değiştirilmiş dosyaları göster
    if [ "$SHOW_MODIFIED" = true ] && [ "$changes" -gt 0 ]; then
        # Proje dizinine git
        cd "$PROJECT_DIR/$name" || continue

        modified_files=$(git status -s)
        output_sub_section "Değiştirilmiş Dosyalar" "$modified_files"

        # Ana dizine geri dön
        cd "$PROJECT_DIR" || exit 1
    fi

    # Stage edilmiş değişiklikleri göster
    if [ "$SHOW_STAGED" = true ] && [ "$staged" -gt 0 ]; then
        # Proje dizinine git
        cd "$PROJECT_DIR/$name" || continue

        staged_files=$(git diff --name-only --cached)
        output_sub_section "Stage Edilmiş Dosyalar" "$staged_files"

        # Ana dizine geri dön
        cd "$PROJECT_DIR" || exit 1
    fi

    # Takip edilmeyen dosyaları göster
    if [ "$SHOW_UNTRACKED" = true ] && [ "$untracked" -gt 0 ]; then
        # Proje dizinine git
        cd "$PROJECT_DIR/$name" || continue

        untracked_files=$(git ls-files --others --exclude-standard)
        output_sub_section "Takip Edilmeyen Dosyalar" "$untracked_files"

        # Ana dizine geri dön
        cd "$PROJECT_DIR" || exit 1
    fi

    # Dal bilgilerini göster
    if [ "$SHOW_BRANCHES" = true ]; then
        # Proje dizinine git
        cd "$PROJECT_DIR/$name" || continue

        branch_info=$(git branch -v)
        output_sub_section "Dal Bilgileri" "$branch_info"

        # Ana dizine geri dön
        cd "$PROJECT_DIR" || exit 1
    fi

    # Son commitleri göster
    if [ "$SHOW_RECENT" = true ]; then
        # Proje dizinine git
        cd "$PROJECT_DIR/$name" || continue

        recent_commits=$(git log -n "$RECENT_COMMITS" --pretty=format:"%h (%cd) %s" --date=format:"%Y-%m-%d %H:%M")
        if [ -n "$recent_commits" ]; then
            output_sub_section "Son $RECENT_COMMITS Commit" "$recent_commits"
        fi

        # Ana dizine geri dön
        cd "$PROJECT_DIR" || exit 1
    fi

    # Push edilmemiş commitleri göster
    if [ "$SHOW_UNPUSHED" = true ] && [ "$unpushed" -gt 0 ]; then
        # Proje dizinine git
        cd "$PROJECT_DIR/$name" || continue

        unpushed_commits=$(git log @{u}.. --pretty=format:"%h (%cd) %s" --date=format:"%Y-%m-%d %H:%M")
        output_sub_section "Push Edilmemiş Commitler" "$unpushed_commits"

        # Ana dizine geri dön
        cd "$PROJECT_DIR" || exit 1
    fi

done < "${TEMP_FILE}.sorted"

# Özet bilgileri yaz
output_summary "$TOTAL_PROJECTS" "$GIT_PROJECTS" "$MODIFIED_PROJECTS" "$CLEAN_PROJECTS" "$UNPUSHED_PROJECTS"

# Çıktı dosyası bilgisi
if [ -n "$OUTPUT_FILE" ]; then
    echo -e "${GREEN}Rapor başarıyla oluşturuldu: ${CYAN}$OUTPUT_FILE${NC}"
fi

# Geçici dosyaları temizle
rm -f "$TEMP_FILE" "${TEMP_FILE}.sorted"

echo
echo -e "${GREEN}Git durum kontrolü tamamlandı.${NC}"
echo "İşlem tarihi: $(date)"
echo

</rewritten_file>
