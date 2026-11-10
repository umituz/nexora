# Sistem İzleme Scripti

## Genel Bakış
Bu script, sistemin sağlık durumunu sürekli olarak izler, metrikleri toplar ve anormal durumları raporlar.

## Amaç ve Kapsam
- Sistem kaynak kullanımı izleme
- Servis durumu kontrolü
- Network bağlantı kontrolü
- Metrik toplama ve raporlama
- Uyarı sistemi

## Kullanım Senaryoları

### 1. Sürekli İzleme
```bash
./system_monitor.sh --daemon
```

### 2. Tek Seferlik Kontrol
```bash
./system_monitor.sh --check
```

### 3. Belirli Metrik İzleme
```bash
./system_monitor.sh --metric=cpu,memory
```

## Avantajlar

1. **Proaktif İzleme**
   - Sorunları önceden tespit etme
   - Otomatik uyarı sistemi
   - Trend analizi

2. **Kapsamlı Metrikler**
   - CPU kullanımı
   - Memory kullanımı
   - Disk kullanımı
   - Network durumu

3. **Esnek Raporlama**
   - HTML raporlar
   - JSON metrikler
   - Email bildirimleri

## Özellikler

### Sistem Metrikleri
- CPU kullanım oranı
- Memory kullanım oranı
- Disk kullanım oranı
- Sistem yükü (Load average)

### Servis İzleme
- Nginx durumu
- PHP-FPM durumu
- MySQL durumu
- Redis durumu

## Konfigürasyon

### İzleme Ayarları
```json
{
  "intervals": {
    "cpu": 60,
    "memory": 60,
    "disk": 300,
    "network": 120
  },
  "thresholds": {
    "cpu": 80,
    "memory": 90,
    "disk": 85,
    "load": 5
  }
}
```

### Bildirim Ayarları
```json
{
  "notifications": {
    "email": true,
    "slack": true,
    "discord": false
  },
  "alert_levels": ["warning", "critical"]
}
```

## En İyi Uygulamalar

1. **İzleme Stratejisi**
   - Düzenli kontroller
   - Uygun eşik değerleri
   - Trend analizi

2. **Uyarı Yönetimi**
   - Önceliklendirme
   - Uyarı birleştirme
   - Yanlış pozitif azaltma

## Sık Karşılaşılan Sorunlar

### Problem: Yüksek CPU Kullanımı
**Analiz:**
```bash
./system_monitor.sh --analyze-cpu
```

### Problem: Memory Sızıntısı
**İzleme:**
```bash
./system_monitor.sh --memory-leak-detection
```

## Grafana Entegrasyonu

### Metrik Gönderimi
```python
def send_to_grafana(metrics):
    # Grafana API entegrasyonu
    pass
```

### Dashboard Örneği
```json
{
  "dashboard": {
    "panels": [
      {
        "title": "CPU Usage",
        "type": "graph"
      },
      {
        "title": "Memory Usage",
        "type": "gauge"
      }
    ]
  }
}
```

## Metrikler ve Raporlama

1. **Sistem Metrikleri**
   - CPU kullanımı (%)
   - Memory kullanımı (%)
   - Disk I/O (MB/s)
   - Network trafiği (MB/s)

2. **Servis Metrikleri**
   - Uptime
   - Response time
   - Error rate
   - Connection count

## Özelleştirme

### Özel Metrik Ekleme
```bash
check_custom_metric() {
    # Özel metrik kontrolü
    local metric_value=$(custom_command)
    log "Özel Metrik: $metric_value"
}
```

### Özel Uyarı Kuralları
```json
{
  "custom_rules": [
    {
      "metric": "cpu",
      "condition": "> 90",
      "duration": "5m",
      "action": "restart_service"
    }
  ]
}
```

## Gelecek Özellikler

- Machine learning tabanlı anomali tespiti
- Otomatik problem çözme
- Dağıtık sistem izleme
- Gerçek zamanlı metrik görselleştirme

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Implement your changes
4. Add tests
5. Create a Pull Request

## Lisans

MIT License
