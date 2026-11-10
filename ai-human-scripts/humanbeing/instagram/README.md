# Instagram OSINT Araçları

Bu dizin, Instagram platformu üzerinde OSINT (Açık Kaynak İstihbaratı) çalışmaları yapmak için geliştirilen araçları içerir.

## Araçlar

### 1. profile_analyzer.sh

Instagram profil bilgilerini analiz eden ana betik.

-   Profil bilgilerini toplar
-   Gönderi istatistiklerini çıkarır
-   Takipçi/takip edilen analizini yapar
-   Etkileşim oranlarını hesaplar

### 2. post_analyzer.py

Instagram gönderilerini analiz eden Python betiği.

-   Gönderi içeriklerini toplar
-   Hashtag analizini yapar
-   Konum verilerini analiz eder
-   Etkileşim istatistiklerini çıkarır
-   Yorum analizini yapar

### 3. media_analyzer.sh

Instagram medya dosyalarını analiz eden araç.

-   Fotoğraf/video indirme
-   EXIF verisi analizi
-   Görsel analiz
-   Yüz tespiti
-   Nesne tespiti
-   OCR ile metin tespiti

### 4. story_analyzer.py

Instagram hikayelerini analiz eden Python betiği.

-   Hikaye içeriklerini toplar
-   Etkileşim analizi yapar
-   Konum verilerini analiz eder
-   Mention/etiket analizini yapar

### 5. network_analyzer.py

Instagram ağ ilişkilerini analiz eden Python betiği.

-   Takipçi ağı analizi
-   Etkileşim ağı analizi
-   Ortak takipçi analizi
-   Etki alanı hesaplama

## Gereksinimler

```bash
# Sistem gereksinimleri
- Python 3.8+
- jq
- curl
- exiftool
- tesseract-ocr
- ffmpeg

# Python kütüphaneleri
pip install -r requirements.txt
```

## Kurulum

```bash
git clone <repo-url>
cd instagram-osint-tools
chmod +x *.sh
pip install -r requirements.txt
```

## Kullanım

### Profil Analizi

```bash
./profile_analyzer.sh <username>
```

### Gönderi Analizi

```bash
python post_analyzer.py <post_url>
```

### Medya Analizi

```bash
./media_analyzer.sh <media_url>
```

### Hikaye Analizi

```bash
python story_analyzer.py <username>
```

### Ağ Analizi

```bash
python network_analyzer.py <username> --depth 2
```

## Güvenlik ve Etik Notları

-   Instagram'ın kullanım koşullarına uyun
-   Rate limiting kurallarına dikkat edin
-   Kişisel verileri koruma kanunlarına uyun
-   Etik OSINT prensiplerine bağlı kalın
-   Elde edilen verileri sorumlu kullanın

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request açın

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.
