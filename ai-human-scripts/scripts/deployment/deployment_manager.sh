#!/bin/bash

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Sabit değişkenler
CONFIG_DIR="config"
LOGS_DIR="logs"
ENV_DIR="environments"
RELEASES_DIR="releases"
ROLLBACK_DIR="rollback"
SCRIPTS_DIR="scripts"
TEMPLATES_DIR="templates"
CONFIG_FILE="$CONFIG_DIR/deployment_config.json"
LOG_FILE="$LOGS_DIR/deployment_manager.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Deployment hazırlığı
prepare_deployment() {
    local app_name=$1
    local version=$2
    local env=$3
    local release_dir="$RELEASES_DIR/${app_name}_${version}"

    log "${BLUE}Deployment hazırlanıyor: $app_name v$version ($env)${NC}"

    # Release dizini oluştur
    mkdir -p "$release_dir"

    # Konfigürasyon dosyalarını kopyala
    cp "$CONFIG_DIR/$env.conf" "$release_dir/config.conf"

    # Environment değişkenlerini ayarla
    source "$ENV_DIR/$env.env"

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Deployment hazırlığı tamamlandı${NC}"
        return 0
    else
        log "${RED}✗ Deployment hazırlığı başarısız${NC}"
        return 1
    fi
}

# Deployment gerçekleştirme
deploy_application() {
    local app_name=$1
    local version=$2
    local env=$3
    local release_dir="$RELEASES_DIR/${app_name}_${version}"

    log "${BLUE}Deployment başlatılıyor: $app_name v$version ($env)${NC}"

    # Önceki versiyonu yedekle
    if [ -d "current" ]; then
        cp -r current "$ROLLBACK_DIR/${app_name}_$(date +%Y%m%d_%H%M%S)"
    fi

    # Yeni versiyonu deploy et
    rsync -av --delete "$release_dir/" "current/"

    # Post-deployment scriptlerini çalıştır
    if [ -f "$SCRIPTS_DIR/post_deploy.sh" ]; then
        bash "$SCRIPTS_DIR/post_deploy.sh"
    fi

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Deployment başarılı${NC}"
        return 0
    else
        log "${RED}✗ Deployment başarısız${NC}"
        return 1
    fi
}

# Rollback işlemi
rollback_deployment() {
    local app_name=$1
    local version=$2
    local rollback_dir="$ROLLBACK_DIR/${app_name}_$version"

    log "${YELLOW}Rollback başlatılıyor: $app_name v$version${NC}"

    if [ ! -d "$rollback_dir" ]; then
        log "${RED}✗ Rollback versiyonu bulunamadı${NC}"
        return 1
    fi

    # Mevcut versiyonu yedekle
    mv current "failed_$(date +%Y%m%d_%H%M%S)"

    # Önceki versiyona dön
    cp -r "$rollback_dir" current

    # Post-rollback scriptlerini çalıştır
    if [ -f "$SCRIPTS_DIR/post_rollback.sh" ]; then
        bash "$SCRIPTS_DIR/post_rollback.sh"
    fi

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Rollback başarılı${NC}"
        return 0
    else
        log "${RED}✗ Rollback başarısız${NC}"
        return 1
    fi
}

# Deployment durumu kontrolü
check_deployment_status() {
    local app_name=$1
    local version=$2

    log "${BLUE}Deployment durumu kontrol ediliyor: $app_name v$version${NC}"

    # Uygulama durumunu kontrol et
    if [ -f "current/status.sh" ]; then
        bash current/status.sh
    fi

    # Log dosyalarını kontrol et
    tail -n 50 "$LOG_FILE"

    # Servis durumunu kontrol et
    systemctl status "$app_name" || true
}

# Environment yönetimi
manage_environment() {
    local action=$1
    local env_name=$2
    local env_file="$ENV_DIR/$env_name.env"

    case $action in
        "create")
            log "${BLUE}Environment oluşturuluyor: $env_name${NC}"

            # Template'den yeni environment oluştur
            cp "$TEMPLATES_DIR/env.template" "$env_file"

            # Environment değişkenlerini düzenle
            read -p "DATABASE_URL: " db_url
            read -p "API_KEY: " api_key
            read -p "CACHE_HOST: " cache_host

            sed -i "" "s|DATABASE_URL=|DATABASE_URL=$db_url|g" "$env_file"
            sed -i "" "s|API_KEY=|API_KEY=$api_key|g" "$env_file"
            sed -i "" "s|CACHE_HOST=|CACHE_HOST=$cache_host|g" "$env_file"
            ;;

        "update")
            log "${BLUE}Environment güncelleniyor: $env_name${NC}"

            if [ ! -f "$env_file" ]; then
                log "${RED}✗ Environment dosyası bulunamadı${NC}"
                return 1
            fi

            # Mevcut değerleri göster
            cat "$env_file"

            # Yeni değerleri al
            read -p "Güncellenecek değişken: " var_name
            read -p "Yeni değer: " var_value

            sed -i "" "s|$var_name=.*|$var_name=$var_value|g" "$env_file"
            ;;

        "delete")
            log "${YELLOW}Environment siliniyor: $env_name${NC}"
            rm -f "$env_file"
            ;;

        "list")
            log "${BLUE}Environment listesi:${NC}"
            ls -l "$ENV_DIR"
            ;;

        *)
            log "${RED}Geçersiz environment aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Environment işlemi başarılı${NC}"
        return 0
    else
        log "${RED}✗ Environment işlemi başarısız${NC}"
        return 1
    fi
}

# Release yönetimi
manage_releases() {
    local action=$1
    local app_name=$2
    local version=$3

    case $action in
        "create")
            log "${BLUE}Release oluşturuluyor: $app_name v$version${NC}"

            # Release dizini oluştur
            mkdir -p "$RELEASES_DIR/${app_name}_${version}"

            # Uygulama dosyalarını kopyala
            cp -r "source/" "$RELEASES_DIR/${app_name}_${version}/"

            # Release konfigürasyonunu oluştur
            echo "{\"app\": \"$app_name\", \"version\": \"$version\", \"date\": \"$(date)\"}" > \
                "$RELEASES_DIR/${app_name}_${version}/release.json"
            ;;

        "delete")
            log "${YELLOW}Release siliniyor: $app_name v$version${NC}"
            rm -rf "$RELEASES_DIR/${app_name}_${version}"
            ;;

        "list")
            log "${BLUE}Release listesi:${NC}"
            ls -l "$RELEASES_DIR" | grep "$app_name"
            ;;

        *)
            log "${RED}Geçersiz release aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Release işlemi başarılı${NC}"
        return 0
    else
        log "${RED}✗ Release işlemi başarısız${NC}"
        return 1
    fi
}

# Deployment geçmişi
deployment_history() {
    local app_name=$1
    local limit=${2:-10}

    log "${BLUE}Deployment geçmişi görüntüleniyor: $app_name${NC}"

    echo -e "\n${YELLOW}Son $limit Deployment:${NC}"
    grep "$app_name" "$LOG_FILE" | tail -n "$limit"

    echo -e "\n${YELLOW}Mevcut Rollback Versiyonları:${NC}"
    ls -l "$ROLLBACK_DIR" | grep "$app_name"
}

# Ana menü
show_menu() {
    echo -e "\n${YELLOW}Deployment Yönetim Menüsü${NC}"
    echo "1. Deployment Hazırla"
    echo "2. Deployment Gerçekleştir"
    echo "3. Rollback Yap"
    echo "4. Deployment Durumu Kontrol Et"
    echo "5. Environment Yönetimi"
    echo "6. Release Yönetimi"
    echo "7. Deployment Geçmişi"
    echo "8. Çıkış"
}

# Dizinleri oluştur
mkdir -p "$CONFIG_DIR" "$LOGS_DIR" "$ENV_DIR" "$RELEASES_DIR" "$ROLLBACK_DIR" "$SCRIPTS_DIR" "$TEMPLATES_DIR"

# Ana döngü
while true; do
    show_menu
    read -p "Seçiminiz (1-8): " choice

    case $choice in
        1)
            read -p "Uygulama adı: " app_name
            read -p "Versiyon: " version
            read -p "Environment (dev/staging/prod): " env
            prepare_deployment "$app_name" "$version" "$env"
            ;;
        2)
            read -p "Uygulama adı: " app_name
            read -p "Versiyon: " version
            read -p "Environment (dev/staging/prod): " env
            deploy_application "$app_name" "$version" "$env"
            ;;
        3)
            read -p "Uygulama adı: " app_name
            read -p "Rollback versiyonu: " version
            rollback_deployment "$app_name" "$version"
            ;;
        4)
            read -p "Uygulama adı: " app_name
            read -p "Versiyon: " version
            check_deployment_status "$app_name" "$version"
            ;;
        5)
            echo -e "\n${YELLOW}Environment Yönetimi${NC}"
            echo "1. Environment Oluştur"
            echo "2. Environment Güncelle"
            echo "3. Environment Sil"
            echo "4. Environment Listele"
            read -p "Seçiminiz (1-4): " env_choice
            read -p "Environment adı: " env_name

            case $env_choice in
                1) manage_environment "create" "$env_name" ;;
                2) manage_environment "update" "$env_name" ;;
                3) manage_environment "delete" "$env_name" ;;
                4) manage_environment "list" "$env_name" ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        6)
            echo -e "\n${YELLOW}Release Yönetimi${NC}"
            echo "1. Release Oluştur"
            echo "2. Release Sil"
            echo "3. Release Listele"
            read -p "Seçiminiz (1-3): " release_choice
            read -p "Uygulama adı: " app_name

            case $release_choice in
                1)
                    read -p "Versiyon: " version
                    manage_releases "create" "$app_name" "$version"
                    ;;
                2)
                    read -p "Versiyon: " version
                    manage_releases "delete" "$app_name" "$version"
                    ;;
                3)
                    manage_releases "list" "$app_name"
                    ;;
                *)
                    echo -e "${RED}Geçersiz seçim!${NC}"
                    ;;
            esac
            ;;
        7)
            read -p "Uygulama adı: " app_name
            read -p "Limit (varsayılan: 10): " limit
            deployment_history "$app_name" "${limit:-10}"
            ;;
        8)
            exit 0
            ;;
        *)
            echo -e "${RED}Geçersiz seçim!${NC}"
            ;;
    esac
done
