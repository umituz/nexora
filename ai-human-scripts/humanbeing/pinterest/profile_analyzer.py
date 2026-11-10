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
import matplotlib.pyplot as plt
import seaborn as sns
from wordcloud import WordCloud
import cv2
import numpy as np
from PIL import Image
import requests
from io import BytesIO
from colorthief import ColorThief

class ProfileAnalyzer:
    def __init__(self):
        load_dotenv()
        self.email = os.getenv('PINTEREST_EMAIL')
        self.password = os.getenv('PINTEREST_PASSWORD')
        if not self.email or not self.password:
            raise ValueError("PINTEREST_EMAIL ve PINTEREST_PASSWORD ortam değişkenleri tanımlanmamış")

        self.driver = self.setup_driver()
        self.login()
        self.sentiment_analyzer = SentimentIntensityAnalyzer()

    def setup_driver(self):
        """Selenium webdriver'ı yapılandırır."""
        chrome_options = Options()
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        service = Service('chromedriver')
        return webdriver.Chrome(service=service, options=chrome_options)

    def login(self):
        """Pinterest'e giriş yapar."""
        try:
            self.driver.get('https://www.pinterest.com/login/')
            time.sleep(5)

            # Email ve şifre gir
            email_input = self.driver.find_element(By.ID, "email")
            email_input.send_keys(self.email)
            password_input = self.driver.find_element(By.ID, "password")
            password_input.send_keys(self.password)
            time.sleep(2)

            # Giriş yap butonuna tıkla
            login_button = self.driver.find_element(By.XPATH, "//button[@type='submit']")
            login_button.click()
            time.sleep(5)

        except Exception as e:
            print(f"Giriş hatası: {str(e)}")
            sys.exit(1)

    def get_profile_info(self, username: str) -> Dict[str, Any]:
        """Profil bilgilerini toplar."""
        try:
            self.driver.get(f'https://www.pinterest.com/{username}/')
            time.sleep(5)

            profile_data = {
                'username': username,
                'basic_info': {},
                'stats': {},
                'boards': [],
                'interests': []
            }

            # Temel bilgiler
            try:
                profile_data['basic_info']['display_name'] = self.driver.find_element(By.XPATH, "//h1").text
                profile_data['basic_info']['bio'] = self.driver.find_element(By.XPATH, "//div[@data-test-id='profile-bio']").text
            except:
                pass

            # İstatistikler
            try:
                stats = self.driver.find_elements(By.XPATH, "//div[@data-test-id='profile-followers']//span")
                profile_data['stats']['followers'] = stats[0].text
                profile_data['stats']['following'] = stats[1].text
            except:
                pass

            # Panolar
            try:
                board_elements = self.driver.find_elements(By.XPATH, "//div[@data-test-id='board']")
                for element in board_elements:
                    board = {
                        'name': element.find_element(By.XPATH, ".//div[@title]").get_attribute('title'),
                        'pin_count': element.find_element(By.XPATH, ".//div[contains(@class, 'pinCount')]").text,
                        'url': element.find_element(By.TAG_NAME, "a").get_attribute('href')
                    }
                    profile_data['boards'].append(board)
            except:
                pass

            # İlgi alanları
            try:
                interest_elements = self.driver.find_elements(By.XPATH, "//div[@data-test-id='interest']")
                profile_data['interests'] = [element.text for element in interest_elements]
            except:
                pass

            return profile_data

        except Exception as e:
            print(f"Hata: {str(e)}")
            return None

    def get_pins(self, username: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Kullanıcının pinlerini toplar."""
        pins = []
        try:
            self.driver.get(f'https://www.pinterest.com/{username}/pins/')
            time.sleep(5)

            last_height = self.driver.execute_script("return document.body.scrollHeight")
            while len(pins) < limit:
                # Sayfayı aşağı kaydır
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(2)

                # Yeni pinleri bul
                pin_elements = self.driver.find_elements(By.XPATH, "//div[@data-test-id='pin']")

                for element in pin_elements:
                    if len(pins) >= limit:
                        break

                    try:
                        pin = {
                            'url': element.find_element(By.TAG_NAME, "a").get_attribute("href"),
                            'image_url': element.find_element(By.TAG_NAME, "img").get_attribute("src"),
                            'title': element.find_element(By.XPATH, ".//div[@data-test-id='pin-title']").text,
                            'description': element.find_element(By.XPATH, ".//div[@data-test-id='pin-description']").text,
                            'board': element.find_element(By.XPATH, ".//div[@data-test-id='board-name']").text,
                            'stats': {
                                'saves': element.find_element(By.XPATH, ".//div[@data-test-id='save-count']").text,
                                'comments': element.find_element(By.XPATH, ".//div[@data-test-id='comment-count']").text
                            }
                        }

                        # Renk analizi
                        try:
                            response = requests.get(pin['image_url'])
                            img = Image.open(BytesIO(response.content))
                            color_thief = ColorThief(BytesIO(response.content))
                            dominant_color = color_thief.get_color(quality=1)
                            pin['color_analysis'] = {
                                'dominant_color': dominant_color,
                                'palette': color_thief.get_palette(color_count=5)
                            }
                        except:
                            pin['color_analysis'] = None

                        pins.append(pin)
                    except:
                        continue

                # Sayfa sonuna gelip gelmediğimizi kontrol et
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height

            return pins

        except Exception as e:
            print(f"Hata: {str(e)}")
            return []

    def analyze_content(self, pins: List[Dict[str, Any]]) -> Dict[str, Any]:
        """İçerik analizi yapar."""
        all_text = []
        boards = []
        colors = []
        engagement_stats = []

        for pin in pins:
            if 'title' in pin:
                all_text.append(pin['title'])
            if 'description' in pin:
                all_text.append(pin['description'])
            if 'board' in pin:
                boards.append(pin['board'])
            if 'color_analysis' in pin and pin['color_analysis']:
                colors.append(pin['color_analysis']['dominant_color'])
            if 'stats' in pin:
                engagement_stats.append(pin['stats'])

        # Duygu analizi
        sentiments = []
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
            'board_analysis': {
                'total_boards': len(boards),
                'unique_boards': len(set(boards)),
                'most_active': dict(Counter(boards).most_common(10))
            },
            'color_analysis': {
                'total_colors': len(colors),
                'unique_colors': len(set(map(tuple, colors))),
                'most_common': dict(Counter(map(tuple, colors)).most_common(10))
            }
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

        # En aktif panolar
        plt.figure(figsize=(12, 6))
        boards = content_analysis['board_analysis']['most_active']
        plt.barh(list(boards.keys()), list(boards.values()))
        plt.title('En Aktif Panolar')
        plt.xlabel('Pin Sayısı')
        plt.savefig(os.path.join(output_dir, 'active_boards.png'))
        plt.close()

        # Renk paleti görselleştirmesi
        if content_analysis['color_analysis']['unique_colors'] > 0:
            plt.figure(figsize=(10, 2))
            colors = [list(map(lambda x: x/255, color)) for color in content_analysis['color_analysis']['most_common'].keys()]
            plt.bar(range(len(colors)), [1]*len(colors), color=colors)
            plt.title('En Sık Kullanılan Renkler')
            plt.xticks([])
            plt.savefig(os.path.join(output_dir, 'color_palette.png'))
            plt.close()

    def generate_report(self, username: str, output_dir: str):
        """Analiz raporu oluşturur."""
        os.makedirs(output_dir, exist_ok=True)

        print("Profil bilgileri toplanıyor...")
        profile_info = self.get_profile_info(username)
        if not profile_info:
            return

        print("Pinler toplanıyor...")
        pins = self.get_pins(username)

        print("İçerik analizi yapılıyor...")
        content_analysis = self.analyze_content(pins)

        print("Görselleştirmeler oluşturuluyor...")
        self.generate_visualizations(content_analysis, output_dir)

        analysis = {
            'timestamp': datetime.now().isoformat(),
            'username': username,
            'profile_info': profile_info,
            'content_analysis': content_analysis,
            'data_summary': {
                'total_pins': len(pins)
            }
        }

        # JSON raporu
        with open(os.path.join(output_dir, 'profile_analysis.json'), 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

        # Markdown raporu
        with open(os.path.join(output_dir, 'profile_report.md'), 'w', encoding='utf-8') as f:
            f.write(f"# Pinterest Profil OSINT Raporu\n")
            f.write(f"Kullanıcı: {username}\n")
            f.write(f"Oluşturulma Tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")

            f.write("## Temel Bilgiler\n")
            for key, value in profile_info['basic_info'].items():
                f.write(f"- {key}: {value}\n")
            f.write("\n")

            f.write("## İstatistikler\n")
            for key, value in profile_info['stats'].items():
                f.write(f"- {key}: {value}\n")
            f.write("\n")

            f.write("## Panolar\n")
            for board in profile_info['boards']:
                f.write(f"- {board['name']} ({board['pin_count']} pin)\n")
            f.write("\n")

            f.write("## İlgi Alanları\n")
            for interest in profile_info['interests']:
                f.write(f"- {interest}\n")
            f.write("\n")

            f.write("## İçerik Analizi\n")
            f.write("### Duygu Analizi\n")
            sentiment = content_analysis['sentiment_analysis']['sentiment_distribution']
            f.write(f"- Pozitif: {sentiment['positive']}\n")
            f.write(f"- Nötr: {sentiment['neutral']}\n")
            f.write(f"- Negatif: {sentiment['negative']}\n")
            f.write("\n")

            f.write("### Pano Analizi\n")
            f.write(f"- Toplam Pano: {content_analysis['board_analysis']['total_boards']}\n")
            f.write(f"- Benzersiz Pano: {content_analysis['board_analysis']['unique_boards']}\n")
            f.write("\n#### En Aktif Panolar\n")
            for board, count in content_analysis['board_analysis']['most_active'].items():
                f.write(f"- {board}: {count} pin\n")
            f.write("\n")

            f.write("### Renk Analizi\n")
            f.write(f"- Toplam Renk: {content_analysis['color_analysis']['total_colors']}\n")
            f.write(f"- Benzersiz Renk: {content_analysis['color_analysis']['unique_colors']}\n")
            f.write("\n")

            f.write("## Görselleştirmeler\n")
            f.write("- [Duygu Dağılımı](sentiment_distribution.png)\n")
            f.write("- [En Aktif Panolar](active_boards.png)\n")
            f.write("- [Renk Paleti](color_palette.png)\n")

        print(f"Analiz tamamlandı. Raporlar {output_dir} dizinine kaydedildi.")

    def __del__(self):
        """Driver'ı temizle."""
        if hasattr(self, 'driver'):
            self.driver.quit()

def main():
    parser = argparse.ArgumentParser(description='Pinterest profil analiz aracı')
    parser.add_argument('--username', required=True, help='Pinterest kullanıcı adı')
    parser.add_argument('--output', required=True, help='Çıktı dizini')

    args = parser.parse_args()
    analyzer = ProfileAnalyzer()
    analyzer.generate_report(args.username, args.output)

if __name__ == "__main__":
    main()
