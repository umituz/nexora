#!/usr/bin/env python3

import os
import sys
import json
import time
import argparse
from typing import Dict, List, Any
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pandas as pd
import networkx as nx
from collections import Counter
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from tqdm import tqdm
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import re
from urlextract import URLExtract
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud

class ProfileAnalyzer:
    def __init__(self):
        load_dotenv()
        self.email = os.getenv('FACEBOOK_EMAIL')
        self.password = os.getenv('FACEBOOK_PASSWORD')
        if not self.email or not self.password:
            raise ValueError("FACEBOOK_EMAIL ve FACEBOOK_PASSWORD ortam değişkenleri tanımlanmamış")

        self.driver = self.setup_driver()
        self.login()
        self.url_extractor = URLExtract()
        self.sentiment_analyzer = SentimentIntensityAnalyzer()

    def setup_driver(self):
        """Selenium webdriver'ı yapılandırır."""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('--disable-notifications')
        service = Service('chromedriver')
        return webdriver.Chrome(service=service, options=chrome_options)

    def login(self):
        """Facebook'a giriş yapar."""
        try:
            self.driver.get('https://www.facebook.com')
            email_elem = self.driver.find_element(By.ID, 'email')
            email_elem.send_keys(self.email)
            pass_elem = self.driver.find_element(By.ID, 'pass')
            pass_elem.send_keys(self.password)
            pass_elem.submit()
            time.sleep(5)
        except Exception as e:
            print(f"Giriş hatası: {str(e)}")
            sys.exit(1)

    def get_profile_info(self, profile_url: str) -> Dict[str, Any]:
        """Profil bilgilerini toplar."""
        try:
            self.driver.get(profile_url + '/about')
            time.sleep(5)

            profile_data = {
                'basic_info': {},
                'work': [],
                'education': [],
                'places': [],
                'contact': {},
                'relationships': {}
            }

            # Temel bilgiler
            try:
                name = self.driver.find_element(By.XPATH, "//h1").text
                profile_data['basic_info']['name'] = name
            except:
                pass

            # İş geçmişi
            try:
                work_section = self.driver.find_element(By.XPATH, "//div[contains(@id, 'work')]")
                work_items = work_section.find_elements(By.XPATH, ".//div[@role='listitem']")
                for item in work_items:
                    try:
                        profile_data['work'].append({
                            'company': item.find_element(By.XPATH, ".//a").text,
                            'position': item.find_element(By.XPATH, ".//div[2]").text,
                            'period': item.find_element(By.XPATH, ".//div[3]").text
                        })
                    except:
                        continue
            except:
                pass

            # Eğitim bilgileri
            try:
                edu_section = self.driver.find_element(By.XPATH, "//div[contains(@id, 'education')]")
                edu_items = edu_section.find_elements(By.XPATH, ".//div[@role='listitem']")
                for item in edu_items:
                    try:
                        profile_data['education'].append({
                            'school': item.find_element(By.XPATH, ".//a").text,
                            'type': item.find_element(By.XPATH, ".//div[2]").text,
                            'period': item.find_element(By.XPATH, ".//div[3]").text
                        })
                    except:
                        continue
            except:
                pass

            return profile_data

        except Exception as e:
            print(f"Hata: {str(e)}")
            return None

    def get_posts(self, profile_url: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Profil gönderilerini toplar."""
        posts = []
        try:
            self.driver.get(profile_url)
            time.sleep(5)

            last_height = self.driver.execute_script("return document.body.scrollHeight")
            while len(posts) < limit:
                # Sayfayı aşağı kaydır
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)

                # Yeni gönderileri bul
                post_elements = self.driver.find_elements(By.XPATH, "//div[@role='article']")

                for element in post_elements:
                    if len(posts) >= limit:
                        break

                    try:
                        post = {
                            'text': element.find_element(By.XPATH, ".//div[contains(@data-ad-preview,'message')]").text,
                            'timestamp': element.find_element(By.XPATH, ".//a[contains(@href, '/posts/')]").get_attribute('aria-label'),
                            'reactions': element.find_element(By.XPATH, ".//span[contains(@class,'reactions')]").text,
                            'comments': element.find_element(By.XPATH, ".//span[contains(@class,'comments')]").text,
                            'shares': element.find_element(By.XPATH, ".//span[contains(@class,'shares')]").text
                        }

                        # Medya kontrolü
                        try:
                            media = element.find_element(By.XPATH, ".//img[contains(@class,'image')]")
                            post['media_type'] = 'image'
                            post['media_url'] = media.get_attribute('src')
                        except:
                            try:
                                video = element.find_element(By.XPATH, ".//video")
                                post['media_type'] = 'video'
                                post['media_url'] = video.get_attribute('src')
                            except:
                                post['media_type'] = 'text'
                                post['media_url'] = None

                        posts.append(post)
                    except:
                        continue

                # Sayfa sonuna gelip gelmediğimizi kontrol et
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height

            return posts

        except Exception as e:
            print(f"Hata: {str(e)}")
            return []

    def analyze_content(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """İçerik analizi yapar."""
        all_text = []
        urls = []
        sentiments = []
        media_types = []

        for post in posts:
            if 'text' in post:
                all_text.append(post['text'])
                urls.extend(self.url_extractor.find_urls(post['text']))
            if 'media_type' in post:
                media_types.append(post['media_type'])

        # Duygu analizi
        for text in all_text:
            blob = TextBlob(text)
            vader_scores = self.sentiment_analyzer.polarity_scores(text)
            sentiments.append({
                'textblob_polarity': blob.sentiment.polarity,
                'textblob_subjectivity': blob.sentiment.subjectivity,
                'vader_compound': vader_scores['compound']
            })

        df = pd.DataFrame(sentiments)
        content_analysis = {
            'sentiment_analysis': {
                'average_sentiment': {
                    'textblob_polarity': df['textblob_polarity'].mean() if not df.empty else 0,
                    'textblob_subjectivity': df['textblob_subjectivity'].mean() if not df.empty else 0,
                    'vader_compound': df['vader_compound'].mean() if not df.empty else 0
                },
                'sentiment_distribution': {
                    'positive': len(df[df['vader_compound'] > 0.05]) if not df.empty else 0,
                    'neutral': len(df[(df['vader_compound'] >= -0.05) & (df['vader_compound'] <= 0.05)]) if not df.empty else 0,
                    'negative': len(df[df['vader_compound'] < -0.05]) if not df.empty else 0
                }
            },
            'url_analysis': {
                'total_urls': len(urls),
                'unique_urls': len(set(urls)),
                'domains': dict(Counter([url.split('/')[2] for url in urls if '/' in url]).most_common(10))
            },
            'media_analysis': dict(Counter(media_types))
        }

        return content_analysis

    def generate_visualizations(self, content_analysis: Dict[str, Any], output_dir: str):
        """Görselleştirmeler oluşturur."""
        # Duygu dağılımı grafiği
        plt.figure(figsize=(10, 6))
        sentiment_dist = content_analysis['sentiment_analysis']['sentiment_distribution']
        plt.bar(sentiment_dist.keys(), sentiment_dist.values())
        plt.title('Duygu Dağılımı')
        plt.savefig(os.path.join(output_dir, 'sentiment_distribution.png'))
        plt.close()

        # Medya türü dağılımı grafiği
        plt.figure(figsize=(10, 6))
        media_dist = content_analysis['media_analysis']
        plt.pie(media_dist.values(), labels=media_dist.keys(), autopct='%1.1f%%')
        plt.title('Medya Türü Dağılımı')
        plt.savefig(os.path.join(output_dir, 'media_distribution.png'))
        plt.close()

    def generate_report(self, profile_url: str, output_dir: str):
        """Analiz raporu oluşturur."""
        os.makedirs(output_dir, exist_ok=True)

        print("Profil bilgileri toplanıyor...")
        profile_info = self.get_profile_info(profile_url)
        if not profile_info:
            return

        print("Gönderiler toplanıyor...")
        posts = self.get_posts(profile_url)

        print("İçerik analizi yapılıyor...")
        content_analysis = self.analyze_content(posts)

        print("Görselleştirmeler oluşturuluyor...")
        self.generate_visualizations(content_analysis, output_dir)

        analysis = {
            'timestamp': datetime.now().isoformat(),
            'profile_url': profile_url,
            'profile_info': profile_info,
            'content_analysis': content_analysis,
            'data_summary': {
                'total_posts': len(posts)
            }
        }

        # JSON raporu
        with open(os.path.join(output_dir, 'profile_analysis.json'), 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

        # Markdown raporu
        with open(os.path.join(output_dir, 'profile_report.md'), 'w', encoding='utf-8') as f:
            f.write(f"# Facebook Profil OSINT Raporu\n")
            f.write(f"Profil URL: {profile_url}\n")
            f.write(f"Oluşturulma Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            f.write("## Temel Bilgiler\n")
            for key, value in profile_info['basic_info'].items():
                f.write(f"- {key}: {value}\n")
            f.write("\n")

            f.write("## İş Geçmişi\n")
            for work in profile_info['work']:
                f.write(f"- {work['company']} - {work['position']} ({work['period']})\n")
            f.write("\n")

            f.write("## Eğitim Bilgileri\n")
            for edu in profile_info['education']:
                f.write(f"- {edu['school']} - {edu['type']} ({edu['period']})\n")
            f.write("\n")

            f.write("## İçerik Analizi\n")
            f.write("### Duygu Analizi\n")
            sentiment = content_analysis['sentiment_analysis']['sentiment_distribution']
            f.write(f"- Pozitif: {sentiment['positive']}\n")
            f.write(f"- Nötr: {sentiment['neutral']}\n")
            f.write(f"- Negatif: {sentiment['negative']}\n")
            f.write("\n")

            f.write("### Medya Analizi\n")
            for media_type, count in content_analysis['media_analysis'].items():
                f.write(f"- {media_type}: {count}\n")
            f.write("\n")

            f.write("### URL Analizi\n")
            f.write(f"- Toplam URL: {content_analysis['url_analysis']['total_urls']}\n")
            f.write(f"- Benzersiz URL: {content_analysis['url_analysis']['unique_urls']}\n")
            f.write("\n#### En Çok Paylaşılan Domainler\n")
            for domain, count in content_analysis['url_analysis']['domains'].items():
                f.write(f"- {domain}: {count}\n")

            f.write("\n## Görselleştirmeler\n")
            f.write("- [Duygu Dağılımı](sentiment_distribution.png)\n")
            f.write("- [Medya Türü Dağılımı](media_distribution.png)\n")

        print(f"Analiz tamamlandı. Raporlar {output_dir} dizinine kaydedildi.")

    def __del__(self):
        """Driver'ı temizle."""
        if hasattr(self, 'driver'):
            self.driver.quit()

def main():
    parser = argparse.ArgumentParser(description='Facebook profil analiz aracı')
    parser.add_argument('--profile', required=True, help='Facebook profil URL')
    parser.add_argument('--output', required=True, help='Çıktı dizini')

    args = parser.parse_args()
    analyzer = ProfileAnalyzer()
    analyzer.generate_report(args.profile, args.output)

if __name__ == "__main__":
    main()
