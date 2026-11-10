# Dependency Analiz Scripti

## Genel Bakış
Bu script, projenin bağımlılıklarını analiz eder, güvenlik açıklarını tespit eder ve detaylı rapor oluşturur.

## Amaç ve Kapsam
- Composer bağımlılıkları analizi
- NPM bağımlılıkları analizi
- Güvenlik açıkları tespiti
- Bağımlılık grafiği oluşturma

## Kullanım Senaryoları

### 1. Tam Analiz
```bash
./dependency_analyzer.sh
```

### 2. Güvenlik Kontrolü
```bash
./dependency_analyzer.sh --security-only
```

### 3. Bağımlılık Grafiği
```bash
./dependency_analyzer.sh --graph-only
```

## Avantajlar

1. **Kapsamlı Analiz**
   - Çoklu paket yöneticisi desteği
   - Detaylı güvenlik taraması
   - Görsel bağımlılık grafiği

2. **Proaktif Bakım**
   - Güncellenebilir paketlerin tespiti
   - Kullanılmayan bağımlılıkların tespiti
   - Çakışan bağımlılıkların tespiti

3. **Raporlama**
   - HTML formatında detaylı rapor
   - JSON formatında ham veri
   - Görsel grafikler

## Özellikler

### Temel Özellikler
- Composer ve NPM desteği
- Güvenlik açığı taraması
- Bağımlılık grafiği
- Versiyon kontrolü

### Gelişmiş Özellikler
- Kullanılmayan bağımlılık tespiti
- Lisans uyumluluk kontrolü
- Paket boyutu analizi
- Trend analizi

## Konfigürasyon

### Analiz Ayarları
```json
{
  "package_managers": ["composer", "npm"],
  "security_scan": true,
  "generate_graph": true,
  "check_licenses": true
}
```

### Rapor Ayarları
```json
{
  "output_format": ["html", "json"],
  "include_details": true,
  "graph_format": "png",
  "save_raw_data": true
}
```

## En İyi Uygulamalar

1. **Düzenli Analiz**
   - Her sprint sonunda
   - Major güncellemelerden önce
   - Güvenlik denetimlerinde

2. **Versiyon Yönetimi**
   - Semantic versioning
   - Lock dosyalarının kullanımı
   - Düzenli güncelleme

## Sık Karşılaşılan Sorunlar

### Problem: Çakışan Bağımlılıklar
**Çözüm:**
```bash
./dependency_analyzer.sh --resolve-conflicts
```

### Problem: Eski Bağımlılıklar
**Çözüm:**
```bash
./dependency_analyzer.sh --update-check
```

## CI/CD Entegrasyonu

### Jenkins Pipeline
```groovy
pipeline {
    stage("Dependency Analysis") {
        steps {
            sh "./dependency_analyzer.sh --ci"
            archiveArtifacts "dependency_analysis/*"
        }
    }
}
```

### GitHub Actions
```yaml
name: Dependency Analysis
on: [push, pull_request]
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: ./dependency_analyzer.sh --ci
```

## Metrikler ve Raporlama

1. **Bağımlılık Metrikleri**
   - Toplam paket sayısı
   - Direkt vs. dolaylı bağımlılıklar
   - Paket boyutları

2. **Güvenlik Metrikleri**
   - Kritik açık sayısı
   - Orta seviye açık sayısı
   - Düşük seviye açık sayısı

## Özelleştirme

### Özel Analiz Kuralları
```json
{
  "custom_rules": [
    {
      "pattern": "deprecated-package",
      "level": "warning",
      "message": "Bu paket kullanımdan kaldırılmış"
    }
  ]
}
```

### Özel Rapor Şablonu
```html
<template id="custom-report">
  <div class="analysis-report">
    <!-- özel rapor yapısı -->
  </div>
</template>
```

## Gelecek Özellikler

- Otomatik güncelleme önerileri
- Yapay zeka destekli analiz
- Performans etkisi analizi
- Alternatif paket önerileri

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Implement your changes
4. Add tests
5. Create a Pull Request

## Lisans

MIT License
