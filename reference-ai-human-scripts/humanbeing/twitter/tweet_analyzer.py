#!/usr/bin/env python3

import os
import sys
import json
import time
import argparse
from typing import Dict, List, Any
from datetime import datetime
import tweepy
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from collections import Counter
import pandas as pd
import networkx as nx
from urlextract import URLExtract
from tqdm import tqdm
from dotenv import load_dotenv

class TweetAnalyzer:
    def __init__(self):
        load_dotenv()
        bearer_token = os.getenv('TWITTER_BEARER_TOKEN')
        if not bearer_token:
            raise ValueError("TWITTER_BEARER_TOKEN ortam değişkeni tanımlanmamış")

        self.client = tweepy.Client(bearer_token=bearer_token)
        self.url_extractor = URLExtract()
        self.sentiment_analyzer = SentimentIntensityAnalyzer()

    def get_tweet_info(self, tweet_id: str) -> Dict[str, Any]:
        """Tek bir tweet'in bilgilerini toplar."""
        try:
            tweet = self.client.get_tweet(
                tweet_id,
                expansions=['author_id', 'attachments.media_keys'],
                tweet_fields=['created_at', 'public_metrics', 'entities', 'context_annotations'],
                media_fields=['url', 'preview_image_url', 'type']
            )

            if not tweet.data:
                return None

            tweet_data = tweet.data
            return {
                'id': tweet_data.id,
                'text': tweet_data.text,
                'created_at': tweet_data.created_at.isoformat(),
                'metrics': tweet_data.public_metrics,
                'hashtags': [tag['tag'] for tag in tweet_data.entities.get('hashtags', [])],
                'mentions': [mention['username'] for mention in tweet_data.entities.get('mentions', [])],
                'urls': [url['expanded_url'] for url in tweet_data.entities.get('urls', [])],
                'media_urls': [media.url for media in tweet.includes.get('media', [])] if tweet.includes else []
            }
        except Exception as e:
            print(f"Hata: {e}")
            return None

    def get_user_tweets(self, user_id: str, limit: int = 100) -> List[Dict[str, Any]]:
        """Kullanıcının tweet'lerini listeler."""
        tweets = []
        try:
            for tweet in tweepy.Paginator(
                self.client.get_users_tweets,
                user_id,
                max_results=100,
                expansions=['attachments.media_keys'],
                tweet_fields=['created_at', 'public_metrics', 'entities', 'context_annotations'],
                media_fields=['url', 'preview_image_url', 'type'],
                limit=limit//100
            ):
                if not tweet.data:
                    continue

                for t in tweet.data:
                    tweet_data = {
                        'id': t.id,
                        'text': t.text,
                        'created_at': t.created_at.isoformat(),
                        'like_count': t.public_metrics['like_count'],
                        'retweet_count': t.public_metrics['retweet_count'],
                        'reply_count': t.public_metrics['reply_count'],
                        'quote_count': t.public_metrics['quote_count'],
                        'hashtags': [tag['tag'] for tag in t.entities.get('hashtags', [])] if t.entities else [],
                        'mentions': [mention['username'] for mention in t.entities.get('mentions', [])] if t.entities else [],
                        'urls': [url['expanded_url'] for url in t.entities.get('urls', [])] if t.entities else [],
                        'media_urls': []
                    }

                    if tweet.includes and 'media' in tweet.includes:
                        tweet_data['media_urls'] = [media.url for media in tweet.includes['media']]

                    tweets.append(tweet_data)

                    if len(tweets) >= limit:
                        break

                time.sleep(1)  # Rate limiting

        except Exception as e:
            print(f"Hata: {e}")

        return tweets

    def analyze_sentiment(self, tweets: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Duygu analizi yapar."""
        sentiments = []
        for tweet in tweets:
            text = tweet['text']
            blob = TextBlob(text)
            vader_scores = self.sentiment_analyzer.polarity_scores(text)

            sentiments.append({
                'tweet_id': tweet['id'],
                'textblob_polarity': blob.sentiment.polarity,
                'textblob_subjectivity': blob.sentiment.subjectivity,
                'vader_compound': vader_scores['compound'],
                'vader_pos': vader_scores['pos'],
                'vader_neu': vader_scores['neu'],
                'vader_neg': vader_scores['neg']
            })

        df = pd.DataFrame(sentiments)
        return {
            'average_sentiment': {
                'textblob_polarity': df['textblob_polarity'].mean(),
                'textblob_subjectivity': df['textblob_subjectivity'].mean(),
                'vader_compound': df['vader_compound'].mean()
            },
            'sentiment_distribution': {
                'positive': len(df[df['vader_compound'] > 0.05]),
                'neutral': len(df[(df['vader_compound'] >= -0.05) & (df['vader_compound'] <= 0.05)]),
                'negative': len(df[df['vader_compound'] < -0.05])
            },
            'tweet_sentiments': sentiments
        }

    def analyze_hashtags(self, tweets: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Hashtag analizi yapar."""
        all_hashtags = []
        for tweet in tweets:
            all_hashtags.extend(tweet['hashtags'])

        counter = Counter(all_hashtags)
        return {
            'total_hashtags': len(all_hashtags),
            'unique_hashtags': len(counter),
            'most_used': dict(counter.most_common(10)),
            'avg_per_tweet': len(all_hashtags) / len(tweets) if tweets else 0,
            'hashtag_frequency': dict(counter)
        }

    def analyze_mentions(self, tweets: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Mention analizi yapar."""
        all_mentions = []
        for tweet in tweets:
            all_mentions.extend(tweet['mentions'])

        counter = Counter(all_mentions)

        # Mention ağı oluştur
        G = nx.Graph()
        for tweet in tweets:
            for mention in tweet['mentions']:
                G.add_edge(str(tweet['id']), mention)

        return {
            'total_mentions': len(all_mentions),
            'unique_mentions': len(counter),
            'most_mentioned': dict(counter.most_common(5)),
            'mention_network': {
                'total_connections': G.number_of_edges(),
                'central_tweets': sorted(
                    [(node, degree) for node, degree in G.degree()],
                    key=lambda x: x[1],
                    reverse=True
                )[:5]
            }
        }

    def analyze_urls(self, tweets: List[Dict[str, Any]]) -> Dict[str, Any]:
        """URL analizi yapar."""
        all_urls = []
        domains = []
        for tweet in tweets:
            urls = tweet['urls']
            all_urls.extend(urls)
            for url in urls:
                try:
                    domain = self.url_extractor.find_urls(url)[0].split('/')[2]
                    domains.append(domain)
                except:
                    continue

        url_counter = Counter(all_urls)
        domain_counter = Counter(domains)

        return {
            'total_urls': len(all_urls),
            'unique_urls': len(url_counter),
            'most_shared_urls': dict(url_counter.most_common(5)),
            'most_shared_domains': dict(domain_counter.most_common(5)),
            'url_frequency': dict(url_counter)
        }

    def generate_report(self, tweets: List[Dict[str, Any]], output_file: str):
        """Analiz raporu oluşturur."""
        if not tweets:
            print("Uyarı: Analiz edilecek tweet bulunamadı")
            return

        analysis = {
            'timestamp': datetime.now().isoformat(),
            'total_tweets': len(tweets),
            'tweets': tweets,
            'sentiment_analysis': self.analyze_sentiment(tweets),
            'hashtag_analysis': self.analyze_hashtags(tweets),
            'mention_analysis': self.analyze_mentions(tweets),
            'url_analysis': self.analyze_urls(tweets)
        }

        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

def main():
    parser = argparse.ArgumentParser(description='Twitter tweet analiz aracı')
    parser.add_argument('--mode', choices=['single', 'list'], required=True,
                      help='Tek tweet veya liste analizi modu')
    parser.add_argument('--tweet-id', help='Tweet ID')
    parser.add_argument('--user-id', help='Kullanıcı ID')
    parser.add_argument('--limit', type=int, default=100, help='Maksimum tweet sayısı')
    parser.add_argument('--output', required=True, help='Çıktı dosyası')

    args = parser.parse_args()
    analyzer = TweetAnalyzer()

    if args.mode == 'single':
        if not args.tweet_id:
            print("Error: --tweet-id parametresi gerekli")
            sys.exit(1)
        tweet = analyzer.get_tweet_info(args.tweet_id)
        if tweet:
            analyzer.generate_report([tweet], args.output)
    else:
        if not args.user_id:
            print("Error: --user-id parametresi gerekli")
            sys.exit(1)
        tweets = analyzer.get_user_tweets(args.user_id, args.limit)
        analyzer.generate_report(tweets, args.output)

if __name__ == "__main__":
    main()
