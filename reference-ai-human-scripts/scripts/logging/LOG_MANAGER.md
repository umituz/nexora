# Log Yönetim Sistemi

## Genel Bakış

Bu sistem, farklı log türlerini (sistem, uygulama, güvenlik, audit) merkezi bir yerden yönetmek için tasarlanmış kapsamlı bir log yönetim aracıdır. Log izleme, rotasyon, analiz, temizleme ve arama özelliklerini içerir.

## Özellikler

-   Sistem log izleme
-   Uygulama log izleme
-   Güvenlik log izleme
-   Audit log izleme
-   Log rotasyonu
-   Log analizi
-   Log temizleme
-   Log arama
-   Detaylı raporlama

## Sistem Gereksinimleri

-   Bash 4.0+
-   grep
-   awk
-   tail
-   find
-   gzip
-   jq (JSON işleme)

## Kurulum

1. Script'e çalıştırma izni verin:

```bash
chmod +x log_manager.sh
```

2. Gerekli dizinlerin oluşturulduğundan emin olun:

-   config/
-   logs/
-   system/
-   application/
-   security/
-   audit/
-   archive/
-   reports/

## Kullanım

### Script Çalıştırma

```bash
./log_manager.sh
```

### Menü Seçenekleri

1. Sistem Loglarını İzle
2. Uygulama Loglarını İzle
3. Güvenlik Loglarını İzle
4. Audit Loglarını İzle
5. Log Rotasyonu
6. Log Analizi
7. Log Temizleme
8. Log Arama
9. Çıkış

## Sistem Log İzleme

### Özellikler

-   Gerçek zamanlı log izleme
-   Kritik hata tespiti
-   Otomatik yenileme
-   Özelleştirilebilir satır sayısı
-   Özelleştirilebilir yenileme aralığı

### Örnek

```bash
# Sistem loglarını izle
Log dosyası: /var/log/system.log
Satır sayısı: 50
Yenileme aralığı: 5
```

## Uygulama Log İzleme

### Özellikler

-   Uygulama bazlı izleme
-   Hata ve uyarı tespiti
-   Exception takibi
-   Özelleştirilebilir filtreler
-   Gerçek zamanlı izleme

### Örnek

```bash
# Uygulama loglarını izle
Uygulama adı: myapp
Log dosyası: /var/log/myapp.log
Satır sayısı: 50
```

## Güvenlik Log İzleme

### Özellikler

-   Güvenlik olayları izleme
-   Başarısız giriş tespiti
-   Yetkisiz erişim tespiti
-   Saldırı tespiti
-   Gerçek zamanlı uyarılar

### Örnek

```bash
# Güvenlik loglarını izle
Log dosyası: /var/log/auth.log
Satır sayısı: 50
```

## Audit Log İzleme

### Özellikler

-   Kullanıcı aktivitesi izleme
-   Yetki değişiklikleri
-   Sistem değişiklikleri
-   Sudo komutları
-   Detaylı audit trail

### Örnek

```bash
# Audit loglarını izle
Log dosyası: /var/log/audit/audit.log
Satır sayısı: 50
```

## Log Rotasyonu

### Özellikler

-   Otomatik log rotasyonu
-   Boyut bazlı rotasyon
-   Sıkıştırma
-   Arşivleme
-   Retention yönetimi

### Örnek

```bash
# Log rotasyonu
Log dizini: /var/log/myapp
Maksimum boyut: 100M
Retention süresi: 30
```

## Log Analizi

### Özellikler

-   En sık karşılaşılan hatalar
-   IP bazlı analiz
-   Saat bazlı aktivite
-   Güvenlik olayları analizi
-   Detaylı raporlama

### Örnek Rapor

```
Log Analiz Raporu - 2024-01-01
==========================

En Sık Karşılaşılan Hatalar:
  50 Connection timeout
  30 Authentication failed
  20 Permission denied

En Aktif IP Adresleri:
  100 192.168.1.100
   80 192.168.1.101
   50 192.168.1.102

Saat Bazlı Aktivite:
  08:00  ####
  09:00  ######
  10:00  ###
```

## Log Temizleme

### Özellikler

-   Otomatik temizleme
-   Yaş bazlı temizleme
-   Güvenli silme
-   Arşiv yönetimi
-   Seçici temizleme

### Örnek

```bash
# Log temizleme
Log dizini: /var/log/myapp
Gün sayısı: 30
```

## Log Arama

### Özellikler

-   Metin bazlı arama
-   Regex desteği
-   Bağlam görüntüleme
-   Çoklu dosya arama
-   Sonuç filtreleme

### Örnek

```bash
# Log arama
Arama terimi: "error"
Log dizini: /var/log/myapp
Bağlam satır sayısı: 3
```

## Dizin Yapısı

```
logging/
├── config/
│   └── log_config.json
├── logs/
│   └── log_manager.log
├── system/
├── application/
├── security/
├── audit/
├── archive/
└── reports/
```

## Konfigürasyon

`config/log_config.json` formatı:

```json
{
    "rotation": {
        "max_size": "100M",
        "retention_days": 30,
        "compress": true
    },
    "monitoring": {
        "refresh_interval": 5,
        "lines": 50,
        "highlight_errors": true
    },
    "analysis": {
        "patterns": ["error", "warning", "critical"],
        "ip_tracking": true
    }
}
```

## Loglama

Her işlem için detaylı log kaydı:

-   Timestamp
-   İşlem türü
-   Etkilenen dosyalar
-   Başarı/başarısızlık durumu
-   Hata detayları

## Hata Yönetimi

-   Dosya izin kontrolü
-   Disk alan kontrolü
-   Dosya varlığı kontrolü
-   Yetki kontrolü
-   Bağlantı kontrolü

## Güvenlik

-   Log dosyası izinleri
-   Güvenli silme
-   Log sanitization
-   Yetki kontrolü
-   Audit trail

## En İyi Uygulamalar

1. Düzenli log rotasyonu yapın
2. Kritik logları yedekleyin
3. Log analizlerini planlayın
4. Retention süresini optimize edin
5. Güvenlik loglarını monitör edin

## Sorun Giderme

1. Log dosyası izinlerini kontrol edin
2. Disk alanını kontrol edin
3. Log formatını doğrulayın
4. Rotasyon ayarlarını kontrol edin
5. Yetkileri kontrol edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request oluşturun

## Lisans

MIT License
