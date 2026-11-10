# Veritabanı Yönetim Scripti

## Genel Bakış
Bu script, MySQL veritabanı yönetimi için kapsamlı araçlar sunar. Performans analizi, optimizasyon, yedekleme ve raporlama işlemlerini otomatize eder.

## Amaç ve Kapsam
- Veritabanı performans analizi
- Tablo ve indeks optimizasyonu
- Otomatik yedekleme
- Detaylı raporlama
- Yavaş sorgu analizi

## Kullanım Senaryoları

### 1. Tam Analiz ve Optimizasyon
```bash
./db_manager.sh
```

### 2. Sadece Yedekleme
```bash
./db_manager.sh --backup-only
```

### 3. Performans Analizi
```bash
./db_manager.sh --analyze
```

## Avantajlar

1. **Performans İyileştirme**
   - Otomatik optimizasyon
   - İndeks analizi
   - Sorgu performans izleme

2. **Veri Güvenliği**
   - Otomatik yedekleme
   - Sıkıştırılmış yedekler
   - Yedek rotasyonu

3. **Kolay İzleme**
   - Detaylı raporlar
   - Performans metrikleri
   - Trend analizi

## Özellikler

### Analiz Özellikleri
- Veritabanı boyut analizi
- Tablo istatistikleri
- İndeks kullanım analizi
- Yavaş sorgu tespiti

### Optimizasyon Özellikleri
- Tablo optimizasyonu
- İndeks optimizasyonu
- Sorgu optimizasyonu
- Cache yönetimi

## Konfigürasyon

### Veritabanı Ayarları
```json
{
  "connection": {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "root",
    "database": "myapp"
  }
}
```

### Yedekleme Ayarları
```json
{
  "backup": {
    "compress": true,
    "rotate": true,
    "keep_days": 30,
    "include_routines": true
  }
}
```

## En İyi Uygulamalar

1. **Yedekleme Stratejisi**
   - Günlük tam yedek
   - Saatlik artımlı yedek
   - Yedek doğrulama

2. **Optimizasyon Planı**
   - Düzenli indeks bakımı
   - Tablo fragmentasyon kontrolü
   - Sorgu optimizasyonu

## Sık Karşılaşılan Sorunlar

### Problem: Yavaş Sorgular
**Analiz:**
```bash
./db_manager.sh --analyze-slow-queries
```

### Problem: Disk Alanı
**Çözüm:**
```bash
./db_manager.sh --optimize-space
```

## Otomatik Görevler

### Günlük Yedekleme
```cron
0 2 * * * /path/to/db_manager.sh --backup
```

### Haftalık Optimizasyon
```cron
0 3 * * 0 /path/to/db_manager.sh --optimize
```

## Metrikler ve Raporlama

1. **Performans Metrikleri**
   - Sorgu yanıt süreleri
   - İndeks kullanım oranları
   - Cache hit ratio
   - Bağlantı sayısı

2. **Kapasite Metrikleri**
   - Veritabanı boyutu
   - Tablo boyutları
   - Disk kullanımı
   - Büyüme oranı

## Özelleştirme

### Özel Analiz Sorguları
```sql
SELECT 
    table_name,
    table_rows,
    data_length,
    index_length
FROM 
    information_schema.tables
WHERE 
    table_schema = database_name;
```

### Özel Optimizasyon Rutini
```bash
optimize_custom() {
    # Özel optimizasyon mantığı
    local tables=$1
    for table in $tables; do
        optimize_table $table
    done
}
```

## Gelecek Özellikler

- Otomatik indeks önerileri
- Query plan analizi
- Replikasyon monitörü
- Performans tahminleme

## Güvenlik Önlemleri

1. **Yetkilendirme**
   - Minimum gerekli yetkiler
   - Rol tabanlı erişim
   - Şifreli bağlantılar

2. **Yedek Güvenliği**
   - Şifrelenmiş yedekler
   - Güvenli transfer
   - Erişim kontrolü

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Implement your changes
4. Add tests
5. Create a Pull Request

## Lisans

MIT License
