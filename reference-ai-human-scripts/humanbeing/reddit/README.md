# Reddit OSINT Araçları

Bu dizin, Reddit platformu üzerinde OSINT (Açık Kaynak İstihbaratı) çalışmaları yapmak için geliştirilen araçları içerir.

## Araçlar

### 1. user_analyzer.py

Reddit kullanıcı profillerini analiz eden Python betiği.

-   Kullanıcı bilgilerini toplar
-   Gönderi geçmişini analiz eder
-   Yorum geçmişini analiz eder
-   Karma analizi yapar
-   Aktif olduğu subreddit'leri analiz eder
-   Etkileşim örüntülerini çıkarır

### 2. subreddit_analyzer.py

Subreddit analizleri yapan Python betiği.

-   Subreddit istatistiklerini toplar
-   Popüler gönderileri analiz eder
-   Kullanıcı etkileşimlerini analiz eder
-   Moderatör aktivitelerini analiz eder
-   İçerik trendlerini belirler

### 3. content_analyzer.py

Reddit içeriklerini analiz eden Python betiği.

-   Metin analizi yapar
-   Duygu analizi yapar
-   URL analizi yapar
-   Medya analizi yapar
-   Hashtag/mention analizi yapar
-   Bağlantı analizi yapar

### 4. network_analyzer.py

Reddit ağ ilişkilerini analiz eden Python betiği.

-   Kullanıcı etkileşim ağı analizi
-   Subreddit bağlantı analizi
-   Cross-post analizi
-   Moderatör ağı analizi
-   Bot aktivite analizi

### 5. trend_analyzer.py

Reddit trendlerini analiz eden Python betiği.

-   Popüler konuları tespit eder
-   Trend analizi yapar
-   Zaman bazlı analiz yapar
-   Viral içerik analizi yapar
-   Konu modellemesi yapar

## Gereksinimler

```bash
# Sistem gereksinimleri
- Python 3.8+
- jq
- curl

# Python kütüphaneleri
pip install -r requirements.txt
```

## Kurulum

```bash
git clone <repo-url>
cd reddit-osint-tools
pip install -r requirements.txt
```

## Kullanım

### Kullanıcı Analizi

```bash
python user_analyzer.py --username <username> --output <output_dir>
```

### Subreddit Analizi

```bash
python subreddit_analyzer.py --subreddit <subreddit> --days 30 --output <output_dir>
```

### İçerik Analizi

```bash
python content_analyzer.py --url <post_url> --output <output_dir>
python content_analyzer.py --subreddit <subreddit> --count 100 --output <output_dir>
```

### Ağ Analizi

```bash
python network_analyzer.py --subreddit <subreddit> --depth 2 --output <output_dir>
python network_analyzer.py --user <username> --depth 2 --output <output_dir>
```

### Trend Analizi

```bash
python trend_analyzer.py --subreddit <subreddit> --days 30 --output <output_dir>
python trend_analyzer.py --query <search_term> --days 30 --output <output_dir>
```

## Güvenlik ve Etik Notları

-   Reddit API kullanım koşullarına uyun
-   Rate limiting kurallarına dikkat edin
-   Kişisel verileri koruma kanunlarına uyun
-   Etik OSINT prensiplerine bağlı kalın
-   Elde edilen verileri sorumlu kullanın
-   Bot tespiti ve engelleme kurallarına dikkat edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request açın

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.
