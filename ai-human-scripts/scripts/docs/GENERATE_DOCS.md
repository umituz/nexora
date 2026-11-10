# Dokümantasyon Oluşturma Scripti

## Genel Bakış
Bu script, projenin dokümantasyonunu otomatik olarak oluşturur ve yönetir.

## Amaç ve Kapsam
- Proje yapısının otomatik dokümantasyonu
- API dokümantasyonu oluşturma
- Kod örnekleri ve kullanım senaryoları
- Değişiklik geçmişi takibi

## Kullanım Senaryoları

### 1. Yeni Proje Dokümantasyonu
```bash
./generate_docs.sh --new-project
```

### 2. Mevcut Dokümantasyon Güncelleme
```bash
./generate_docs.sh --update
```

### 3. API Dokümantasyonu Oluşturma
```bash
./generate_docs.sh --api-docs
```

## Avantajlar
1. **Zaman Tasarrufu**
   - Otomatik dokümantasyon oluşturma
   - Şablon tabanlı yaklaşım
   - Toplu güncelleme imkanı

2. **Tutarlılık**
   - Standart format
   - Merkezi yönetim
   - Versiyon kontrolü

3. **Erişilebilirlik**
   - Markdown formatı sayesinde kolay okunabilirlik
   - Git entegrasyonu
   - Web tabanlı görüntüleme

## Özellikler

### Temel Özellikler
- Markdown formatında çıktı
- Çoklu dil desteği
- Otomatik dizin oluşturma
- Kod örnekleri ekleme

### Gelişmiş Özellikler
- API dokümantasyonu
- Swagger/OpenAPI entegrasyonu
- PDF çıktı desteği
- Arama fonksiyonu

## Konfigürasyon

### Temel Ayarlar
```json
{
  "output_format": "markdown",
  "language": "tr",
  "include_code_examples": true,
  "create_index": true
}
```

### Gelişmiş Ayarlar
```json
{
  "api_version": "v1",
  "enable_swagger": true,
  "pdf_export": true,
  "search_enabled": true
}
```

## En İyi Uygulamalar

1. **Düzenli Güncelleme**
   - Her sprint sonunda dokümantasyon güncellemesi
   - Değişiklik geçmişi tutma
   - Sürüm notları ekleme

2. **Format Standartları**
   - Tutarlı başlık yapısı
   - Kod örnekleri için syntax highlighting
   - Bağlantılar için göreceli yollar

3. **İçerik Organizasyonu**
   - Mantıksal gruplandırma
   - Kolay navigasyon
   - İlgili dokümanlara çapraz referanslar

## Sık Karşılaşılan Sorunlar

### Problem: Dokümantasyon Güncel Değil
**Çözüm:**
```bash
./generate_docs.sh --force-update
```

### Problem: Eksik API Dokümantasyonu
**Çözüm:**
```bash
./generate_docs.sh --scan-apis --update
```

## Entegrasyon

### CI/CD Pipeline
```yaml
docs:
  stage: build
  script:
    - ./generate_docs.sh --ci
  artifacts:
    paths:
      - docs/
```

### Git Hooks
```bash
#!/bin/bash
./generate_docs.sh --pre-commit
```

## Performans İyileştirmeleri

1. **Önbellekleme**
   - Değişmeyen içeriğin önbelleklenmesi
   - Kısmi güncelleme desteği

2. **Paralel İşleme**
   - Çoklu dosya işleme
   - Asenkron API çağrıları

## Güvenlik

1. **Hassas Bilgiler**
   - Otomatik redaksiyon
   - Çevresel değişken kullanımı

2. **Erişim Kontrolü**
   - Rol tabanlı erişim
   - IP kısıtlamaları

## Gelecek Özellikler

- Real-time kolaborasyon
- AI destekli içerik önerileri
- Otomatik çeviri desteği
- Interactive API playground

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Lisans

MIT License
