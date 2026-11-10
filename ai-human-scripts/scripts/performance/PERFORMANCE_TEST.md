# Gelişmiş Performans Test Scripti

## Genel Bakış
Bu script, web uygulamalarının performans testlerini otomatize eder ve detaylı analiz raporları oluşturur.

## Amaç ve Kapsam
- Web uygulaması performans ölçümü
- Yük testi senaryoları
- Sistem kaynak kullanımı izleme
- Detaylı metrik analizi ve raporlama

## Kullanım Senaryoları

### 1. Basit Performans Testi
```bash
./performance_test.sh
```

### 2. Özel Parametrelerle Test
```bash
./performance_test.sh --url=https://example.com --requests=5000 --concurrency=20
```

### 3. Uzun Süreli Yük Testi
```bash
./performance_test.sh --duration=3600 --monitor-resources
```

## Avantajlar

1. **Kapsamlı Analiz**
   - Detaylı performans metrikleri
   - Sistem kaynak kullanımı takibi
   - Görsel raporlama

2. **Otomasyon**
   - CI/CD entegrasyonu
   - Otomatik raporlama
   - Trend analizi

3. **Esneklik**
   - Özelleştirilebilir parametreler
   - Farklı test senaryoları
   - Çoklu endpoint desteği

## Özellikler

### Temel Özellikler
- Apache Benchmark entegrasyonu
- Sistem kaynak izleme
- JSON formatında metrik çıktısı
- Grafik oluşturma

### Gelişmiş Özellikler
- Trend analizi
- Anomali tespiti
- Otomatik raporlama
- Email bildirim

## Konfigürasyon

### Test Parametreleri
```json
{
  "target_url": "http://localhost",
  "requests": 1000,
  "concurrency": 10,
  "test_duration": 60,
  "monitor_interval": 5
}
```

### Rapor Ayarları
```json
{
  "output_format": ["json", "csv", "html"],
  "graph_enabled": true,
  "email_notification": true,
  "save_raw_data": true
}
```

## En İyi Uygulamalar

1. **Test Planlaması**
   - Baseline ölçümü
   - Kademeli yük artışı
   - Düzenli test tekrarı

2. **Metrik Takibi**
   - Response time
   - Throughput
   - Error rate
   - Resource utilization

## Sık Karşılaşılan Sorunlar

### Problem: Yüksek Latency
**Analiz:**
```bash
./performance_test.sh --analyze-latency
```

### Problem: Resource Bottleneck
**İzleme:**
```bash
./performance_test.sh --monitor-resources --detailed
```

## CI/CD Entegrasyonu

### Jenkins Pipeline
```groovy
pipeline {
    stage("Performance Test") {
        steps {
            sh "./performance_test.sh --ci"
            archiveArtifacts "performance_reports/*"
        }
    }
}
```

### GitHub Actions
```yaml
name: Performance Test
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: ./performance_test.sh --ci
      - uses: actions/upload-artifact@v2
        with:
          name: performance-report
          path: performance_reports/
```

## Metrikler ve Raporlama

1. **Temel Metrikler**
   - Requests per second
   - Time per request
   - Transfer rate

2. **Sistem Metrikleri**
   - CPU usage
   - Memory consumption
   - Network I/O

## Özelleştirme

### Özel Test Senaryoları
```bash
#!/bin/bash
# Özel yük profili
for i in {1..5}; do
    ./performance_test.sh --concurrency=$((i*10))
    sleep 60
done
```

### Metrik Hesaplama
```python
def calculate_apdex(response_times, threshold=1.0):
    satisfied = len([t for t in response_times if t <= threshold])
    tolerating = len([t for t in response_times if threshold < t <= threshold*4])
    return (satisfied + tolerating/2) / len(response_times)
```

## Gelecek Özellikler

- Distributed load testing
- Machine learning based anomaly detection
- Real-time monitoring dashboard
- Automated performance optimization suggestions

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Implement your changes
4. Add tests
5. Create a Pull Request

## Lisans

MIT License
