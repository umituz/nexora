# Facebook OSINT Araçları

Bu dizin, Facebook platformu üzerinde OSINT (Açık Kaynak İstihbaratı) çalışmaları yapmak için geliştirilen araçları içerir.

## Araçlar

### 1. profile_analyzer.py

Facebook profil bilgilerini analiz eden Python betiği.

-   Profil bilgilerini toplar
-   Gönderi geçmişini analiz eder
-   Arkadaş listesini analiz eder
-   Grup üyeliklerini analiz eder
-   Sayfa beğenilerini analiz eder
-   Etkileşim örüntülerini çıkarır

### 2. page_analyzer.py

Facebook sayfalarını analiz eden Python betiği.

-   Sayfa bilgilerini toplar
-   Gönderi analizini yapar
-   Takipçi istatistiklerini çıkarır
-   Etkileşim analizini yapar
-   İçerik trendlerini belirler

### 3. group_analyzer.py

Facebook gruplarını analiz eden Python betiği.

-   Grup bilgilerini toplar
-   Üye analizini yapar
-   Gönderi analizini yapar
-   Etkileşim analizini yapar
-   Moderatör aktivitelerini analiz eder

### 4. content_analyzer.py

Facebook içeriklerini analiz eden Python betiği.

-   Metin analizi yapar
-   Duygu analizi yapar
-   Medya analizi yapar
-   URL analizi yapar
-   Hashtag/mention analizi yapar
-   Konum analizi yapar

### 5. network_analyzer.py

Facebook ağ ilişkilerini analiz eden Python betiği.

-   Arkadaşlık ağı analizi
-   Grup bağlantıları analizi
-   Sayfa bağlantıları analizi
-   Etkileşim ağı analizi
-   Ortak arkadaş analizi

## Gereksinimler

```bash
# Sistem gereksinimleri
- Python 3.8+
- jq
- curl
- chromium-browser
- selenium-webdriver

# Python kütüphaneleri
pip install -r requirements.txt
```

## Kurulum

```bash
git clone <repo-url>
cd facebook-osint-tools
pip install -r requirements.txt
```

## Kullanım

### Profil Analizi

```bash
python profile_analyzer.py --profile <profile_url> --output <output_dir>
```

### Sayfa Analizi

```bash
python page_analyzer.py --page <page_url> --days 30 --output <output_dir>
```

### Grup Analizi

```bash
python group_analyzer.py --group <group_url> --days 30 --output <output_dir>
```

### İçerik Analizi

```bash
python content_analyzer.py --url <post_url> --output <output_dir>
python content_analyzer.py --profile <profile_url> --count 100 --output <output_dir>
```

### Ağ Analizi

```bash
python network_analyzer.py --profile <profile_url> --depth 2 --output <output_dir>
python network_analyzer.py --group <group_url> --depth 2 --output <output_dir>
```

## Güvenlik ve Etik Notları

-   Facebook'un kullanım koşullarına uyun
-   Rate limiting kurallarına dikkat edin
-   Kişisel verileri koruma kanunlarına uyun
-   Etik OSINT prensiplerine bağlı kalın
-   Elde edilen verileri sorumlu kullanın
-   Bot tespiti ve engelleme kurallarına dikkat edin
-   Gizlilik ayarlarına saygı gösterin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request açın

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.
