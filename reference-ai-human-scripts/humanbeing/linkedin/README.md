# LinkedIn OSINT Araçları

Bu dizin, LinkedIn platformu üzerinde OSINT (Açık Kaynak İstihbaratı) çalışmaları yapmak için geliştirilen araçları içerir.

## Araçlar

### 1. profile_analyzer.sh

LinkedIn profil bilgilerini analiz eden ana betik.

-   Profil bilgilerini toplar
-   İş geçmişini analiz eder
-   Eğitim bilgilerini analiz eder
-   Beceri ve onaylamaları analiz eder
-   Bağlantı ağını analiz eder
-   Aktivite ve etkileşimleri analiz eder

### 2. company_analyzer.py

Şirket profillerini analiz eden Python betiği.

-   Şirket bilgilerini toplar
-   Çalışan istatistiklerini çıkarır
-   İş ilanlarını analiz eder
-   Büyüme metriklerini hesaplar
-   Sektör analizini yapar

### 3. network_analyzer.py

LinkedIn ağ ilişkilerini analiz eden Python betiği.

-   Bağlantı ağı analizi
-   Ortak bağlantı analizi
-   Şirket bazlı ağ analizi
-   Sektör bazlı ağ analizi
-   Etki alanı hesaplama

### 4. activity_analyzer.py

Kullanıcı aktivitelerini analiz eden Python betiği.

-   Gönderi analizi
-   Etkileşim analizi
-   Yorum analizi
-   Hashtag analizi
-   İçerik türü analizi

### 5. job_analyzer.py

İş ilanlarını analiz eden Python betiği.

-   İlan içerik analizi
-   Beceri gereksinimleri analizi
-   Maaş aralığı analizi
-   Şirket bazlı ilan analizi
-   Sektör trendleri analizi

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
cd linkedin-osint-tools
chmod +x *.sh
pip install -r requirements.txt
```

## Kullanım

### Profil Analizi

```bash
./profile_analyzer.sh <profile_url>
```

### Şirket Analizi

```bash
python company_analyzer.py --url <company_url> --output <output_dir>
```

### Ağ Analizi

```bash
python network_analyzer.py --profile <profile_url> --depth 2 --output <output_dir>
```

### Aktivite Analizi

```bash
python activity_analyzer.py --profile <profile_url> --days 30 --output <output_dir>
```

### İş İlanı Analizi

```bash
python job_analyzer.py --company <company_url> --output <output_dir>
```

## Güvenlik ve Etik Notları

-   LinkedIn'in kullanım koşullarına uyun
-   Rate limiting kurallarına dikkat edin
-   Kişisel verileri koruma kanunlarına uyun
-   Etik OSINT prensiplerine bağlı kalın
-   Elde edilen verileri sorumlu kullanın
-   Otomatik tarama sınırlamalarına dikkat edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request açın

## Lisans

MIT License - Detaylar için LICENSE dosyasına bakın.
