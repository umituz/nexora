# Önbellek Yönetim Scripti

## Genel Bakış
Bu script, Redis ve Memcached önbellek sistemlerinin yönetimi, izlenmesi ve optimizasyonu için kapsamlı araçlar sunar.

## Amaç ve Kapsam
- Redis ve Memcached yönetimi
- Önbellek performans analizi
- Anahtar analizi ve optimizasyonu
- Önbellek temizleme ve bakım
- Detaylı raporlama

## Kullanım Senaryoları

### 1. Tam Önbellek Analizi
```bash
./cache_manager.sh
```

### 2. Önbellek Temizleme
```bash
./cache_manager.sh --flush
```

### 3. Performans Analizi
```bash
./cache_manager.sh --analyze
```

## Avantajlar

1. **Performans İzleme**
   - Gerçek zamanlı metrikler
   - Kullanım analizi
   - Kapasite planlama

2. **Otomatik Yönetim**
   - Önbellek temizleme
   - Anahtar optimizasyonu
   - TTL yönetimi

3. **Detaylı Raporlama**
   - HTML raporlar
   - Metrik görselleştirme
   - Trend analizi

## Özellikler

### Redis Özellikleri
- Memory kullanım analizi
- Anahtar dağılım analizi
- Bağlantı yönetimi
- Komut istatistikleri

### Memcached Özellikleri
- Item istatistikleri
- Memory kullanımı
- Bağlantı yönetimi
- Hit/Miss oranları

## Konfigürasyon

### Redis Ayarları
```json
{
  "redis": {
    "host": "localhost",
    "port": 6379,
    "auth": "",
    "db": 0
  }
}
```

### Memcached Ayarları
```json
{
  "memcached": {
    "host": "localhost",
    "port": 11211,
    "timeout": 3
  }
}
```

## En İyi Uygulamalar

1. **Önbellek Stratejisi**
   - Uygun TTL değerleri
   - Anahtar isimlendirme
   - Memory limitleri

2. **Performans Optimizasyonu**
   - Düzenli temizlik
   - Anahtar optimizasyonu
   - Bellek yönetimi

## Sık Karşılaşılan Sorunlar

### Problem: Yüksek Memory Kullanımı
**Çözüm:**
```bash
./cache_manager.sh --optimize-memory
```

### Problem: Önbellek Vuruş Oranı Düşük
**Analiz:**
```bash
./cache_manager.sh --analyze-hit-rate
```

## Otomatik Görevler

### Günlük Temizlik
```cron
0 2 * * * /path/to/cache_manager.sh --daily-cleanup
```

### Saatlik Analiz
```cron
0 * * * * /path/to/cache_manager.sh --hourly-stats
```

## Metrikler ve Raporlama

1. **Performans Metrikleri**
   - Hit/Miss oranları
   - Latency değerleri
   - Memory kullanımı
   - Eviction sayıları

2. **Kapasite Metrikleri**
   - Toplam anahtar sayısı
   - Ortalama TTL
   - Memory dağılımı
   - Fragmantasyon oranı

## Özelleştirme

### Özel Temizlik Rutini
```bash
cleanup_custom() {
    # Özel temizlik mantığı
    local pattern=$1
    redis-cli SCAN 0 MATCH $pattern | xargs redis-cli DEL
}
```

### Özel Metrik Toplama
```python
def collect_custom_metrics():
    # Özel metrik toplama mantığı
    metrics = {
        "custom_metric_1": get_metric_1(),
        "custom_metric_2": get_metric_2()
    }
    return metrics
```

## Gelecek Özellikler

- Otomatik ölçeklendirme önerileri
- Machine learning tabanlı TTL optimizasyonu
- Gerçek zamanlı anomali tespiti
- Cluster yönetimi desteği

## Güvenlik Önlemleri

1. **Erişim Kontrolü**
   - Şifreli bağlantılar
   - IP kısıtlamaları
   - Rol tabanlı erişim

2. **Veri Güvenliği**
   - Hassas veri kontrolü
   - Anahtar şifreleme
   - Audit logging

## Entegrasyon

### Prometheus Entegrasyonu
```yaml
metrics:
  - name: cache_hit_rate
    type: gauge
    help: "Cache hit rate percentage"
```

### Grafana Dashboard
```json
{
  "dashboard": {
    "panels": [
      {
        "title": "Cache Hit Rate",
        "type": "graph"
      }
    ]
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
