#!/usr/bin/env python3

import os
import sys
import json
import time
import argparse
from typing import Dict, List, Any
from datetime import datetime
import requests
from bs4 import BeautifulSoup
import re
from textblob import TextBlob
from collections import Counter
import pandas as pd
import networkx as nx

class PostAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

        cookie = os.getenv('INSTAGRAM_COOKIE')
        if not cookie:
            raise ValueError("INSTAGRAM_COOKIE ortam değişkeni tanımlanmamış")

        self.session.cookies.update({'sessionid': cookie})

    def get_post_info(self, post_url: str) -> Dict[str, Any]:
        """Gönderi bilgilerini toplar."""
        try:
            response = self.session.get(f"{post_url}?__a=1")
            data = response.json()

            post = data['items'][0]
            return {
                'id': post['id'],
                'type': post['media_type'],
                'caption': post.get('caption', {}).get('text', ''),
                'likes': post['like_count'],
                'comments': post['comment_count'],
                'timestamp': post['taken_at'],
                'location': post.get('location', {}),
                'hashtags': re.findall(r'#(\w+)', post.get('caption', {}).get('text', '')),
                'mentions': [user['user']['username'] for user in post.get('usertags', {}).get('in', [])],
                'media_url': post['image_versions2']['candidates'][0]['url'] if post['media_type'] == 1 else None
            }
        except Exception as e:
            print(f"Hata: {e}")
            return None

    def get_user_posts(self, username: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Kullanıcının gönderilerini listeler."""
        posts = []
        try:
            response = self.session.get(f"https://www.instagram.com/{username}/?__a=1")
            data = response.json()
            user_id = data['user']['id']

            has_next = True
            end_cursor = None

            while has_next and len(posts) < limit:
                variables = {
                    'id': user_id,
                    'first': 50,
                    'after': end_cursor
                }

                response = self.session.get(
                    'https://www.instagram.com/graphql/query/',
                    params={
                        'query_hash': '8c2a529969ee035a5063f2fc8602a0fd',
                        'variables': json.dumps(variables)
                    }
                )

                data = response.json()
                edges = data['data']['user']['edge_owner_to_timeline_media']['edges']

                for edge in edges:
                    node = edge['node']
                    posts.append({
                        'id': node['id'],
                        'type': 'IMAGE' if node['__typename'] == 'GraphImage' else 'VIDEO',
                        'caption': node.get('edge_media_to_caption', {}).get('edges', [{}])[0].get('node', {}).get('text', ''),
                        'likes': node['edge_media_preview_like']['count'],
                        'comments': node['edge_media_to_comment']['count'],
                        'timestamp': node['taken_at_timestamp'],
                        'location': node.get('location', {}),
                        'hashtags': re.findall(r'#(\w+)', node.get('edge_media_to_caption', {}).get('edges', [{}])[0].get('node', {}).get('text', '')),
                        'media_url': node['display_url']
                    })

                    if len(posts) >= limit:
                        break

                page_info = data['data']['user']['edge_owner_to_timeline_media']['page_info']
                has_next = page_info['has_next_page']
                end_cursor = page_info['end_cursor']

                time.sleep(2)  # Rate limiting

        except Exception as e:
            print(f"Hata: {e}")

        return posts

    def analyze_hashtags(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Hashtag analizi yapar."""
        all_hashtags = []
        for post in posts:
            all_hashtags.extend(post['hashtags'])

        counter = Counter(all_hashtags)
        return {
            'total_hashtags': len(all_hashtags),
            'unique_hashtags': len(counter),
            'most_used': dict(counter.most_common(10)),
            'avg_per_post': len(all_hashtags) / len(posts) if posts else 0
        }

    def analyze_engagement(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Etkileşim analizi yapar."""
        if not posts:
            return {}

        df = pd.DataFrame(posts)
        return {
            'total_likes': df['likes'].sum(),
            'total_comments': df['comments'].sum(),
            'avg_likes': df['likes'].mean(),
            'avg_comments': df['comments'].mean(),
            'engagement_rate': (df['likes'].sum() + df['comments'].sum()) / len(posts),
            'top_posts': df.nlargest(5, 'likes')[['id', 'likes', 'comments', 'caption']].to_dict('records')
        }

    def analyze_locations(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Konum analizi yapar."""
        locations = [post['location'] for post in posts if post.get('location')]
        counter = Counter(loc.get('name') for loc in locations if loc.get('name'))

        return {
            'total_locations': len(locations),
            'unique_locations': len(counter),
            'most_visited': dict(counter.most_common(5)),
            'location_percentage': len(locations) / len(posts) * 100 if posts else 0
        }

    def analyze_mentions(self, posts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Mention analizi yapar."""
        all_mentions = []
        for post in posts:
            all_mentions.extend(post['mentions'])

        counter = Counter(all_mentions)

        # Mention ağı oluştur
        G = nx.Graph()
        for post in posts:
            for mention in post['mentions']:
                G.add_edge(post['id'], mention)

        return {
            'total_mentions': len(all_mentions),
            'unique_mentions': len(counter),
            'most_mentioned': dict(counter.most_common(5)),
            'mention_network': {
                'total_connections': G.number_of_edges(),
                'central_posts': sorted(
                    [(node, degree) for node, degree in G.degree()],
                    key=lambda x: x[1],
                    reverse=True
                )[:5]
            }
        }

    def generate_report(self, posts: List[Dict[str, Any]], output_file: str):
        """Analiz raporu oluşturur."""
        if not posts:
            print("Uyarı: Analiz edilecek gönderi bulunamadı")
            return

        analysis = {
            'timestamp': datetime.now().isoformat(),
            'total_posts': len(posts),
            'posts': posts,
            'hashtag_analysis': self.analyze_hashtags(posts),
            'engagement_analysis': self.analyze_engagement(posts),
            'location_analysis': self.analyze_locations(posts),
            'mention_analysis': self.analyze_mentions(posts)
        }

        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

def main():
    parser = argparse.ArgumentParser(description='Instagram gönderi analiz aracı')
    parser.add_argument('--mode', choices=['single', 'list'], required=True,
                      help='Tek gönderi veya liste analizi modu')
    parser.add_argument('--url', help='Gönderi URL')
    parser.add_argument('--username', help='Kullanıcı adı')
    parser.add_argument('--limit', type=int, default=50, help='Maksimum gönderi sayısı')
    parser.add_argument('--output', required=True, help='Çıktı dosyası')

    args = parser.parse_args()
    analyzer = PostAnalyzer()

    if args.mode == 'single':
        if not args.url:
            print("Error: --url parametresi gerekli")
            sys.exit(1)
        post = analyzer.get_post_info(args.url)
        if post:
            analyzer.generate_report([post], args.output)
    else:
        if not args.username:
            print("Error: --username parametresi gerekli")
            sys.exit(1)
        posts = analyzer.get_user_posts(args.username, args.limit)
        analyzer.generate_report(posts, args.output)

if __name__ == "__main__":
    main()
