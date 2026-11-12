#!/usr/bin/env python3

import os
import sys
import json
import time
from datetime import datetime
from typing import Dict, List, Any
import requests
from bs4 import BeautifulSoup
import re
from collections import Counter
import pandas as pd
import networkx as nx

class StoryAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

        cookie = os.getenv('INSTAGRAM_COOKIE')
        if not cookie:
            raise ValueError("INSTAGRAM_COOKIE ortam değişkeni tanımlanmamış")

        self.session.cookies.update({'sessionid': cookie})

    def get_user_stories(self, username: str) -> List[Dict[str, Any]]:
        """Kullanıcının hikayelerini toplar."""
        try:
            # Önce kullanıcı ID'sini al
            response = self.session.get(f"https://www.instagram.com/{username}/?__a=1")
            data = response.json()
            user_id = data['user']['id']

            # Hikayeleri al
            response = self.session.get(
                f"https://i.instagram.com/api/v1/feed/user/{user_id}/story/",
                headers={'X-IG-App-ID': '936619743392459'}
            )
            data = response.json()

            stories = []
            for item in data.get('reel', {}).get('items', []):
                story = {
                    'id': item['id'],
                    'type': 'VIDEO' if item.get('video_duration') else 'IMAGE',
                    'taken_at': item['taken_at'],
                    'expiring_at': item['expiring_at'],
                    'media_url': item['image_versions2']['candidates'][0]['url'],
                    'video_url': item.get('video_versions', [{}])[0].get('url'),
                    'mentions': [user['user']['username'] for user in item.get('reel_mentions', [])],
                    'location': item.get('story_locations', [{}])[0].get('location', {}),
                    'hashtags': [tag['tag']['name'] for tag in item.get('story_hashtags', [])],
                    'poll': item.get('story_polls', []),
                    'question': item.get('story_questions', []),
                    'quiz': item.get('story_quizs', []),
                    'slider': item.get('story_sliders', [])
                }
                stories.append(story)

            return stories

        except Exception as e:
            print(f"Hata: {e}")
            return []

    def analyze_interactions(self, stories: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Hikaye etkileşimlerini analiz eder."""
        interactions = {
            'polls': [],
            'questions': [],
            'quizzes': [],
            'sliders': []
        }

        for story in stories:
            if story.get('poll'):
                for poll in story['poll']:
                    interactions['polls'].append({
                        'story_id': story['id'],
                        'question': poll['question'],
                        'options': poll['tallies']
                    })

            if story.get('question'):
                for question in story['question']:
                    interactions['questions'].append({
                        'story_id': story['id'],
                        'question': question['question']
                    })

            if story.get('quiz'):
                for quiz in story['quiz']:
                    interactions['quizzes'].append({
                        'story_id': story['id'],
                        'question': quiz['question'],
                        'options': quiz['options']
                    })

            if story.get('slider'):
                for slider in story['slider']:
                    interactions['sliders'].append({
                        'story_id': story['id'],
                        'question': slider['question'],
                        'emoji': slider.get('emoji')
                    })

        return interactions

    def analyze_mentions(self, stories: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Mention analizini yapar."""
        all_mentions = []
        for story in stories:
            all_mentions.extend(story['mentions'])

        counter = Counter(all_mentions)

        # Mention ağı oluştur
        G = nx.Graph()
        for story in stories:
            for mention in story['mentions']:
                G.add_edge(story['id'], mention)

        return {
            'total_mentions': len(all_mentions),
            'unique_mentions': len(counter),
            'most_mentioned': dict(counter.most_common(5)),
            'mention_network': {
                'total_connections': G.number_of_edges(),
                'central_stories': sorted(
                    [(node, degree) for node, degree in G.degree()],
                    key=lambda x: x[1],
                    reverse=True
                )[:5]
            }
        }

    def analyze_locations(self, stories: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Konum analizini yapar."""
        locations = [story['location'] for story in stories if story.get('location')]
        counter = Counter(loc.get('name') for loc in locations if loc.get('name'))

        return {
            'total_locations': len(locations),
            'unique_locations': len(counter),
            'most_visited': dict(counter.most_common(5)),
            'location_percentage': len(locations) / len(stories) * 100 if stories else 0
        }

    def analyze_hashtags(self, stories: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Hashtag analizini yapar."""
        all_hashtags = []
        for story in stories:
            all_hashtags.extend(story['hashtags'])

        counter = Counter(all_hashtags)
        return {
            'total_hashtags': len(all_hashtags),
            'unique_hashtags': len(counter),
            'most_used': dict(counter.most_common(10)),
            'avg_per_story': len(all_hashtags) / len(stories) if stories else 0
        }

    def analyze_timing(self, stories: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Zamanlama analizini yapar."""
        dates = [datetime.fromtimestamp(story['taken_at']) for story in stories]
        df = pd.DataFrame({'datetime': dates})

        hourly = df.groupby(df['datetime'].dt.hour).size().to_dict()
        daily = df.groupby(df['datetime'].dt.day_name()).size().to_dict()

        return {
            'stories_by_hour': hourly,
            'stories_by_day': daily,
            'first_story': min(dates).isoformat(),
            'last_story': max(dates).isoformat()
        }

    def generate_report(self, username: str, output_dir: str):
        """Analiz raporu oluşturur."""
        stories = self.get_user_stories(username)
        if not stories:
            print(f"Uyarı: {username} için hikaye bulunamadı")
            return

        analysis = {
            'username': username,
            'timestamp': datetime.now().isoformat(),
            'total_stories': len(stories),
            'stories': stories,
            'interaction_analysis': self.analyze_interactions(stories),
            'mention_analysis': self.analyze_mentions(stories),
            'location_analysis': self.analyze_locations(stories),
            'hashtag_analysis': self.analyze_hashtags(stories),
            'timing_analysis': self.analyze_timing(stories)
        }

        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, f'{username}_stories_analysis.json')

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

def main():
    if len(sys.argv) != 3:
        print("Kullanım: python3 story_analyzer.py <username> <output_dir>")
        sys.exit(1)

    username = sys.argv[1]
    output_dir = sys.argv[2]

    analyzer = StoryAnalyzer()
    analyzer.generate_report(username, output_dir)

if __name__ == "__main__":
    main()
