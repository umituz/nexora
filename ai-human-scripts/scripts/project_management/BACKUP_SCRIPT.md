# Gelişmiş Yedekleme Scripti

## Genel Bakış
Bu script, sistem ve uygulama verilerinin güvenli ve otomatik yedeklenmesini sağlar.

## Amaç ve Kapsam
- Dosya sistemi yedekleme
- Veritabanı yedekleme
- Şifrelenmiş yedekler
- Otomatik temizleme

## Kullanım Senaryoları

### 1. Tam Yedekleme
```bash
./backup_script.sh
```

### 2. Belirli Dizinleri Yedekleme
```bash
./backup_script.sh --dirs="/var/www/html,/etc/nginx"
```

### 3. Sadece Veritabanı Yedekleme
```bash
./backup_script.sh --only-db
```

## Avantajlar

1. **Güvenlik**
   - AES-256 şifreleme
   - Güvenli dosya silme
   - Erişim kontrolü

2. **Otomasyon**
   - Zamanlanmış yedekleme
   - Otomatik temizleme
   - Email bildirimleri

3. **Verimlilik**
   - Sıkıştırma desteği
   - Disk alanı yönetimi
   - Paralel yedekleme

## Özellikler

### Temel Özellikler
- Çoklu dizin yedekleme
- MySQL/MariaDB desteği
- Otomatik sıkıştırma
- Log tutma

### Gelişmiş Özellikler
- AES-256 şifreleme
- Retention policy
- Checksum doğrulama
- Yedek doğrulama

## Konfigürasyon

### Yedekleme Ayarları
```json
{
  "backup_root": "/backups",
  "source_dirs": [
    "/var/www/html",
    "/etc/nginx",
    "/etc/mysql"
  ],
  "retention_days": 30,
  "compress_type": "gzip"
}
```

### Veritabanı Ayarları
```json
{
  "db_type": "mysql",
  "db_name": "myapp",
  "db_user": "backup_user",
  "db_pass": "secure_password"
}
```

## En İyi Uygulamalar

1. **Yedekleme Stratejisi**
   - Düzenli tam yedek
   - Artımlı yedekleme
   - Çoklu lokasyon

2. **Güvenlik Önlemleri**
   - Şifreleme kullanımı
   - Erişim kısıtlaması
   - Güvenli transfer

## Sık Karşılaşılan Sorunlar

### Problem: Disk Alanı Yetersiz
**Çözüm:**
```bash
./backup_script.sh --cleanup-first
```

### Problem: Yedek Doğrulama Hatası
**Çözüm:**
```bash
./backup_script.sh --verify-backup
```

## Cron Entegrasyonu

### Günlük Yedekleme
```cron
0 2 * * * /path/to/backup_script.sh --daily
```

### Haftalık Tam Yedek
```cron
0 3 * * 0 /path/to/backup_script.sh --weekly --full
```

## Metrikler ve Raporlama

1. **Yedekleme Metrikleri**
   - Yedek boyutu
   - Yedekleme süresi
   - Başarı oranı

2. **Sistem Metrikleri**
   - Disk kullanımı
   - I/O performansı
   - CPU/Memory kullanımı

## Felaket Kurtarma

### Tam Geri Yükleme
```bash
./restore.sh --full --date=2024-02-25
```

### Seçici Geri Yükleme
```bash
./restore.sh --select-files="/var/www/html/config"
```

## Özelleştirme

### Özel Yedekleme Rutini
```bash
#!/bin/bash
# Pre-backup hooks
pre_backup() {
    # özel hazırlık işlemleri
}

# Post-backup hooks
post_backup() {
    # temizlik işlemleri
}
```

### Bildirim Entegrasyonu
```python
def send_backup_notification(status, details):
    # email veya Slack bildirimi gönder
    pass
```

## Gelecek Özellikler

- Cloud storage entegrasyonu
- Yapay zeka destekli anomali tespiti
- Otomatik geri yükleme testleri
- Blockchain tabanlı yedek doğrulama

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Implement your changes
4. Add tests
5. Create a Pull Request

## Lisans

MIT License
