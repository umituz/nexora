# Kod Kalite Analiz Scripti

## Genel Bakış
Bu script, projenin kod kalitesini analiz eder ve iyileştirme önerileri sunar.

## Amaç ve Kapsam
- Kod standartlarına uygunluk kontrolü
- Kod tekrarlarının tespiti
- Karmaşıklık analizi
- Güvenlik açıklarının tespiti

## Kullanım Senaryoları

### 1. Tam Kod Analizi
```bash
./code_quality.sh --full-analysis
```

### 2. Hızlı Kontrol
```bash
./code_quality.sh --quick-check
```

### 3. Belirli Dizin Analizi
```bash
./code_quality.sh --path=/path/to/directory
```

## Avantajlar

1. **Kod Kalitesi**
   - Tutarlı kod yapısı
   - Azaltılmış teknik borç
   - Daha iyi maintainability

2. **Verimlilik**
   - Otomatik kod düzeltmeleri
   - Hızlı geri bildirim
   - CI/CD entegrasyonu

3. **Güvenlik**
   - Güvenlik açıklarının erken tespiti
   - Best practice kontrolleri
   - Dependency analizi

## Özellikler

### Statik Kod Analizi
- Syntax kontrolleri
- Code smell tespiti
- Complexity metrics
- Duplicate code detection

### Güvenlik Taraması
- OWASP kontrolü
- Dependency check
- SQL injection tespiti
- XSS vulnerability kontrolü

## Konfigürasyon

### PHP_CodeSniffer Ayarları
```xml
<?xml version="1.0"?>
<ruleset name="Custom Standard">
    <rule ref="PSR2"/>
    <exclude-pattern>*/vendor/*</exclude-pattern>
</ruleset>
```

### ESLint Ayarları
```json
{
  "extends": ["eslint:recommended"],
  "env": {
    "browser": true,
    "node": true
  }
}
```

## En İyi Uygulamalar

1. **Düzenli Kontrol**
   - Her commit öncesi kontrol
   - Haftalık detaylı analiz
   - Aylık trend analizi

2. **Metrik Takibi**
   - Kod kapsama oranı
   - Cyclomatic complexity
   - Technical debt ratio

## Sık Karşılaşılan Sorunlar

### Problem: Yüksek Karmaşıklık
**Çözüm:**
```bash
./code_quality.sh --fix-complexity
```

### Problem: Kod Tekrarları
**Çözüm:**
```bash
./code_quality.sh --detect-duplicates --fix
```

## CI/CD Entegrasyonu

### GitLab CI
```yaml
quality:
  stage: test
  script:
    - ./code_quality.sh --ci
  artifacts:
    reports:
      quality: quality-report.json
```

### GitHub Actions
```yaml
name: Code Quality
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: ./code_quality.sh --ci
```

## Metrikler ve Raporlama

1. **Kod Metrikleri**
   - Lines of Code (LOC)
   - Cyclomatic Complexity
   - Maintainability Index

2. **Kalite Göstergeleri**
   - Test Coverage
   - Code Duplication
   - Bug Density

## Özelleştirme

### Kural Seti Oluşturma
```php
<?php
class CustomRuleset extends PHPCSRuleset
{
    public function register()
    {
        return [T_CLASS, T_INTERFACE];
    }
}
```

### Özel Kontroller
```javascript
module.exports = {
  create: function(context) {
    return {
      CallExpression: function(node) {
        // özel kontrol mantığı
      }
    };
  }
};
```

## Gelecek Özellikler

- AI destekli kod analizi
- Real-time monitoring
- Automated fix suggestions
- Team performance metrics

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Lisans

MIT License
