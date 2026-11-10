#!/usr/bin/env python3

import os
import sys
import json
import time
from datetime import datetime
from typing import Dict, List, Any
from googleapiclient.discovery import build
from textblob import TextBlob
import pandas as pd
from collections import Counter
import networkx as nx

class CommentAnalyzer:
    def __init__(self):
        api_key = os.getenv('YOUTUBE_API_KEY')
        if not api_key:
            raise ValueError("YOUTUBE_API_KEY ortam değişkeni tanımlanmamış")

        self.youtube = build('youtube', 'v3', developerKey=api_key)

    def get_comments(self, video_id: str) -> List[Dict[str, Any]]:
        """Video yorumlarını toplar."""
        comments = []
        next_page_token = None

        while True:
            request = self.youtube.commentThreads().list(
                part='snippet,replies',
                videoId=video_id,
                maxResults=100,
                pageToken=next_page_token
            )

            try:
                response = request.execute()
            except Exception as e:
                print(f"Hata: {e}")
                break

            for item in response['items']:
                comment = item['snippet']['topLevelComment']['snippet']
                comments.append({
                    'author': comment['authorDisplayName'],
                    'text': comment['textDisplay'],
                    'likes': comment['likeCount'],
                    'published_at': comment['publishedAt'],
                    'reply_count': item['snippet']['totalReplyCount']
                })

                # Alt yorumları topla
                if item['snippet']['totalReplyCount'] > 0 and 'replies' in item:
                    for reply in item['replies']['comments']:
                        reply_snippet = reply['snippet']
                        comments.append({
                            'author': reply_snippet['authorDisplayName'],
                            'text': reply_snippet['textDisplay'],
                            'likes': reply_snippet['likeCount'],
                            'published_at': reply_snippet['publishedAt'],
                            'reply_to': comment['authorDisplayName']
                        })

            next_page_token = response.get('nextPageToken')
            if not next_page_token:
                break

            time.sleep(1)  # API rate limiting

        return comments

    def analyze_sentiment(self, comments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Duygu analizi yapar."""
        sentiments = []
        for comment in comments:
            blob = TextBlob(comment['text'])
            sentiments.append(blob.sentiment.polarity)

        return {
            'positive': len([s for s in sentiments if s > 0]),
            'negative': len([s for s in sentiments if s < 0]),
            'neutral': len([s for s in sentiments if s == 0]),
            'average_sentiment': sum(sentiments) / len(sentiments) if sentiments else 0
        }

    def analyze_engagement(self, comments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Etkileşim analizi yapar."""
        total_likes = sum(c['likes'] for c in comments)
        authors = Counter(c['author'] for c in comments)

        return {
            'total_comments': len(comments),
            'total_likes': total_likes,
            'unique_commenters': len(authors),
            'top_commenters': dict(authors.most_common(10)),
            'avg_likes_per_comment': total_likes / len(comments) if comments else 0
        }

    def analyze_timing(self, comments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Zamanlama analizi yapar."""
        dates = [datetime.fromisoformat(c['published_at'].replace('Z', '+00:00'))
                for c in comments]
        df = pd.DataFrame({'datetime': dates})

        hourly = df.groupby(df['datetime'].dt.hour).size().to_dict()
        daily = df.groupby(df['datetime'].dt.day_name()).size().to_dict()

        return {
            'comments_by_hour': hourly,
            'comments_by_day': daily,
            'first_comment': min(dates).isoformat(),
            'last_comment': max(dates).isoformat()
        }

    def analyze_network(self, comments: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Etkileşim ağı analizi yapar."""
        G = nx.Graph()

        for comment in comments:
            if 'reply_to' in comment:
                G.add_edge(comment['author'], comment['reply_to'])

        if G.number_of_nodes() == 0:
            return {'network_stats': 'Etkileşim ağı oluşturulamadı'}

        return {
            'total_interactions': G.number_of_edges(),
            'unique_interacting_users': G.number_of_nodes(),
            'most_interactive_users': sorted(
                [(node, degree) for node, degree in G.degree()],
                key=lambda x: x[1],
                reverse=True
            )[:5]
        }

    def generate_report(self, video_id: str, output_dir: str):
        """Analiz raporu oluşturur."""
        comments = self.get_comments(video_id)
        if not comments:
            print(f"Uyarı: {video_id} için yorum bulunamadı")
            return

        analysis = {
            'video_id': video_id,
            'timestamp': datetime.now().isoformat(),
            'total_comments': len(comments),
            'sentiment_analysis': self.analyze_sentiment(comments),
            'engagement_analysis': self.analyze_engagement(comments),
            'timing_analysis': self.analyze_timing(comments),
            'network_analysis': self.analyze_network(comments)
        }

        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, f'{video_id}_analysis.json')

        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

def main():
    if len(sys.argv) != 3:
        print("Kullanım: python3 comment_analyzer.py <video_id> <output_dir>")
        sys.exit(1)

    video_id = sys.argv[1]
    output_dir = sys.argv[2]

    analyzer = CommentAnalyzer()
    analyzer.generate_report(video_id, output_dir)

if __name__ == "__main__":
    main()

