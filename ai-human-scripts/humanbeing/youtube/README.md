# YouTube OSINT Araçları

Bu dizin, YouTube platformu üzerinde OSINT (Açık Kaynak İstihbaratı) çalışmaları yapmak için geliştirilen araçları içerir.

## Araçlar

### 1. thumbnail_analyzer.sh

YouTube video küçük resimlerini analiz eden bir araç.

-   Küçük resimleri indirir
-   Metadata analizi yapar
-   EXIF verilerini çıkarır
-   Görsel analiz yapar

### 2. object_detector.py

Video küçük resimlerinde nesne tespiti yapan Python betiği.

-   TensorFlow kullanarak nesne tespiti
-   Yüz tespiti
-   Metin tespiti
-   Sonuçları JSON formatında raporlama

### 3. comment_analyzer.py

YouTube video yorumlarını analiz eden Python betiği.

-   Yorum verilerini toplar
-   Duygu analizi yapar
-   Kullanıcı davranışlarını analiz eder
-   İstatistiksel raporlar oluşturur

### 4. osint_youtube.sh

YouTube kanalları hakkında genel OSINT bilgileri toplayan ana betik.

-   Kanal bilgileri
-   Video istatistikleri
-   Etkileşim analizi
-   Ağ bağlantıları

## Gereksinimler

```bash
# Sistem gereksinimleri
- bash 4.0+
- Python 3.8+
- jq
- curl
- exiftool

# Python kütüphaneleri
pip install -r requirements.txt
```

## Kurulum

```bash
git clone <repo-url>
cd youtube-osint-tools
chmod +x *.sh
pip install -r requirements.txt
```

## Kullanım

### Thumbnail Analizi

```bash
./thumbnail_analyzer.sh <video_id>
```

### Nesne Tespiti

```bash
python object_detector.py <image_path>
```

### Yorum Analizi

```bash
python comment_analyzer.py <video_id>
```

### Genel OSINT

```bash
./osint_youtube.sh <channel_id>
```

## Güvenlik Notları

-   API anahtarlarını güvenli bir şekilde saklayın
-   Rate limiting kurallarına uyun
-   YouTube API kullanım koşullarını ihlal etmeyin
-   Kişisel verileri koruma kanunlarına uyun

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request açın

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.
