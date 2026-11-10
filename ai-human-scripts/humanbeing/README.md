# OSINT Araştırma Araçları

Bu klasör, kişiler hakkında açık kaynak istihbarat (OSINT) araştırması yapmak için kullanılan araçları içerir.

## Araçlar

### 1. E-posta Bazlı Araştırma (`osint_mail.sh`)

E-posta adresi ve kişi bilgileri üzerinden OSINT araştırması yapar.

```bash
./osint_mail.sh <email@address.com> <ad> <soyad>
```

Örnek:

```bash
./osint_mail.sh john.doe@example.com John Doe
```

Çıktılar `generates/email_username/` klasörü altında saklanır.
Örnek: `generates/johndoe/2024-02-26_08-00-00_osint_report.md`

### 2. İsim Bazlı Araştırma (`osint_name.sh`)

Sadece ad ve soyad bilgisi üzerinden OSINT araştırması yapar.

```bash
./osint_name.sh <ad> <soyad>
```

Örnek:

```bash
./osint_name.sh John Doe
```

Çıktılar `generates/ad_soyad/` klasörü altında saklanır.
Örnek: `generates/john_doe/2024-02-26_08-00-00_osint_report.md`

## Özellikler

### E-posta Araştırması (`osint_mail.sh`)

-   Temel bilgi toplama
-   Veri ihlali kontrolü (HaveIBeenPwned)
-   E-posta bazlı sosyal medya taraması
-   İsim bazlı sosyal medya taraması
-   Özelleştirilmiş Google dork önerileri

### İsim Araştırması (`osint_name.sh`)

-   Profesyonel profil taraması
-   Sosyal medya profil taraması
-   Akademik profil kontrolü
-   Haber ve medya araması
-   Özelleştirilmiş arama önerileri

## Klasör Yapısı

```
humanbeing/
├── generates/
│   ├── email_username/      # E-posta kullanıcı adına göre
│   │   └── *_report.md     # Raporlar
│   └── ad_soyad/           # Ad soyada göre
│       └── *_report.md     # Raporlar
├── osint_mail.sh           # E-posta araştırma aracı
├── osint_name.sh           # İsim araştırma aracı
└── README.md              # Bu dosya
```

## Gereksinimler

-   curl
-   HaveIBeenPwned API anahtarı (e-posta araştırması için)

## Güvenlik Notu

Bu araçları yalnızca yasal ve etik sınırlar içinde kullanın. Başkalarının gizliliğine saygı gösterin.
