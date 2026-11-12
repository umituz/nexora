# Kuyruk Yönetim Scripti

## Genel Bakış
Bu script, Redis ve RabbitMQ kuyruk sistemlerinin yönetimi, izlenmesi ve optimizasyonu için kapsamlı araçlar sunar.

## Amaç ve Kapsam
- Redis kuyruk yönetimi
- RabbitMQ kuyruk yönetimi
- Laravel queue worker yönetimi
- Performans izleme
- Hata yönetimi

## Kullanım Senaryoları

### 1. Kuyruk Durumu Kontrolü
```bash
./queue_manager.sh
```

### 2. Kuyruk Temizleme
```bash
./queue_manager.sh --flush
```

### 3. Worker Yönetimi
```bash
./queue_manager.sh --manage-workers
```

## Avantajlar

1. **Merkezi Yönetim**
   - Çoklu kuyruk sistemi desteği
   - Tek noktadan kontrol
   - Otomatik izleme

2. **Performans İzleme**
   - Kuyruk boyutu takibi
   - Worker durumu kontrolü
   - Kaynak kullanımı analizi

3. **Hata Yönetimi**
   - Failed job takibi
   - Otomatik retry
   - Hata bildirimleri

## Özellikler

### Redis Özellikleri
- Kuyruk listesi
- Boyut analizi
- Performans metrikleri
- Temizleme araçları

### RabbitMQ Özellikleri
- Queue monitoring
- Consumer yönetimi
- Channel analizi
- Connection takibi

## Konfigürasyon

### Redis Ayarları
```json
{
  "redis": {
    "host": "localhost",
    "port": 6379,
    "db": 0,
    "prefix": "queues:"
  }
}
```

### RabbitMQ Ayarları
```json
{
  "rabbitmq": {
    "host": "localhost",
    "port": 5672,
    "user": "guest",
    "password": "guest",
    "vhost": "/"
  }
}
```

## En İyi Uygulamalar

1. **Kuyruk Stratejisi**
   - İş önceliklendirme
   - Retry politikası
   - Dead letter queues

2. **Worker Yönetimi**
   - Otomatik ölçeklendirme
   - Health check
   - Graceful shutdown

## Sık Karşılaşılan Sorunlar

### Problem: Uzun Kuyruklar
**Çözüm:**
```bash
./queue_manager.sh --scale-workers
```

### Problem: Failed Jobs
**Yönetim:**
```bash
./queue_manager.sh --retry-failed
```

## Otomatik Görevler

### Worker Kontrolü
```cron
*/5 * * * * /path/to/queue_manager.sh --check-workers
```

### Performans Raporu
```cron
0 * * * * /path/to/queue_manager.sh --performance-report
```

## Metrikler ve Raporlama

1. **Kuyruk Metrikleri**
   - Kuyruk boyutu
   - İşlem hızı
   - Bekleme süresi
   - Başarı oranı

2. **Worker Metrikleri**
   - CPU kullanımı
   - Memory kullanımı
   - İş başına süre
   - Aktif worker sayısı

## Özelleştirme

### Özel Kuyruk İşleyici
```php
class CustomQueueHandler
{
    public function process($job)
    {
        // Özel iş mantığı
    }

    public function failed($job)
    {
        // Hata yönetimi
    }
}
```

### Özel Metrik Toplayıcı
```python
def collect_queue_metrics():
    metrics = {
        "processed_jobs": get_processed_count(),
        "failed_jobs": get_failed_count(),
        "average_time": calculate_average_time()
    }
    return metrics
```

## Gelecek Özellikler

- Gerçek zamanlı monitöring
- AI tabanlı ölçeklendirme
- Otomatik performans optimizasyonu
- Dağıtık kuyruk yönetimi

## Güvenlik Önlemleri

1. **Erişim Kontrolü**
   - Authentication
   - Authorization
   - IP kısıtlaması

2. **Veri Güvenliği**
   - Şifreli iletişim
   - Hassas veri yönetimi
   - Audit logging

## Entegrasyon

### Prometheus Metrics
```yaml
metrics:
  - name: queue_size
    type: gauge
    help: "Current queue size"
  - name: processing_time
    type: histogram
    help: "Job processing time"
```

### Grafana Dashboard
```json
{
  "dashboard": {
    "panels": [
      {
        "title": "Queue Size",
        "type": "graph"
      },
      {
        "title": "Processing Rate",
        "type": "gauge"
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
