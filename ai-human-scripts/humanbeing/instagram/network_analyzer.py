#!/usr/bin/env python3

import os
import sys
import json
import time
import argparse
from typing import Dict, List, Any, Set
from datetime import datetime
import requests
import networkx as nx
from collections import Counter, defaultdict
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

class NetworkAnalyzer:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })

        cookie = os.getenv('INSTAGRAM_COOKIE')
        if not cookie:
            raise ValueError("INSTAGRAM_COOKIE ortam değişkeni tanımlanmamış")

        self.session.cookies.update({'sessionid': cookie})
        self.rate_limit_delay = 2  # saniye

    def get_user_info(self, username: str) -> Dict[str, Any]:
        """Kullanıcı bilgilerini alır."""
        try:
            response = self.session.get(f"https://www.instagram.com/{username}/?__a=1")
            data = response.json()
            return {
                'id': data['user']['id'],
                'username': username,
                'full_name': data['user']['full_name'],
                'follower_count': data['user']['edge_followed_by']['count'],
                'following_count': data['user']['edge_follow']['count'],
                'is_private': data['user']['is_private'],
                'is_verified': data['user']['is_verified']
            }
        except Exception as e:
            print(f"Hata: {e}")
            return None

    def get_followers(self, user_id: str, max_count: int = 1000) -> List[Dict[str, Any]]:
        """Kullanıcının takipçilerini alır."""
        followers = []
        try:
            has_next = True
            end_cursor = None

            while has_next and len(followers) < max_count:
                variables = {
                    'id': user_id,
                    'first': 50,
                    'after': end_cursor
                }

                response = self.session.get(
                    'https://www.instagram.com/graphql/query/',
                    params={
                        'query_hash': '5aefa9893005572d237da5068082d8d5',
                        'variables': json.dumps(variables)
                    }
                )

                data = response.json()
                edges = data['data']['user']['edge_followed_by']['edges']

                for edge in edges:
                    node = edge['node']
                    followers.append({
                        'id': node['id'],
                        'username': node['username'],
                        'full_name': node['full_name'],
                        'is_private': node['is_private'],
                        'is_verified': node['is_verified']
                    })

                    if len(followers) >= max_count:
                        break

                page_info = data['data']['user']['edge_followed_by']['page_info']
                has_next = page_info['has_next_page']
                end_cursor = page_info['end_cursor']

                time.sleep(self.rate_limit_delay)

        except Exception as e:
            print(f"Hata: {e}")

        return followers

    def get_following(self, user_id: str, max_count: int = 1000) -> List[Dict[str, Any]]:
        """Kullanıcının takip ettiklerini alır."""
        following = []
        try:
            has_next = True
            end_cursor = None

            while has_next and len(following) < max_count:
                variables = {
                    'id': user_id,
                    'first': 50,
                    'after': end_cursor
                }

                response = self.session.get(
                    'https://www.instagram.com/graphql/query/',
                    params={
                        'query_hash': 'd04b0a864b4b54837c0d870b0e77e076',
                        'variables': json.dumps(variables)
                    }
                )

                data = response.json()
                edges = data['data']['user']['edge_follow']['edges']

                for edge in edges:
                    node = edge['node']
                    following.append({
                        'id': node['id'],
                        'username': node['username'],
                        'full_name': node['full_name'],
                        'is_private': node['is_private'],
                        'is_verified': node['is_verified']
                    })

                    if len(following) >= max_count:
                        break

                page_info = data['data']['user']['edge_follow']['page_info']
                has_next = page_info['has_next_page']
                end_cursor = page_info['end_cursor']

                time.sleep(self.rate_limit_delay)

        except Exception as e:
            print(f"Hata: {e}")

        return following

    def analyze_network(self, username: str, depth: int = 1, max_users: int = 100) -> Dict[str, Any]:
        """Kullanıcı ağını analiz eder."""
        G = nx.DiGraph()
        processed = set()
        queue = [(username, 0)]
        user_data = {}

        while queue and len(processed) < max_users:
            current_username, current_depth = queue.pop(0)

            if current_username in processed or current_depth > depth:
                continue

            user = self.get_user_info(current_username)
            if not user:
                continue

            user_data[current_username] = user
            processed.add(current_username)

            # Takipçileri ve takip edilenleri al
            followers = self.get_followers(user['id'])
            following = self.get_following(user['id'])

            # Ağa ekle
            for follower in followers:
                G.add_edge(follower['username'], current_username)
                if current_depth < depth:
                    queue.append((follower['username'], current_depth + 1))

            for followed in following:
                G.add_edge(current_username, followed['username'])
                if current_depth < depth:
                    queue.append((followed['username'], current_depth + 1))

            time.sleep(self.rate_limit_delay)

        return {
            'graph': G,
            'user_data': user_data
        }

    def calculate_metrics(self, G: nx.DiGraph, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Ağ metriklerini hesaplar."""
        metrics = {
            'network_size': G.number_of_nodes(),
            'total_connections': G.number_of_edges(),
            'density': nx.density(G),
            'average_clustering': nx.average_clustering(G),
            'centrality': {
                'degree': dict(nx.degree_centrality(G)),
                'betweenness': dict(nx.betweenness_centrality(G)),
                'eigenvector': dict(nx.eigenvector_centrality(G, max_iter=1000))
            },
            'communities': list(nx.community.greedy_modularity_communities(G.to_undirected())),
            'influential_users': sorted(
                [(node, G.in_degree(node)) for node in G.nodes()],
                key=lambda x: x[1],
                reverse=True
            )[:10]
        }

        # Kullanıcı grupları
        verified_users = [user for user, data in user_data.items() if data['is_verified']]
        private_users = [user for user, data in user_data.items() if data['is_private']]

        metrics['user_groups'] = {
            'verified_users': verified_users,
            'private_users': private_users,
            'verified_percentage': len(verified_users) / len(user_data) * 100,
            'private_percentage': len(private_users) / len(user_data) * 100
        }

        return metrics

    def generate_visualizations(self, G: nx.DiGraph, output_dir: str):
        """Ağ görselleştirmeleri oluşturur."""
        # Ağ grafiği
        plt.figure(figsize=(12, 8))
        pos = nx.spring_layout(G)
        nx.draw(G, pos, with_labels=True, node_color='lightblue',
                node_size=500, font_size=8, arrows=True)
        plt.savefig(os.path.join(output_dir, 'network_graph.png'))
        plt.close()

        # Derece dağılımı
        plt.figure(figsize=(10, 6))
        degrees = [d for n, d in G.degree()]
        sns.histplot(degrees, bins=30)
        plt.title('Node Degree Distribution')
        plt.xlabel('Degree')
        plt.ylabel('Count')
        plt.savefig(os.path.join(output_dir, 'degree_distribution.png'))
        plt.close()

    def generate_report(self, username: str, depth: int, output_dir: str):
        """Analiz raporu oluşturur."""
        print(f"Ağ analizi başlatılıyor: {username} (derinlik: {depth})")

        network_data = self.analyze_network(username, depth)
        if not network_data['graph'].nodes():
            print("Uyarı: Ağ oluşturulamadı")
            return

        metrics = self.calculate_metrics(network_data['graph'], network_data['user_data'])

        # Görselleştirmeler oluştur
        os.makedirs(output_dir, exist_ok=True)
        self.generate_visualizations(network_data['graph'], output_dir)

        # Rapor oluştur
        analysis = {
            'username': username,
            'timestamp': datetime.now().isoformat(),
            'analysis_depth': depth,
            'network_metrics': metrics,
            'user_data': network_data['user_data']
        }

        output_file = os.path.join(output_dir, f'{username}_network_analysis.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)

        print(f"Analiz tamamlandı. Rapor: {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Instagram ağ analiz aracı')
    parser.add_argument('--username', required=True, help='Analiz edilecek kullanıcı adı')
    parser.add_argument('--depth', type=int, default=1, help='Analiz derinliği')
    parser.add_argument('--output', required=True, help='Çıktı dizini')

    args = parser.parse_args()
    analyzer = NetworkAnalyzer()
    analyzer.generate_report(args.username, args.depth, args.output)

if __name__ == "__main__":
    main()
