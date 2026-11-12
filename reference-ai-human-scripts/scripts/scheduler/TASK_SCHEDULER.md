# Task Scheduler (Zamanlanmış Görev Yönetimi)

## Genel Bakış

Bu sistem, tekrarlanan görevleri otomatik olarak yönetmek ve zamanlamak için tasarlanmış kapsamlı bir görev zamanlayıcıdır. Cron tabanlı zamanlamayı kullanarak görevlerin belirli aralıklarla çalıştırılmasını sağlar.

## Özellikler

-   Cron tabanlı görev zamanlama
-   Merkezi görev yönetimi
-   Detaylı loglama sistemi
-   JSON tabanlı konfigürasyon
-   Esnek görev ekleme/silme
-   Gerçek zamanlı log takibi

## Sistem Gereksinimleri

-   Linux/Unix tabanlı işletim sistemi
-   Bash 4.0+
-   cron servisi
-   jq (JSON işleme aracı)

## Kurulum

1. Script dosyasını indirin
2. Çalıştırma izni verin: `chmod +x task_scheduler.sh`
3. Gerekli dizinlerin oluşturulduğundan emin olun:
    - tasks/
    - logs/
    - config/

## Kullanım

### Script Çalıştırma

```bash
./task_scheduler.sh
```

### Menü Seçenekleri

1. Task Ekle
2. Task Sil
3. Task Listesi
4. Task Loglarını Görüntüle
5. Çıkış

### Task Ekleme

-   Task adı
-   Script dosyası
-   Cron zamanlama formatı

Örnek:

```bash
Task adı: backup_db
Script dosyası: backup_database.sh
Cron zamanlama: 0 */6 * * *  # Her 6 saatte bir
```

### Cron Format

```
* * * * *
│ │ │ │ │
│ │ │ │ └── Haftanın günü (0-7)
│ │ │ └──── Ay (1-12)
│ │ └────── Ayın günü (1-31)
│ └──────── Saat (0-23)
└────────── Dakika (0-59)
```

Örnekler:

-   `*/5 * * * *` - Her 5 dakikada bir
-   `0 */2 * * *` - Her 2 saatte bir
-   `0 0 * * *` - Her gün gece yarısı
-   `0 0 * * 0` - Her Pazar gece yarısı

## Dizin Yapısı

```
scheduler/
├── tasks/          # Task scriptleri
├── logs/           # Log dosyaları
├── config/         # Konfigürasyon dosyaları
└── task_scheduler.sh
```

## Konfigürasyon

`config/tasks.json` formatı:

```json
{
    "tasks": [
        {
            "name": "backup_db",
            "script": "backup_database.sh",
            "schedule": "0 */6 * * *"
        }
    ]
}
```

## Loglama

Her task için ayrı log dosyası oluşturulur:

-   `logs/scheduler.log` - Ana sistem logu
-   `logs/{task_name}.log` - Task-specific loglar

## Hata Yönetimi

-   Script varlık kontrolü
-   Cron format doğrulama
-   Hata durumunda otomatik loglama
-   Task durumu takibi

## Güvenlik

-   Sadece izin verilen scriptler çalıştırılır
-   Log dosyaları güvenli konumda
-   Sistem komutları için güvenlik kontrolleri

## En İyi Uygulamalar

1. Task isimleri benzersiz olmalı
2. Scriptler test edilmiş olmalı
3. Uygun log rotasyonu yapılandırılmalı
4. Düzenli yedekleme planı oluşturulmalı

## Sorun Giderme

1. Log dosyalarını kontrol edin
2. Cron servisinin çalıştığından emin olun
3. Script izinlerini kontrol edin
4. Sistem saatini doğrulayın

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request oluşturun

## Lisans

MIT License
