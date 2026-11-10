#!/bin/bash

# project_create.sh - Neo projesi için yeni alt projeler oluşturur

# Banner göster
clear
echo "============================================================"
echo "               YENİ PROJE OLUŞTURMA ARACI                   "
echo "============================================================"
echo

# Renklendirme
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Varsayılan değerler
PROJECT_NAME=""
PROJECT_TYPE="empty"  # Varsayılan boş proje
INIT_GIT=false
INSTALL_DEPS=false
DESCRIPTION=""
REQUIRE=""
VERBOSE=false

# Ana proje dizini
BASE_DIR="$(dirname "$0")"
PROJECTS_DIR="$BASE_DIR/projects"
TEMPLATES_DIR="$BASE_DIR/templates"

# Şablonları kontrol et, yoksa oluştur
if [ ! -d "$TEMPLATES_DIR" ]; then
    mkdir -p "$TEMPLATES_DIR/empty"
    mkdir -p "$TEMPLATES_DIR/laravel"
    mkdir -p "$TEMPLATES_DIR/vue"

    # Boş şablon için temel dosyalar
    echo "# Boş Proje Şablonu" > "$TEMPLATES_DIR/empty/README.md"

    # Laravel şablonu için açıklama
    echo "# Laravel Proje Şablonu" > "$TEMPLATES_DIR/laravel/README.md"
    echo "Laravel projesi için bu dosyaları kullanabilirsiniz." >> "$TEMPLATES_DIR/laravel/README.md"

    # Vue şablonu için açıklama
    echo "# Vue Proje Şablonu" > "$TEMPLATES_DIR/vue/README.md"
    echo "Vue projesi için bu dosyaları kullanabilirsiniz." >> "$TEMPLATES_DIR/vue/README.md"

    echo -e "${YELLOW}NOT: Template dizini bulunamadı, temel şablonlar oluşturuldu.${NC}"
    echo -e "${YELLOW}Lütfen şablon dosyalarını $TEMPLATES_DIR altına ekleyin.${NC}"
    echo
fi

# Kullanılabilir şablonları bul
available_templates=$(find "$TEMPLATES_DIR" -maxdepth 1 -type d | grep -v "^$TEMPLATES_DIR$" | xargs -n1 basename | tr '\n' ',' | sed 's/,$//')

# Yardım mesajı
function show_help {
    echo -e "${BLUE}Neo Proje Oluşturma Aracı${NC}"
    echo
    echo "Bu script, Neo projesi içinde yeni bir alt proje oluşturur."
    echo
    echo "Kullanım: ./project_create.sh -n <proje-adı> [seçenekler]"
    echo
    echo "Seçenekler:"
    echo "  -n, --name <isim>      : Yeni projenin adı (zorunlu)"
    echo "  -t, --type <tür>       : Proje türü/şablonu ($available_templates)"
    echo "  -d, --description <açıklama> : Proje açıklaması"
    echo "  -g, --git              : Git repo başlat"
    echo "  -i, --install          : Bağımlılıkları otomatik kur (composer, npm)"
    echo "  -r, --require <paket>  : Ek bağımlılıklar (composer için)"
    echo "  -v, --verbose          : Ayrıntılı çıktı"
    echo "  -h, --help             : Bu yardım mesajını göster"
    echo
    echo "Örnekler:"
    echo "  ./project_create.sh -n myproject"
    echo "  ./project_create.sh -n ecommerce -t laravel -g -i"
    echo "  ./project_create.sh -n dashboard -t vue -d \"Kontrol Paneli Projesi\" -i"
    echo
    echo "Mevcut şablonlar: $available_templates"
    exit 0
}

# Parametre kontrolü
if [ $# -eq 0 ]; then
    show_help
fi

# Argümanları işle
while [ $# -gt 0 ]; do
    case "$1" in
        -n|--name)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --name seçeneği için bir proje adı belirtilmedi.${NC}"
                exit 1
            fi
            PROJECT_NAME="$2"
            shift 2
            ;;
        -t|--type)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --type seçeneği için bir proje türü belirtilmedi.${NC}"
                exit 1
            fi
            PROJECT_TYPE="$2"
            shift 2
            ;;
        -d|--description)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --description seçeneği için bir açıklama belirtilmedi.${NC}"
                exit 1
            fi
            DESCRIPTION="$2"
            shift 2
            ;;
        -g|--git)
            INIT_GIT=true
            shift
            ;;
        -i|--install)
            INSTALL_DEPS=true
            shift
            ;;
        -r|--require)
            if [ -z "$2" ]; then
                echo -e "${RED}Hata: --require seçeneği için paket(ler) belirtilmedi.${NC}"
                exit 1
            fi
            REQUIRE="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_help
            ;;
        *)
            echo -e "${RED}Hata: Bilinmeyen parametre: $1${NC}"
            echo "Yardım için: ./project_create.sh --help"
            exit 1
            ;;
    esac
done

# Gerekli kontroller
if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}Hata: Proje adı belirtilmedi. -n veya --name seçeneği zorunludur.${NC}"
    exit 1
fi

# Proje adı kontrolü (sadece alfanumerik, tire ve alt çizgi)
if ! [[ $PROJECT_NAME =~ ^[a-zA-Z0-9_-]+$ ]]; then
    echo -e "${RED}Hata: Proje adı sadece harfler, rakamlar, tire (-) ve alt çizgi (_) içerebilir.${NC}"
    exit 1
fi

# Şablon kontrolü
if [ ! -d "$TEMPLATES_DIR/$PROJECT_TYPE" ]; then
    echo -e "${RED}Hata: '$PROJECT_TYPE' şablonu bulunamadı!${NC}"
    echo -e "Mevcut şablonlar: ${CYAN}$available_templates${NC}"
    exit 1
fi

# Hedef dizin kontrolü
TARGET_DIR="$PROJECTS_DIR/$PROJECT_NAME"
if [ -d "$TARGET_DIR" ]; then
    echo -e "${RED}Hata: '$PROJECT_NAME' adında bir proje klasörü zaten var!${NC}"
    exit 1
fi

# Projects dizini kontrol
if [ ! -d "$PROJECTS_DIR" ]; then
    echo -e "${YELLOW}Uyarı: 'projects' klasörü bulunamadı, oluşturuluyor...${NC}"
    mkdir -p "$PROJECTS_DIR"
fi

echo -e "${GREEN}Yeni proje oluşturuluyor: ${CYAN}$PROJECT_NAME${NC}"
echo -e "Tür: ${CYAN}$PROJECT_TYPE${NC}"
if [ -n "$DESCRIPTION" ]; then
    echo -e "Açıklama: ${CYAN}$DESCRIPTION${NC}"
fi
echo -e "Git: ${CYAN}$([ "$INIT_GIT" = true ] && echo "Evet" || echo "Hayır")${NC}"
echo -e "Bağımlılıkları kur: ${CYAN}$([ "$INSTALL_DEPS" = true ] && echo "Evet" || echo "Hayır")${NC}"
if [ -n "$REQUIRE" ]; then
    echo -e "Ek paketler: ${CYAN}$REQUIRE${NC}"
fi
echo

# İşleme başla
echo -e "${YELLOW}Proje klasör yapısı oluşturuluyor...${NC}"
mkdir -p "$TARGET_DIR"

# Şablon dosyalarını kopyala
echo -e "${YELLOW}Şablon dosyaları kopyalanıyor...${NC}"
cp -r "$TEMPLATES_DIR/$PROJECT_TYPE/"* "$TARGET_DIR/" 2>/dev/null

# Proje tipi özel işlemleri
case "$PROJECT_TYPE" in
    "laravel")
        # Laravel için composer.json oluştur (eğer şablonda yoksa)
        if [ ! -f "$TARGET_DIR/composer.json" ]; then
            echo -e "${YELLOW}Laravel composer.json oluşturuluyor...${NC}"
            cat > "$TARGET_DIR/composer.json" << EOF
{
    "name": "neo/$PROJECT_NAME",
    "description": "${DESCRIPTION:-Laravel project}",
    "type": "project",
    "require": {
        "php": "^8.1",
        "laravel/framework": "^11.0"
    },
    "license": "MIT",
    "autoload": {
        "psr-4": {
            "App\\\\": "src/"
        }
    },
    "minimum-stability": "stable"
}
EOF
        fi

        # Temel klasör yapısını oluştur
        mkdir -p "$TARGET_DIR/src"
        mkdir -p "$TARGET_DIR/config"
        mkdir -p "$TARGET_DIR/resources/views"
        mkdir -p "$TARGET_DIR/routes"
        mkdir -p "$TARGET_DIR/database/migrations"

        # Temel dosyaları oluştur
        echo "<?php\n\nreturn [\n    'name' => '$PROJECT_NAME',\n    'description' => '$DESCRIPTION'\n];" > "$TARGET_DIR/config/app.php"
        echo "<?php\n\n// Web routes\n" > "$TARGET_DIR/routes/web.php"

        if [ "$VERBOSE" = true ]; then
            echo -e "${CYAN}Laravel klasör yapısı oluşturuldu.${NC}"
        fi
        ;;

    "vue")
        # Vue için package.json oluştur (eğer şablonda yoksa)
        if [ ! -f "$TARGET_DIR/package.json" ]; then
            echo -e "${YELLOW}Vue package.json oluşturuluyor...${NC}"
            cat > "$TARGET_DIR/package.json" << EOF
{
    "name": "$PROJECT_NAME",
    "version": "0.1.0",
    "description": "${DESCRIPTION:-Vue project}",
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview"
    },
    "dependencies": {
        "vue": "^3.3.0"
    },
    "devDependencies": {
        "@vitejs/plugin-vue": "^5.0.0",
        "vite": "^5.0.0"
    }
}
EOF
        fi

        # Vue için vite.config.js oluştur
        echo -e "${YELLOW}Vue yapılandırma dosyaları oluşturuluyor...${NC}"
        cat > "$TARGET_DIR/vite.config.js" << EOF
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
})
EOF

        # Temel klasör yapısını oluştur
        mkdir -p "$TARGET_DIR/src/components"
        mkdir -p "$TARGET_DIR/src/assets"
        mkdir -p "$TARGET_DIR/public"

        # Ana Vue dosyasını oluştur
        cat > "$TARGET_DIR/src/App.vue" << EOF
<template>
  <div class="app">
    <h1>${PROJECT_NAME}</h1>
    <p>${DESCRIPTION:-Hoş geldiniz!}</p>
  </div>
</template>

<script setup>
// Component setup
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
EOF

        # Ana Vue giriş dosyasını oluştur
        cat > "$TARGET_DIR/src/main.js" << EOF
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
EOF

        # index.html oluştur
        cat > "$TARGET_DIR/index.html" << EOF
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${PROJECT_NAME}</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
EOF

        if [ "$VERBOSE" = true ]; then
            echo -e "${CYAN}Vue klasör yapısı oluşturuldu.${NC}"
        fi
        ;;

    "empty"|*)
        # Boş proje için temel dosyalar
        if [ -z "$DESCRIPTION" ]; then
            DESCRIPTION="$PROJECT_NAME projesi"
        fi

        echo -e "${YELLOW}Temel dosyalar oluşturuluyor...${NC}"

        # README.md oluştur
        cat > "$TARGET_DIR/README.md" << EOF
# $PROJECT_NAME

$DESCRIPTION

## Hakkında

Bu proje Neo framework projesi olarak oluşturulmuştur.

## Kurulum

Kurulum adımları burada açıklanacak.

## Kullanım

Kullanım bilgileri burada açıklanacak.
EOF

        # Temel klasörleri oluştur
        mkdir -p "$TARGET_DIR/src"
        mkdir -p "$TARGET_DIR/docs"

        if [ "$VERBOSE" = true ]; then
            echo -e "${CYAN}Temel klasör yapısı oluşturuldu.${NC}"
        fi
        ;;
esac

# Git reposu başlat
if [ "$INIT_GIT" = true ]; then
    echo -e "${YELLOW}Git reposu başlatılıyor...${NC}"

    # .gitignore oluştur (eğer yoksa)
    if [ ! -f "$TARGET_DIR/.gitignore" ]; then
        cat > "$TARGET_DIR/.gitignore" << EOF
# Sistem dosyaları
.DS_Store
Thumbs.db

# IDE ve düzenleyici dosyaları
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# Bağımlılık dizinleri
/vendor/
/node_modules/

# Derleme ve build dosyaları
/dist/
/build/
/public/build/
/public/hot/

# Ortam dosyaları
.env
.env.local
.env.*.local

# Log dosyaları
*.log
/logs/
/storage/logs/

# Veritabanı
*.sqlite
*.sqlite3

# Ek proje bağımlı dosyalar
EOF
    fi

    # Git repo başlat
    (cd "$TARGET_DIR" && git init && git add . && git commit -m "İlk commit: Proje oluşturuldu") > /dev/null

    if [ "$VERBOSE" = true ]; then
        echo -e "${CYAN}Git repo başlatıldı ve ilk commit yapıldı.${NC}"
    fi
fi

# Bağımlılıkları kur
if [ "$INSTALL_DEPS" = true ]; then
    # Composer paketleri
    if [ -f "$TARGET_DIR/composer.json" ]; then
        echo -e "${YELLOW}Composer bağımlılıkları kuruluyor...${NC}"

        if [ "$VERBOSE" = true ]; then
            (cd "$TARGET_DIR" && composer install)
        else
            (cd "$TARGET_DIR" && composer install --quiet)
        fi

        # Ek paketleri kur
        if [ -n "$REQUIRE" ]; then
            echo -e "${YELLOW}Ek paketler kuruluyor: $REQUIRE${NC}"
            if [ "$VERBOSE" = true ]; then
                (cd "$TARGET_DIR" && composer require $REQUIRE)
            else
                (cd "$TARGET_DIR" && composer require $REQUIRE --quiet)
            fi
        fi
    fi

    # NPM paketleri
    if [ -f "$TARGET_DIR/package.json" ]; then
        echo -e "${YELLOW}NPM bağımlılıkları kuruluyor...${NC}"

        if [ "$VERBOSE" = true ]; then
            (cd "$TARGET_DIR" && npm install)
        else
            (cd "$TARGET_DIR" && npm install --silent)
        fi
    fi
fi

# Bilgisayar adı ve kullanıcı bilgisini al
HOSTNAME=$(hostname)
USERNAME=$(whoami)

# Oluşturma tarihini al
CREATION_DATE=$(date "+%Y-%m-%d %H:%M:%S")

# .project-info dosyası oluştur
cat > "$TARGET_DIR/.project-info" << EOF
name: $PROJECT_NAME
type: $PROJECT_TYPE
description: ${DESCRIPTION:-N/A}
created_by: $USERNAME
created_on: $HOSTNAME
creation_date: $CREATION_DATE
EOF

# Tamamlama mesajı
echo
echo -e "${GREEN}✅ Proje başarıyla oluşturuldu!${NC}"
echo -e "Proje dizini: ${CYAN}$TARGET_DIR${NC}"
echo

# Sonraki adımlar için öneriler
echo -e "${BLUE}Sonraki adımlar:${NC}"
echo -e "1. ${YELLOW}cd projects/$PROJECT_NAME${NC} ile proje dizinine gidin"

if [ "$PROJECT_TYPE" = "laravel" ]; then
    if [ "$INSTALL_DEPS" = true ]; then
        echo -e "2. ${YELLOW}composer artisan${NC} ile Laravel komutlarını çalıştırabilirsiniz"
    else
        echo -e "2. ${YELLOW}composer install${NC} ile bağımlılıkları yükleyin"
    fi
elif [ "$PROJECT_TYPE" = "vue" ]; then
    if [ "$INSTALL_DEPS" = true ]; then
        echo -e "2. ${YELLOW}npm run dev${NC} ile geliştirme sunucusunu başlatın"
    else
        echo -e "2. ${YELLOW}npm install${NC} ile bağımlılıkları yükleyin"
    fi
fi

echo -e "3. ${YELLOW}code .${NC} ile VS Code'da projeyi açın"

if [ "$INIT_GIT" = true ]; then
    echo -e "4. Remote Git repo'nuzu ekleyin: ${YELLOW}git remote add origin <repo-url>${NC}"
fi

echo
echo "Happy coding! 🚀"
