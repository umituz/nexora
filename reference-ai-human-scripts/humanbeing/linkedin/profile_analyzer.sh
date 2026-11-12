#!/bin/bash

# LinkedIn Profil Analiz Aracı
# Gereksinimler: jq, curl, python3, chromium-browser

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
    command -v chromium-browser >/dev/null 2>&1 || { echo -e "${RED}Error: chromium-browser gerekli${NC}" >&2; exit 1; }
}

# LinkedIn kimlik bilgileri kontrolü
check_credentials() {
    if [ -z "$LINKEDIN_EMAIL" ] || [ -z "$LINKEDIN_PASSWORD" ]; then
        echo -e "${RED}Error: LINKEDIN_EMAIL ve LINKEDIN_PASSWORD ortam değişkenleri tanımlanmamış${NC}"
        exit 1
    fi
}

# Profil bilgilerini al
get_profile_info() {
    local profile_url=$1
    local output_dir=$2

    echo -e "${GREEN}Profil bilgileri alınıyor...${NC}"
    python3 - <<EOF
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import os
import time

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    service = Service('chromedriver')
    return webdriver.Chrome(service=service, options=chrome_options)

def login(driver):
    driver.get('https://www.linkedin.com/login')
    email_elem = driver.find_element(By.ID, 'username')
    email_elem.send_keys(os.getenv('LINKEDIN_EMAIL'))
    pass_elem = driver.find_element(By.ID, 'password')
    pass_elem.send_keys(os.getenv('LINKEDIN_PASSWORD'))
    pass_elem.submit()
    time.sleep(5)

def get_profile_data(driver, url):
    driver.get(url)
    time.sleep(5)

    profile_data = {
        'basic_info': {},
        'experience': [],
        'education': [],
        'skills': [],
        'certifications': [],
        'languages': [],
        'volunteer': []
    }

    # Temel bilgiler
    try:
        profile_data['basic_info']['name'] = driver.find_element(By.CLASS_NAME, 'text-heading-xlarge').text
        profile_data['basic_info']['headline'] = driver.find_element(By.CLASS_NAME, 'text-body-medium').text
        profile_data['basic_info']['location'] = driver.find_element(By.CLASS_NAME, 'text-body-small').text
    except:
        pass

    # İş deneyimi
    try:
        exp_section = driver.find_element(By.ID, 'experience')
        exp_items = exp_section.find_elements(By.CLASS_NAME, 'artdeco-list__item')
        for item in exp_items:
            try:
                exp = {
                    'title': item.find_element(By.CLASS_NAME, 't-bold').text,
                    'company': item.find_element(By.CLASS_NAME, 't-normal').text,
                    'dates': item.find_element(By.CLASS_NAME, 't-normal').find_element(By.XPATH, 'following-sibling::span').text
                }
                profile_data['experience'].append(exp)
            except:
                continue
    except:
        pass

    # Eğitim
    try:
        edu_section = driver.find_element(By.ID, 'education')
        edu_items = edu_section.find_elements(By.CLASS_NAME, 'artdeco-list__item')
        for item in edu_items:
            try:
                edu = {
                    'school': item.find_element(By.CLASS_NAME, 't-bold').text,
                    'degree': item.find_element(By.CLASS_NAME, 't-normal').text,
                    'dates': item.find_element(By.CLASS_NAME, 't-normal').find_element(By.XPATH, 'following-sibling::span').text
                }
                profile_data['education'].append(edu)
            except:
                continue
    except:
        pass

    # Beceriler
    try:
        skills_section = driver.find_element(By.ID, 'skills')
        skill_items = skills_section.find_elements(By.CLASS_NAME, 'artdeco-list__item')
        for item in skill_items:
            try:
                skill = {
                    'name': item.find_element(By.CLASS_NAME, 't-bold').text,
                    'endorsements': item.find_element(By.CLASS_NAME, 't-normal').text
                }
                profile_data['skills'].append(skill)
            except:
                continue
    except:
        pass

    return profile_data

try:
    driver = setup_driver()
    login(driver)
    profile_data = get_profile_data(driver, '${profile_url}')

    with open('${output_dir}/profile_info.json', 'w') as f:
        json.dump(profile_data, f, indent=2)

except Exception as e:
    print(f"Hata: {str(e)}")
finally:
    driver.quit()
EOF
}

# Bağlantı ağını analiz et
analyze_network() {
    local profile_url=$1
    local output_dir=$2

    echo -e "${GREEN}Bağlantı ağı analiz ediliyor...${NC}"
    python3 network_analyzer.py --profile "$profile_url" --output "${output_dir}/network"
}

# Aktiviteleri analiz et
analyze_activities() {
    local profile_url=$1
    local output_dir=$2

    echo -e "${GREEN}Aktiviteler analiz ediliyor...${NC}"
    python3 activity_analyzer.py --profile "$profile_url" --output "${output_dir}/activities"
}

# Markdown raporu oluştur
generate_report() {
    local profile_url=$1
    local output_dir=$2
    local report_file="${output_dir}/profile_report.md"

    echo -e "${GREEN}OSINT raporu oluşturuluyor...${NC}"

    {
        echo "# LinkedIn Profil OSINT Raporu"
        echo "Profil URL: $profile_url"
        echo "Oluşturulma Tarihi: $(date)"
        echo
        echo "## Temel Bilgiler"
        jq -r '.basic_info' "${output_dir}/profile_info.json"
        echo
        echo "## İş Deneyimi"
        jq -r '.experience[]' "${output_dir}/profile_info.json"
        echo
        echo "## Eğitim"
        jq -r '.education[]' "${output_dir}/profile_info.json"
        echo
        echo "## Beceriler"
        jq -r '.skills[]' "${output_dir}/profile_info.json"
        echo
        echo "## Ağ Analizi"
        if [ -f "${output_dir}/network/network_analysis.json" ]; then
            cat "${output_dir}/network/network_analysis.json"
        fi
        echo
        echo "## Aktivite Analizi"
        if [ -f "${output_dir}/activities/activity_analysis.json" ]; then
            cat "${output_dir}/activities/activity_analysis.json"
        fi
    } > "$report_file"
}

main() {
    check_requirements
    check_credentials

    if [ -z "$1" ]; then
        echo -e "${RED}Kullanım: $0 <profile_url>${NC}"
        exit 1
    fi

    local profile_url=$1
    local output_dir="generates/linkedin/profiles/$(echo "$profile_url" | sed 's/.*\/in\///g')_$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$output_dir"/{network,activities}

    get_profile_info "$profile_url" "$output_dir"
    analyze_network "$profile_url" "$output_dir"
    analyze_activities "$profile_url" "$output_dir"
    generate_report "$profile_url" "$output_dir"

    echo -e "${GREEN}Analiz tamamlandı. Rapor: ${output_dir}/profile_report.md${NC}"
}

main "$@"
