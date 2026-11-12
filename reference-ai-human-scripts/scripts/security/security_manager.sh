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
REPORTS_DIR="reports"
CONFIG_FILE="$CONFIG_DIR/security_config.json"
LOG_FILE="$LOGS_DIR/security_manager.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Firewall yönetimi
manage_firewall() {
    local action=$1
    local port=$2
    local source=$3

    case $action in
        "list")
            log "${BLUE}Firewall kuralları listeleniyor${NC}"
            sudo iptables -L -n -v
            ;;
        "add")
            log "${BLUE}Firewall kuralı ekleniyor: Port $port, Kaynak: $source${NC}"
            sudo iptables -A INPUT -p tcp --dport "$port" -s "$source" -j ACCEPT
            ;;
        "remove")
            log "${BLUE}Firewall kuralı siliniyor: Port $port${NC}"
            sudo iptables -D INPUT -p tcp --dport "$port" -j ACCEPT
            ;;
        "save")
            log "${BLUE}Firewall kuralları kaydediliyor${NC}"
            sudo iptables-save > "$CONFIG_DIR/iptables.rules"
            ;;
        "restore")
            log "${BLUE}Firewall kuralları geri yükleniyor${NC}"
            sudo iptables-restore < "$CONFIG_DIR/iptables.rules"
            ;;
        *)
            log "${RED}Geçersiz firewall aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Firewall işlemi başarılı${NC}"
        return 0
    else
        log "${RED}✗ Firewall işlemi başarısız${NC}"
        return 1
    fi
}

# Erişim kontrolü
manage_access() {
    local action=$1
    local user=$2
    local permission=$3

    case $action in
        "list")
            log "${BLUE}Kullanıcı izinleri listeleniyor${NC}"
            ls -l /etc/sudoers.d/
            ;;
        "add")
            log "${BLUE}Kullanıcı izni ekleniyor: $user - $permission${NC}"
            echo "$user ALL=(ALL) $permission" | sudo tee "/etc/sudoers.d/$user"
            ;;
        "remove")
            log "${BLUE}Kullanıcı izni siliniyor: $user${NC}"
            sudo rm "/etc/sudoers.d/$user"
            ;;
        "check")
            log "${BLUE}Kullanıcı izinleri kontrol ediliyor: $user${NC}"
            sudo -l -U "$user"
            ;;
        *)
            log "${RED}Geçersiz erişim aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Erişim kontrolü işlemi başarılı${NC}"
        return 0
    else
        log "${RED}✗ Erişim kontrolü işlemi başarısız${NC}"
        return 1
    fi
}

# Şifreleme işlemleri
manage_encryption() {
    local action=$1
    local file=$2
    local key=$3

    case $action in
        "encrypt")
            log "${BLUE}Dosya şifreleniyor: $file${NC}"
            openssl enc -aes-256-cbc -salt -in "$file" -out "${file}.enc" -k "$key"
            ;;
        "decrypt")
            log "${BLUE}Dosya şifresi çözülüyor: $file${NC}"
            openssl enc -aes-256-cbc -d -in "$file" -out "${file%.enc}" -k "$key"
            ;;
        "generate-key")
            log "${BLUE}Yeni şifreleme anahtarı oluşturuluyor${NC}"
            openssl rand -base64 32 > "$CONFIG_DIR/encryption.key"
            ;;
        *)
            log "${RED}Geçersiz şifreleme aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Şifreleme işlemi başarılı${NC}"
        return 0
    else
        log "${RED}✗ Şifreleme işlemi başarısız${NC}"
        return 1
    fi
}

# Güvenlik denetimi
perform_audit() {
    local target=$1
    local report_file="$REPORTS_DIR/audit_$(date +%Y%m%d_%H%M%S).txt"

    log "${BLUE}Güvenlik denetimi başlatılıyor: $target${NC}"

    {
        echo "Güvenlik Denetim Raporu - $(date)"
        echo "=============================="
        echo

        echo "Sistem Bilgileri:"
        uname -a

        echo -e "\nAçık Portlar:"
        netstat -tuln

        echo -e "\nAktif Servisler:"
        systemctl list-units --type=service --state=running

        echo -e "\nSüper Kullanıcı İzinleri:"
        grep -v -E "^#" /etc/sudoers

        echo -e "\nŞüpheli Dosyalar:"
        find / -perm -4000 -type f 2>/dev/null

        echo -e "\nGüvenlik Güncellemeleri:"
        if command -v apt > /dev/null; then
            apt list --upgradable
        elif command -v yum > /dev/null; then
            yum check-update
        fi

    } > "$report_file"

    log "${GREEN}✓ Güvenlik denetimi tamamlandı: $report_file${NC}"
}

# Güvenlik taraması
perform_scan() {
    local target=$1
    local type=$2
    local report_file="$REPORTS_DIR/scan_$(date +%Y%m%d_%H%M%S).txt"

    log "${BLUE}Güvenlik taraması başlatılıyor: $target${NC}"

    case $type in
        "port")
            nmap -sS -sV "$target" > "$report_file"
            ;;
        "vulnerability")
            nikto -h "$target" -o "$report_file"
            ;;
        "malware")
            clamscan -r "$target" --log="$report_file"
            ;;
        *)
            log "${RED}Geçersiz tarama tipi: $type${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Güvenlik taraması tamamlandı: $report_file${NC}"
        return 0
    else
        log "${RED}✗ Güvenlik taraması başarısız${NC}"
        return 1
    fi
}

# Güvenlik raporu
generate_security_report() {
    local report_file="$REPORTS_DIR/security_report_$(date +%Y%m%d).html"

    log "${BLUE}Güvenlik raporu oluşturuluyor${NC}"

    {
        echo "<html><head><title>Güvenlik Raporu</title></head><body>"
        echo "<h1>Güvenlik Raporu - $(date)</h1>"

        echo "<h2>Sistem Güvenliği</h2>"
        echo "<pre>"
        uname -a
        echo "</pre>"

        echo "<h2>Firewall Durumu</h2>"
        echo "<pre>"
        sudo iptables -L -n -v
        echo "</pre>"

        echo "<h2>Açık Portlar</h2>"
        echo "<pre>"
        netstat -tuln
        echo "</pre>"

        echo "<h2>Son Güvenlik Olayları</h2>"
        echo "<pre>"
        tail -n 50 /var/log/auth.log
        echo "</pre>"

        echo "<h2>Güvenlik Güncellemeleri</h2>"
        echo "<pre>"
        if command -v apt > /dev/null; then
            apt list --upgradable
        elif command -v yum > /dev/null; then
            yum check-update
        fi
        echo "</pre>"

        echo "</body></html>"

    } > "$report_file"

    log "${GREEN}✓ Güvenlik raporu oluşturuldu: $report_file${NC}"
}

# Ana menü
show_menu() {
    echo -e "\n${YELLOW}Güvenlik Yönetim Menüsü${NC}"
    echo "1. Firewall Yönetimi"
    echo "2. Erişim Kontrolü"
    echo "3. Şifreleme İşlemleri"
    echo "4. Güvenlik Denetimi"
    echo "5. Güvenlik Taraması"
    echo "6. Güvenlik Raporu"
    echo "7. Çıkış"
}

# Dizinleri oluştur
mkdir -p "$CONFIG_DIR" "$LOGS_DIR" "$REPORTS_DIR"

# Ana döngü
while true; do
    show_menu
    read -p "Seçiminiz (1-7): " choice

    case $choice in
        1)
            echo -e "\n${YELLOW}Firewall Yönetimi${NC}"
            echo "1. Kuralları Listele"
            echo "2. Kural Ekle"
            echo "3. Kural Sil"
            echo "4. Kuralları Kaydet"
            echo "5. Kuralları Geri Yükle"
            read -p "Seçiminiz (1-5): " fw_choice

            case $fw_choice in
                1) manage_firewall "list" ;;
                2)
                    read -p "Port: " port
                    read -p "Kaynak IP (örn: 192.168.1.0/24): " source
                    manage_firewall "add" "$port" "$source"
                    ;;
                3)
                    read -p "Port: " port
                    manage_firewall "remove" "$port"
                    ;;
                4) manage_firewall "save" ;;
                5) manage_firewall "restore" ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        2)
            echo -e "\n${YELLOW}Erişim Kontrolü${NC}"
            echo "1. İzinleri Listele"
            echo "2. İzin Ekle"
            echo "3. İzin Sil"
            echo "4. İzin Kontrol"
            read -p "Seçiminiz (1-4): " access_choice

            case $access_choice in
                1) manage_access "list" ;;
                2)
                    read -p "Kullanıcı: " user
                    read -p "İzin (örn: ALL): " permission
                    manage_access "add" "$user" "$permission"
                    ;;
                3)
                    read -p "Kullanıcı: " user
                    manage_access "remove" "$user"
                    ;;
                4)
                    read -p "Kullanıcı: " user
                    manage_access "check" "$user"
                    ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        3)
            echo -e "\n${YELLOW}Şifreleme İşlemleri${NC}"
            echo "1. Dosya Şifrele"
            echo "2. Dosya Şifresini Çöz"
            echo "3. Şifreleme Anahtarı Oluştur"
            read -p "Seçiminiz (1-3): " enc_choice

            case $enc_choice in
                1)
                    read -p "Dosya: " file
                    read -p "Şifreleme anahtarı: " key
                    manage_encryption "encrypt" "$file" "$key"
                    ;;
                2)
                    read -p "Şifreli dosya: " file
                    read -p "Şifreleme anahtarı: " key
                    manage_encryption "decrypt" "$file" "$key"
                    ;;
                3)
                    manage_encryption "generate-key"
                    ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        4)
            read -p "Denetlenecek hedef: " target
            perform_audit "$target"
            ;;
        5)
            echo -e "\n${YELLOW}Güvenlik Taraması${NC}"
            echo "1. Port Taraması"
            echo "2. Güvenlik Açığı Taraması"
            echo "3. Malware Taraması"
            read -p "Seçiminiz (1-3): " scan_choice
            read -p "Hedef: " target

            case $scan_choice in
                1) perform_scan "$target" "port" ;;
                2) perform_scan "$target" "vulnerability" ;;
                3) perform_scan "$target" "malware" ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        6)
            generate_security_report
            ;;
        7)
            exit 0
            ;;
        *)
            echo -e "${RED}Geçersiz seçim!${NC}"
            ;;
    esac
done
