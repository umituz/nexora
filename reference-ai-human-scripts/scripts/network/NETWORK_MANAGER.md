# Ağ Yönetim Scripti

## Genel Bakış
Bu script, ağ altyapısının izlenmesi, analizi ve yönetimi için kapsamlı araçlar sunar.

## Amaç ve Kapsam
- Ağ bağlantı kontrolü
- Port tarama ve analizi
- SSL sertifika yönetimi
- DNS kayıt kontrolü
- Network interface analizi
- Bandwidth izleme

## Kullanım Senaryoları

### 1. Tam Ağ Analizi
```bash
./network_manager.sh
```

### 2. SSL Sertifika Kontrolü
```bash
./network_manager.sh --check-ssl
```

### 3. Port Tarama
```bash
./network_manager.sh --scan-ports
```

## Avantajlar

1. **Kapsamlı İzleme**
   - Bağlantı durumu
   - Servis erişilebilirliği
   - SSL sertifika geçerliliği

2. **Güvenlik Analizi**
   - Port tarama
   - SSL güvenliği
   - Ağ güvenlik duvarı

3. **Performans İzleme**
   - Bandwidth kullanımı
   - Latency ölçümü
   - Network kalitesi

## Özellikler

### Temel Özellikler
- Ping testi
- Port tarama
- SSL sertifika kontrolü
- DNS kayıt analizi

### Gelişmiş Özellikler
- Traceroute analizi
- Bandwidth monitörü
- Interface istatistikleri
- Routing tablosu analizi

## Konfigürasyon

### Hedef Ayarları
```json
{
  "targets": {
    "hosts": [
      "localhost",
      "google.com",
      "github.com"
    ],
    "ports": [80, 443, 3306, 6379]
  }
}
```

### SSL Ayarları
```json
{
  "ssl": {
    "domains": [
      "example.com",
      "api.example.com"
    ],
    "check_interval": 86400
  }
}
```

## En İyi Uygulamalar

1. **Ağ İzleme Stratejisi**
   - Düzenli kontroller
   - Proaktif izleme
   - Anomali tespiti

2. **SSL Yönetimi**
   - Otomatik yenileme
   - Sertifika takibi
   - Güvenlik standardı

## Sık Karşılaşılan Sorunlar

### Problem: SSL Sertifikası Süresi Dolmak Üzere
**Çözüm:**
```bash
./network_manager.sh --renew-ssl
```

### Problem: Yüksek Latency
**Analiz:**
```bash
./network_manager.sh --analyze-latency
```

## Otomatik Görevler

### SSL Kontrol
```cron
0 0 * * * /path/to/network_manager.sh --check-ssl
```

### Port Tarama
```cron
0 */6 * * * /path/to/network_manager.sh --scan-ports
```

## Metrikler ve Raporlama

1. **Ağ Metrikleri**
   - Latency
   - Packet loss
   - Bandwidth kullanımı
   - Connection count

2. **SSL Metrikleri**
   - Sertifika geçerlilik süresi
   - Şifreleme gücü
   - Protocol versiyonu
   - Güvenlik skoru

## Özelleştirme

### Özel Port Tarama
```bash
check_custom_ports() {
    local host=$1
    local ports=$2
    for port in $ports; do
        check_port $host $port
    done
}
```

### Özel SSL Kontrol
```bash
check_custom_ssl() {
    local domain=$1
    local cert_path=$2
    verify_ssl_cert $domain $cert_path
}
```

## Gelecek Özellikler

- Otomatik SSL yenileme
- Network trafik analizi
- DDoS koruma entegrasyonu
- AI tabanlı anomali tespiti

## Güvenlik Önlemleri

1. **Port Tarama**
   - Rate limiting
   - IP whitelisting
   - Güvenli tarama

2. **SSL Güvenliği**
   - Güçlü şifreleme
   - Güncel protokoller
   - Düzenli audit

## Entegrasyon

### Monitoring Sistemleri
```yaml
zabbix:
  metrics:
    - name: network.latency
      type: float
      interval: 60
```

### Alerting
```json
{
  "alerts": {
    "high_latency": {
      "threshold": 1000,
      "channel": "slack"
    }
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
