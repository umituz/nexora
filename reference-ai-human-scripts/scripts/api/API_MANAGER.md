# API Yönetim Sistemi

## Genel Bakış

Bu sistem, API'lerin test edilmesi, izlenmesi, dokümante edilmesi ve güvenlik taraması yapılması için kapsamlı bir araç setidir.

## Özellikler

-   API endpoint testi
-   Mock API sunucusu
-   API dokümantasyon oluşturma
-   Güvenlik taraması
-   Performans testi
-   Detaylı loglama
-   JSON tabanlı konfigürasyon

## Sistem Gereksinimleri

-   Bash 4.0+
-   curl
-   jq
-   Node.js ve npm
-   Apache Benchmark (ab)
-   json-server (mock sunucu için)
-   redoc-cli (dokümantasyon için)

## Kurulum

1. Gerekli paketleri yükleyin:

```bash
npm install -g json-server redoc-cli
```

2. Script'e çalıştırma izni verin:

```bash
chmod +x api_manager.sh
```

3. Gerekli dizinlerin oluşturulduğundan emin olun:

-   config/
-   logs/
-   mock/
-   documentation/
-   testing/

## Kullanım

### Script Çalıştırma

```bash
./api_manager.sh
```

### Menü Seçenekleri

1. API Endpoint Testi
2. Mock API Sunucusu Başlat
3. Mock API Sunucusu Durdur
4. API Dokümantasyonu Oluştur
5. API Güvenlik Taraması
6. API Performans Testi
7. Çıkış

## API Endpoint Testi

### Özellikler

-   HTTP metod desteği (GET, POST, PUT, DELETE)
-   Header ekleme
-   JSON data gönderme
-   Response analizi
-   Status kod kontrolü
-   Response time ölçümü

### Örnek

```bash
API URL: https://api.example.com/users
HTTP Metodu: POST
Data: {"name": "John Doe", "email": "john@example.com"}
Headers: Authorization: Bearer token123
```

## Mock API Sunucusu

### Özellikler

-   JSON tabanlı mock data
-   Özelleştirilebilir port
-   CRUD operasyonları
-   Otomatik rota oluşturma
-   WebSocket desteği

### Mock Data Örneği

```json
{
    "users": [
        {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com"
        }
    ]
}
```

## API Dokümantasyonu

### Özellikler

-   OpenAPI/Swagger desteği
-   Responsive HTML çıktısı
-   Interaktif API konsolu
-   Markdown desteği
-   Şema görselleştirme

### Örnek Spec

```yaml
openapi: 3.0.0
info:
    title: Sample API
    version: 1.0.0
paths:
    /users:
        get:
            summary: Kullanıcıları listele
```

## Güvenlik Taraması

### Test Edilen Güvenlik Açıkları

-   Rate limiting
-   SQL Injection
-   XSS (Cross-Site Scripting)
-   CSRF (Cross-Site Request Forgery)
-   Authentication/Authorization
-   Input validation

### Örnek Tarama

```bash
Hedef API URL: https://api.example.com
```

## Performans Testi

### Özellikler

-   Concurrent request testi
-   Response time analizi
-   Throughput ölçümü
-   Error rate analizi
-   Detailed reporting

### Örnek Test

```bash
API URL: https://api.example.com/users
İstek sayısı: 1000
Eşzamanlı istek: 50
```

## Dizin Yapısı

```
api/
├── config/
│   └── api_config.json
├── logs/
│   └── api_manager.log
├── mock/
│   ├── mock_data.json
│   └── server.pid
├── documentation/
│   └── index.html
├── testing/
│   ├── last_response.json
│   ├── last_error.json
│   └── performance_report.txt
└── api_manager.sh
```

## Konfigürasyon

`config/api_config.json` formatı:

```json
{
    "default_headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer token123"
    },
    "mock_server": {
        "port": 3000,
        "delay": 100
    },
    "security": {
        "rate_limit": 100,
        "timeout": 5000
    }
}
```

## Loglama

Her işlem için detaylı log kaydı:

-   Timestamp
-   İşlem türü
-   Sonuç
-   Hata detayları

## Hata Yönetimi

-   Connection timeout
-   Rate limiting
-   Authentication errors
-   Invalid responses
-   Server errors

## Güvenlik

-   API key yönetimi
-   SSL/TLS kontrolü
-   Rate limiting
-   Input sanitization
-   Error handling

## En İyi Uygulamalar

1. Düzenli güvenlik taraması yapın
2. API dokümantasyonunu güncel tutun
3. Performans testlerini off-peak saatlerde yapın
4. Mock sunucuyu sadece test ortamında kullanın
5. Hassas verileri loglardan temizleyin

## Sorun Giderme

1. Log dosyalarını kontrol edin
2. Network bağlantısını doğrulayın
3. API erişim yetkilerini kontrol edin
4. SSL sertifikalarını kontrol edin
5. Rate limit durumunu kontrol edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request oluşturun

## Lisans

MIT License
