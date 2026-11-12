# Depolama Yönetim Scripti

## Genel Bakış
Bu script, dosya sistemi depolama alanının yönetimi, analizi ve optimizasyonu için kapsamlı araçlar sunar.

## Amaç ve Kapsam
- Disk kullanım analizi
- Büyük dosya tespiti
- Eski dosya yönetimi
- İzin kontrolü
- Depolama optimizasyonu

## Kullanım Senaryoları

### 1. Depolama Analizi
```bash
./storage_manager.sh
```

### 2. Optimizasyon
```bash
./storage_manager.sh --optimize
```

### 3. Temizlik
```bash
./storage_manager.sh --cleanup
```

## Avantajlar

1. **Disk Yönetimi**
   - Kullanım analizi
   - Alan optimizasyonu
   - Otomatik temizlik

2. **Güvenlik**
   - İzin kontrolü
   - Sahiplik denetimi
   - Güvenli temizlik

3. **Raporlama**
   - Detaylı analizler
   - Trend takibi
   - HTML raporlar

## Özellikler

### Analiz Özellikleri
- Disk kullanım analizi
- Dosya türü dağılımı
- Büyük dosya tespiti
- Eski dosya tespiti

### Yönetim Özellikleri
- Otomatik temizlik
- Dosya sıkıştırma
- İzin düzenleme
- Log rotasyonu

## Konfigürasyon

### Dizin Ayarları
```json
{
  "monitored_dirs": [
    "/var/www/storage/app",
    "/var/www/storage/logs",
    "/var/www/storage/framework",
    "/var/www/public/uploads"
  ]
}
```

### Dosya Limitleri
```json
{
  "file_limits": {
    "image": "10MB",
    "video": "100MB",
    "log": "50MB",
    "backup": "500MB"
  }
}
```

## En İyi Uygulamalar

1. **Depolama Stratejisi**
   - Düzenli temizlik
   - Otomatik arşivleme
   - Yedekleme planı

2. **Optimizasyon Planı**
   - Periyodik kontrol
   - Önleyici bakım
   - Kapasite planlaması

## Sık Karşılaşılan Sorunlar

### Problem: Disk Dolu
**Çözüm:**
```bash
./storage_manager.sh --emergency-cleanup
```

### Problem: Bozuk İzinler
**Düzeltme:**
```bash
./storage_manager.sh --fix-permissions
```

## Otomatik Görevler

### Günlük Analiz
```cron
0 1 * * * /path/to/storage_manager.sh --analyze
```

### Haftalık Temizlik
```cron
0 2 * * 0 /path/to/storage_manager.sh --cleanup
```

## Metrikler ve Raporlama

1. **Depolama Metrikleri**
   - Toplam kullanım
   - Büyüme hızı
   - Dosya dağılımı
   - Temizlik etkinliği

2. **Performans Metrikleri**
   - I/O performansı
   - Disk latency
   - Fragmantasyon oranı
   - Cache hit rate

## Özelleştirme

### Özel Temizlik Kuralları
```bash
cleanup_custom() {
    local dir=$1
    local pattern=$2
    local age=$3
    
    find "$dir" -name "$pattern" -mtime +"$age" -delete
}
```

### Özel Analiz Rutini
```python
def analyze_storage_patterns():
    patterns = {
        "growth_rate": calculate_growth_rate(),
        "usage_patterns": analyze_usage(),
        "hotspots": find_hotspots()
    }
    return patterns
```

## Gelecek Özellikler

- AI tabanlı depolama optimizasyonu
- Otomatik dosya kategorilendirme
- Akıllı sıkıştırma
- Depolama tahminleme

## Güvenlik Önlemleri

1. **Dosya Güvenliği**
   - Güvenli silme
   - İzin yönetimi
   - Audit logging

2. **Erişim Kontrolü**
   - Rol tabanlı erişim
   - İşlem doğrulama
   - Aktivite izleme

## Entegrasyon

### Monitoring Sistemleri
```yaml
prometheus:
  metrics:
    - name: storage_usage
      type: gauge
      help: "Storage usage in bytes"
```

### Backup Sistemleri
```json
{
  "backup": {
    "schedule": "daily",
    "retention": "30d",
    "type": "incremental"
  }
}
```

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Implement your changes
4. Add tests
5. Create a Pull Request

## Lisans

MIT License
