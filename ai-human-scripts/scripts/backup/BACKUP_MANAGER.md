# Yedekleme Yönetim Sistemi

## Genel Bakış

Bu sistem, sistem, veritabanı ve dosya yedeklerini yönetmek için kapsamlı bir araç setidir. Yerel ve cloud yedekleme desteği ile birlikte geri yükleme ve temizleme özellikleri sunar.

## Özellikler

-   Sistem yedeği alma
-   Veritabanı yedeği alma
-   Dosya yedeği alma
-   Cloud yedekleme (AWS S3)
-   Yedek geri yükleme
-   Eski yedekleri temizleme
-   Detaylı loglama
-   Yedek listeleme

## Sistem Gereksinimleri

-   Bash 4.0+
-   tar
-   gzip
-   mysqldump (veritabanı yedekleri için)
-   AWS CLI (cloud yedekleme için)
-   jq (JSON işleme)

## Kurulum

1. Script'e çalıştırma izni verin:

```bash
chmod +x backup_manager.sh
```

2. Gerekli dizinlerin oluşturulduğundan emin olun:

-   config/
-   logs/
-   backups/
    -   system/
    -   database/
    -   files/

3. AWS CLI yapılandırması (cloud yedekleme için):

```bash
aws configure
```

## Kullanım

### Script Çalıştırma

```bash
./backup_manager.sh
```

### Menü Seçenekleri

1. Sistem Yedeği Al
2. Veritabanı Yedeği Al
3. Dosya Yedeği Al
4. Cloud'a Yedekle
5. Yedek Geri Yükle
6. Eski Yedekleri Temizle
7. Yedekleri Listele
8. Çıkış

## Yedekleme Türleri

### Sistem Yedeği

-   Önemli sistem dizinlerini yedekler (/etc, /var, /usr/local, /home)
-   Gereksiz dizinleri hariç tutar
-   Sıkıştırılmış tar formatında saklar
-   Timestamp ile benzersiz isimlendirir

### Veritabanı Yedeği

-   MySQL/MariaDB veritabanlarını yedekler
-   mysqldump kullanır
-   SQL formatında çıktı alır
-   Sıkıştırılmış gzip formatında saklar
-   Veritabanı adı ve timestamp ile isimlendirir

### Dosya Yedeği

-   Belirtilen dizini yedekler
-   Sıkıştırılmış tar formatında saklar
-   Dizin adı ve timestamp ile isimlendirir

### Cloud Yedekleme

-   AWS S3'e yedek yükler
-   Otomatik dosya adı yönetimi
-   Güvenli transfer
-   İlerleme durumu gösterimi

## Geri Yükleme

-   Sistem yedeklerini geri yükler
-   Veritabanı yedeklerini geri yükler
-   Dosya yedeklerini geri yükler
-   Yedek formatını otomatik algılar
-   Hedef dizine geri yükler

## Yedek Temizleme

-   Belirtilen günden eski yedekleri temizler
-   Varsayılan retention süresi: 30 gün
-   Tüm yedek türleri için geçerli
-   Güvenli silme işlemi

## Dizin Yapısı

```
backup/
├── config/
│   └── backup_config.json
├── logs/
│   └── backup_manager.log
├── backups/
│   ├── system/
│   ├── database/
│   └── files/
└── backup_manager.sh
```

## Konfigürasyon

`config/backup_config.json` formatı:

```json
{
    "retention_days": 30,
    "compression_level": 9,
    "cloud": {
        "enabled": true,
        "provider": "aws",
        "bucket": "my-backups"
    },
    "notifications": {
        "email": true,
        "slack": false
    }
}
```

## Loglama

Her işlem için detaylı log kaydı:

-   Timestamp
-   İşlem türü
-   Başarı/başarısızlık durumu
-   Hata detayları
-   Dosya boyutu ve konumu

## Hata Yönetimi

-   Disk alanı kontrolü
-   Yetki kontrolü
-   Bağlantı kontrolü
-   Dosya varlığı kontrolü
-   Hata durumunda temizlik

## Güvenlik

-   Yetki kontrolü
-   Güvenli silme
-   Şifreli transfer
-   Log temizleme
-   Hassas veri yönetimi

## En İyi Uygulamalar

1. Düzenli yedek alın
2. Farklı lokasyonlarda saklayın
3. Yedekleri test edin
4. Retention süresini optimize edin
5. Disk alanını monitör edin

## Sorun Giderme

1. Log dosyalarını kontrol edin
2. Disk alanını kontrol edin
3. Yetkileri kontrol edin
4. Network bağlantısını kontrol edin
5. AWS credentials'ı kontrol edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request oluşturun

## Lisans

MIT License
