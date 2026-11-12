# Pinterest OSINT Araçları

Bu dizin, Pinterest platformu üzerinde OSINT (Açık Kaynak İstihbaratı) çalışmaları yapmak için geliştirilen araçları içerir.

## Araçlar

### 1. profile_analyzer.py

Pinterest profil bilgilerini analiz eden Python betiği.

-   Profil bilgilerini toplar
-   Pin geçmişini analiz eder
-   Pano analizini yapar
-   Takipçi/takip edilen analizini yapar
-   İlgi alanlarını analiz eder
-   Etkileşim örüntülerini çıkarır

### 2. pin_analyzer.py

Pinterest pinlerini analiz eden Python betiği.

-   Pin meta verilerini toplar
-   Görsel analizi yapar
-   Metin analizi yapar
-   Etkileşim analizini yapar
-   Bağlantı analizini yapar
-   Kaynak analizi yapar

### 3. board_analyzer.py

Pinterest panolarını analiz eden Python betiği.

-   Pano bilgilerini toplar
-   Pin koleksiyonunu analiz eder
-   Kategori analizini yapar
-   İşbirlikçi pano analizini yapar
-   Etkileşim analizini yapar

### 4. visual_analyzer.py

Pinterest görsellerini analiz eden Python betiği.

-   Görsel meta verilerini toplar
-   Nesne tespiti yapar
-   Yüz tespiti yapar
-   Renk analizi yapar
-   OCR ile metin tespiti yapar
-   Benzer görselleri analiz eder

### 5. trend_analyzer.py

Pinterest trendlerini analiz eden Python betiği.

-   Popüler pinleri tespit eder
-   Trend kategorileri analiz eder
-   Sezonsal trendleri analiz eder
-   Arama trendlerini analiz eder
-   İçerik trendlerini belirler

## Gereksinimler

```bash
# Sistem gereksinimleri
- Python 3.8+
- chromium-browser
- selenium-webdriver
- tesseract-ocr
- ffmpeg

# Python kütüphaneleri
pip install -r requirements.txt
```

## Kurulum

```bash
git clone <repo-url>
cd pinterest-osint-tools
pip install -r requirements.txt
```

## Kullanım

### Profil Analizi

```bash
python profile_analyzer.py --username <username> --output <output_dir>
```

### Pin Analizi

```bash
python pin_analyzer.py --url <pin_url> --output <output_dir>
python pin_analyzer.py --username <username> --count 100 --output <output_dir>
```

### Pano Analizi

```bash
python board_analyzer.py --url <board_url> --output <output_dir>
python board_analyzer.py --username <username> --board <board_name> --output <output_dir>
```

### Görsel Analizi

```bash
python visual_analyzer.py --url <image_url> --output <output_dir>
python visual_analyzer.py --pin <pin_url> --output <output_dir>
```

### Trend Analizi

```bash
python trend_analyzer.py --category <category> --days 30 --output <output_dir>
python trend_analyzer.py --query <search_term> --days 30 --output <output_dir>
```

## Güvenlik ve Etik Notları

-   Pinterest'in kullanım koşullarına uyun
-   Rate limiting kurallarına dikkat edin
-   Kişisel verileri koruma kanunlarına uyun
-   Etik OSINT prensiplerine bağlı kalın
-   Elde edilen verileri sorumlu kullanın
-   Telif haklarına saygı gösterin
-   Bot tespiti ve engelleme kurallarına dikkat edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request açın

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.
