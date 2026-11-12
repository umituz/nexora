# Container Yönetim Sistemi

## Genel Bakış

Bu sistem, Docker ve Kubernetes container'larını yönetmek için kapsamlı bir araç setidir. Container'ların oluşturulması, yönetilmesi, izlenmesi ve yedeklenmesi işlemlerini otomatize eder.

## Özellikler

-   Docker container yönetimi
-   Kubernetes pod yönetimi
-   Docker Compose yönetimi
-   Container registry yönetimi
-   Container monitoring
-   Container backup
-   Container network yönetimi
-   Detaylı loglama

## Sistem Gereksinimleri

-   Bash 4.0+
-   Docker
-   Docker Compose
-   Kubernetes (kubectl)
-   jq (JSON işleme)
-   AWS CLI (opsiyonel)

## Kurulum

1. Script'e çalıştırma izni verin:

```bash
chmod +x container_manager.sh
```

2. Gerekli dizinlerin oluşturulduğundan emin olun:

-   config/
-   logs/
-   compose/
-   backup/

3. Docker ve Kubernetes yapılandırması:

```bash
# Docker login
docker login

# Kubernetes config
kubectl config use-context my-cluster
```

## Kullanım

### Script Çalıştırma

```bash
./container_manager.sh
```

### Menü Seçenekleri

1. Docker Container Yönetimi
2. Kubernetes Pod Yönetimi
3. Docker Compose Yönetimi
4. Container Registry Yönetimi
5. Container Monitoring
6. Container Backup
7. Container Network Yönetimi
8. Çıkış

## Docker Container Yönetimi

### Özellikler

-   Container başlatma
-   Container durdurma
-   Container yeniden başlatma
-   Container silme
-   Container logları

### Örnek

```bash
# Container başlatma
Container adı: my-container
```

## Kubernetes Pod Yönetimi

### Özellikler

-   Pod bilgisi görüntüleme
-   Pod logları
-   Pod shell erişimi
-   Pod silme

### Örnek

```bash
# Pod bilgisi
Pod adı: my-pod
Namespace: default
```

## Docker Compose Yönetimi

### Özellikler

-   Compose projesi başlatma
-   Compose projesi durdurma
-   Compose projesi yeniden başlatma
-   Compose logları

### Örnek

```bash
# Compose up
Proje adı: my-project
```

### Compose Dosya Yapısı

```yaml
version: "3"
services:
    web:
        image: nginx
        ports:
            - "80:80"
    db:
        image: mysql
        environment:
            MYSQL_ROOT_PASSWORD: example
```

## Container Registry Yönetimi

### Özellikler

-   Image push
-   Image pull
-   Image tag

### Örnek

```bash
# Image push
Image adı: my-app
Tag: v1.0
Registry: docker.io
```

## Container Monitoring

### İzlenen Metrikler

-   CPU kullanımı
-   Bellek kullanımı
-   Network I/O
-   Disk I/O
-   Container durumu
-   Log akışı

### Örnek

```bash
# Container monitoring
Container adı: my-container
```

## Container Backup

### Özellikler

-   Container commit
-   Image export
-   Sıkıştırılmış yedekleme
-   Timestamp ile isimlendirme

### Örnek

```bash
# Container backup
Container adı: my-container
```

## Container Network Yönetimi

### Özellikler

-   Network oluşturma
-   Network silme
-   Container network bağlantısı
-   Network bilgisi görüntüleme

### Örnek

```bash
# Network oluşturma
Network adı: my-network
```

## Dizin Yapısı

```
container/
├── config/
│   └── container_config.json
├── logs/
│   └── container_manager.log
├── compose/
│   └── project_name/
│       └── docker-compose.yml
├── backup/
│   └── container_backups/
└── container_manager.sh
```

## Konfigürasyon

`config/container_config.json` formatı:

```json
{
    "docker": {
        "default_registry": "docker.io",
        "auto_cleanup": true,
        "max_containers": 10
    },
    "kubernetes": {
        "default_namespace": "default",
        "context": "my-cluster"
    },
    "monitoring": {
        "interval": 5,
        "metrics": ["cpu", "memory", "network", "disk"]
    },
    "backup": {
        "retention_days": 7,
        "compression": true
    }
}
```

## Loglama

Her işlem için detaylı log kaydı:

-   Timestamp
-   İşlem türü
-   Container/Pod bilgisi
-   Başarı/başarısızlık durumu
-   Hata detayları

## Hata Yönetimi

-   Container durumu kontrolü
-   Network bağlantı kontrolü
-   Disk alan kontrolü
-   Yetki kontrolü
-   Otomatik retry mekanizması

## Güvenlik

-   Registry authentication
-   RBAC kontrolü
-   Network izolasyonu
-   Güvenli backup
-   Log sanitization

## En İyi Uygulamalar

1. Container'ları düzenli yedekleyin
2. Resource limitlerini ayarlayın
3. Network segmentasyonu yapın
4. Logging ve monitoring kurun
5. Security best practices uygulayın

## Sorun Giderme

1. Container loglarını kontrol edin
2. System loglarını kontrol edin
3. Network bağlantısını doğrulayın
4. Resource kullanımını monitör edin
5. Security politikalarını kontrol edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request oluşturun

## Lisans

MIT License
