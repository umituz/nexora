#!/usr/bin/env python3

import os
import sys
import json
import time
import argparse
from typing import Dict, List, Any
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import networkx as nx
from collections import Counter
from tqdm import tqdm
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import re

class CompanyAnalyzer:
    def __init__(self):
        load_dotenv()
        self.email = os.getenv('LINKEDIN_EMAIL')
        self.password = os.getenv('LINKEDIN_PASSWORD')
        if not self.email or not self.password:
            raise ValueError("LINKEDIN_EMAIL ve LINKEDIN_PASSWORD ortam değişkenleri tanımlanmamış")

        self.driver = self.setup_driver()
        self.login()

    def setup_driver(self):
        """Selenium webdriver'ı yapılandırır."""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        service = Service('chromedriver')
        return webdriver.Chrome(service=service, options=chrome_options)

    def login(self):
        """LinkedIn'e giriş yapar."""
        self.driver.get('https://www.linkedin.com/login')
        email_elem = self.driver.find_element(By.ID, 'username')
        email_elem.send_keys(self.email)
        pass_elem = self.driver.find_element(By.ID, 'password')
        pass_elem.send_keys(self.password)
        pass_elem.submit()
        time.sleep(5)

    def get_company_info(self, company_url: str) -> Dict[str, Any]:
        """Şirket bilgilerini toplar."""
        try:
            self.driver.get(company_url + 'about/')
            time.sleep(5)

            company_data = {
                'basic_info': {},
                'overview': {},
                'locations': [],
                'specialties': [],
                'funding': {},
                'company_size': {}
            }

            # Temel bilgiler
            try:
                company_data['basic_info']['name'] = self.driver.find_element(By.CLASS_NAME, 'org-top-card-summary__title').text
                company_data['basic_info']['industry'] = self.driver.find_element(By.CLASS_NAME, 'org-top-card-summary__industry').text
                company_data['basic_info']['location'] = self.driver.find_element(By.CLASS_NAME, 'org-top-card-summary__location').text
                company_data['basic_info']['followers'] = self.driver.find_element(By.CLASS_NAME, 'org-top-card-summary__follower-count').text
            except:
                pass

            # Genel bakış
            try:
                overview = self.driver.find_element(By.CLASS_NAME, 'org-about-us-organization-description__text')
                company_data['overview']['description'] = overview.text
            except:
                pass

            # Lokasyonlar
            try:
                locations = self.driver.find_elements(By.CLASS_NAME, 'org-locations-module__location-item')
                for loc in locations:
                    company_data['locations'].append({
                        'name': loc.find_element(By.CLASS_NAME, 'org-location-card__card-title').text,
                        'type': loc.find_element(By.CLASS_NAME, 'org-location-card__card-subtitle').text
                    })
            except:
                pass

            # Uzmanlık alanları
            try:
                specialties = self.driver.find_elements(By.CLASS_NAME, 'org-about-company-module__specialty')
                company_data['specialties'] = [s.text for s in specialties]
            except:
                pass

            return company_data

        except Exception as e:
            print(f"Hata: {str(e)}")
            return None

    def analyze_jobs(self, company_url: str) -> Dict[str, Any]:
        """İş ilanlarını analiz eder."""
        try:
            self.driver.get(company_url + 'jobs/')
            time.sleep(5)

            jobs_data = []
            job_cards = self.driver.find_elements(By.CLASS_NAME, 'job-card-container')

            for card in job_cards:
                try:
                    job = {
                        'title': card.find_element(By.CLASS_NAME, 'job-card-list__title').text,
                        'location': card.find_element(By.CLASS_NAME, 'job-card-container__metadata-item').text,
                        'posted_date': card.find_element(By.CLASS_NAME, 'job-card-container__posted-date').text,
                        'applicants': card.find_element(By.CLASS_NAME, 'job-card-container__applicant-count').text
                    }
                    jobs_data.append(job)
                except:
                    continue

            # İş ilanı analizi
            df = pd.DataFrame(jobs_data)
            analysis = {
                'total_jobs': len(jobs_data),
                'locations': dict(Counter(df['location'])),
                'top_titles': dict(Counter(df['title']).most_common(5))
            }

            return analysis

        except Exception as e:
            print(f"Hata: {str(e)}")
            return None

    def analyze_employees(self, company_url: str) -> Dict[str, Any]:
        """Çalışan verilerini analiz eder."""
        try:
            self.driver.get(company_url + 'people/')
            time.sleep(5)

            employee_data = {
                'total_employees': 0,
                'departments': {},
                'locations': {},
                'roles': {}
            }

            # Toplam çalışan sayısı
            try:
                total = self.driver.find_element(By.CLASS_NAME, 'org-people__header-title').text
                employee_data['total_employees'] = int(re.search(r'\d+', total).group())
            except:
                pass

            # Departman dağılımı
            try:
                departments = self.driver.find_elements(By.CLASS_NAME, 'org-people-bar-graph-element')
                for dept in departments:
                    name = dept.find_element(By.CLASS_NAME, 'org-people-bar-graph-element__category').text
                    count = dept.find_element(By.CLASS_NAME, 'org-people-bar-graph-element__percentage').text
                    employee_data['departments'][name] = count
            except:
                pass

            return employee_data

        except Exception as e:
            print(f"Hata: {str(e)}")
            return None

    def analyze_growth(self, company_url: str) -> Dict[str, Any]:
        """Büyüme metriklerini analiz eder."""
        try:
            self.driver.get(company_url + 'insights/')
            time.sleep(5)

            growth_data = {
                'total_employees_growth': {},
                'followers_growth': {},
                'job_openings_growth': {}
            }

            # Çalışan büyümesi
            try:
                growth_chart = self.driver.find_element(By.CLASS_NAME, 'org-insights-module__content')
                months = growth_chart.find_elements(By.CLASS_NAME, 'month')
                values = growth_chart.find_elements(By.CLASS_NAME, 'value')

                for m, v in zip(months, values):
                    growth_data['total_employees_growth'][m.text] = v.text
            except:
                pass

            return growth_data

        except Exception as e:
            print(f"Hata: {str(e)}")
            return None

    def generate_report(self, company_url: str, output_dir: str):
        """Analiz raporu oluşturur."""
        os.makedirs(output_dir, exist_ok=True)

        print("Şirket bilgileri toplanıyor...")
        company_info = self.get_company_info(company_url)

        print("İş ilanları analiz ediliyor...")
        jobs_analysis = self.analyze_jobs(company_url)

        print("Çalışan verileri analiz ediliyor...")
        employee_analysis = self.analyze_employees(company_url)

        print("Büyüme metrikleri analiz ediliyor...")
        growth_analysis = self.analyze_growth(company_url)

        analysis = {
            'timestamp': datetime.now().isoformat(),
            'company_url': company_url,
            'company_info': company_info,
            'jobs_analysis': jobs_analysis,
            'employee_analysis': employee_analysis,
            'growth_analysis': growth_analysis
        }

        # JSON raporu
        with open(os.path.join(output_dir, 'company_analysis.json'), 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

        # Markdown raporu
        with open(os.path.join(output_dir, 'company_report.md'), 'w', encoding='utf-8') as f:
            f.write(f"# LinkedIn Şirket OSINT Raporu\n")
            f.write(f"Şirket: {company_info['basic_info'].get('name', 'N/A')}\n")
            f.write(f"Oluşturulma Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            f.write("## Temel Bilgiler\n")
            for key, value in company_info['basic_info'].items():
                f.write(f"- {key}: {value}\n")
            f.write("\n")

            f.write("## Genel Bakış\n")
            f.write(f"{company_info['overview'].get('description', 'N/A')}\n\n")

            f.write("## İş İlanı Analizi\n")
            if jobs_analysis:
                f.write(f"- Toplam İlan: {jobs_analysis['total_jobs']}\n")
                f.write("### Popüler Pozisyonlar\n")
                for title, count in jobs_analysis['top_titles'].items():
                    f.write(f"- {title}: {count}\n")
            f.write("\n")

            f.write("## Çalışan Analizi\n")
            if employee_analysis:
                f.write(f"- Toplam Çalışan: {employee_analysis['total_employees']}\n")
                f.write("### Departman Dağılımı\n")
                for dept, count in employee_analysis['departments'].items():
                    f.write(f"- {dept}: {count}\n")
            f.write("\n")

            f.write("## Büyüme Analizi\n")
            if growth_analysis and growth_analysis['total_employees_growth']:
                f.write("### Çalışan Büyümesi\n")
                for month, value in growth_analysis['total_employees_growth'].items():
                    f.write(f"- {month}: {value}\n")

        print(f"Analiz tamamlandı. Raporlar {output_dir} dizinine kaydedildi.")

    def __del__(self):
        """Driver'ı temizle."""
        if hasattr(self, 'driver'):
            self.driver.quit()

def main():
    parser = argparse.ArgumentParser(description='LinkedIn şirket analiz aracı')
    parser.add_argument('--url', required=True, help='Şirket LinkedIn URL')
    parser.add_argument('--output', required=True, help='Çıktı dizini')

    args = parser.parse_args()
    analyzer = CompanyAnalyzer()
    analyzer.generate_report(args.url, args.output)

if __name__ == "__main__":
    main()
