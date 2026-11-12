# Güvenlik Yönetim Sistemi

## Genel Bakış

Bu sistem, sistem güvenliğini yönetmek için tasarlanmış kapsamlı bir araçtır. Firewall yönetimi, erişim kontrolü, şifreleme, güvenlik denetimi ve tarama özelliklerini içerir.

## Özellikler

-   Firewall yönetimi
-   Erişim kontrolü
-   Şifreleme işlemleri
-   Güvenlik denetimi
-   Güvenlik taraması
-   Güvenlik raporlama
-   Detaylı loglama

## Sistem Gereksinimleri

-   Bash 4.0+
-   iptables
-   openssl
-   nmap
-   nikto
-   clamav
-   netstat
-   systemctl
-   sudo

## Kurulum

1. Script'e çalıştırma izni verin:

```bash
chmod +x security_manager.sh
```

2. Gerekli dizinlerin oluşturulduğundan emin olun:

-   config/
-   logs/
-   reports/

3. Gerekli araçların kurulumu:

```bash
# Debian/Ubuntu
apt-get install iptables openssl nmap nikto clamav

# RHEL/CentOS
yum install iptables openssl nmap nikto clamav
```

## Kullanım

### Script Çalıştırma

```bash
./security_manager.sh
```

### Menü Seçenekleri

1. Firewall Yönetimi
2. Erişim Kontrolü
3. Şifreleme İşlemleri
4. Güvenlik Denetimi
5. Güvenlik Taraması
6. Güvenlik Raporu
7. Çıkış

## Firewall Yönetimi

### Özellikler

-   Kural listeleme
-   Kural ekleme
-   Kural silme
-   Kuralları kaydetme
-   Kuralları geri yükleme

### Örnek

```bash
# Firewall kuralı ekleme
Port: 80
Kaynak IP: 192.168.1.0/24
```

## Erişim Kontrolü

### Özellikler

-   İzin listeleme
-   İzin ekleme
-   İzin silme
-   İzin kontrolü
-   Sudo yönetimi

### Örnek

```bash
# Kullanıcı izni ekleme
Kullanıcı: john
İzin: ALL
```

## Şifreleme İşlemleri

### Özellikler

-   Dosya şifreleme
-   Dosya şifre çözme
-   Anahtar oluşturma
-   AES-256 şifreleme
-   Salt ekleme

### Örnek

```bash
# Dosya şifreleme
Dosya: secret.txt
Şifreleme anahtarı: mykey123
```

## Güvenlik Denetimi

### Kontrol Edilen Alanlar

-   Sistem bilgileri
-   Açık portlar
-   Aktif servisler
-   Süper kullanıcı izinleri
-   Şüpheli dosyalar
-   Güvenlik güncellemeleri

### Örnek Rapor

```
Güvenlik Denetim Raporu - 2024-01-01
==============================

Sistem Bilgileri:
Linux server 5.4.0-generic

Açık Portlar:
22/tcp  LISTEN
80/tcp  LISTEN
443/tcp LISTEN
```

## Güvenlik Taraması

### Tarama Tipleri

-   Port taraması
-   Güvenlik açığı taraması
-   Malware taraması
-   Servis versiyonu tespiti
-   Güvenlik duvarı tespiti

### Örnek

```bash
# Port taraması
Hedef: 192.168.1.100
```

## Güvenlik Raporu

### Rapor İçeriği

-   Sistem güvenliği
-   Firewall durumu
-   Açık portlar
-   Güvenlik olayları
-   Güvenlik güncellemeleri

### Örnek Rapor

```html
<h1>Güvenlik Raporu - 2024-01-01</h1>
<h2>Sistem Güvenliği</h2>
<pre>
Linux server 5.4.0-generic
</pre>
<h2>Firewall Durumu</h2>
<pre>
Chain INPUT (policy ACCEPT)
target     prot opt source     destination
</pre>
```

## Dizin Yapısı

```
security/
├── config/
│   ├── security_config.json
│   └── iptables.rules
├── logs/
│   └── security_manager.log
├── reports/
│   ├── audit_20240101.txt
│   ├── scan_20240101.txt
│   └── security_report_20240101.html
└── security_manager.sh
```

## Konfigürasyon

`config/security_config.json` formatı:

```json
{
    "firewall": {
        "default_policy": "DROP",
        "allowed_ports": [22, 80, 443],
        "trusted_networks": ["192.168.1.0/24"]
    },
    "access": {
        "sudo_timeout": 15,
        "max_attempts": 3,
        "password_policy": {
            "min_length": 12,
            "require_special": true
        }
    },
    "encryption": {
        "algorithm": "aes-256-cbc",
        "key_length": 32,
        "use_salt": true
    },
    "scanning": {
        "interval": 86400,
        "exclude_paths": ["/tmp", "/proc"],
        "notify_on": ["HIGH", "CRITICAL"]
    }
}
```

## Loglama

Her işlem için detaylı log kaydı:

-   Timestamp
-   İşlem türü
-   Etkilenen sistem/dosya
-   Başarı/başarısızlık durumu
-   Hata detayları

## Hata Yönetimi

-   Yetki kontrolü
-   Dosya varlığı kontrolü
-   Bağlantı kontrolü
-   Servis durumu kontrolü
-   Hata bildirimi

## Güvenlik

-   Sudo yetki kontrolü
-   Şifreli işlemler
-   Güvenli dosya işlemleri
-   Log sanitization
-   Input validation

## En İyi Uygulamalar

1. Düzenli güvenlik taraması yapın
2. Firewall kurallarını güncel tutun
3. Erişim izinlerini kontrol edin
4. Güvenlik güncellemelerini takip edin
5. Logları düzenli analiz edin

## Sorun Giderme

1. Log dosyalarını kontrol edin
2. Servis durumlarını kontrol edin
3. Firewall kurallarını doğrulayın
4. Yetkileri kontrol edin
5. Sistem kaynaklarını monitör edin

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request oluşturun

## Lisans

MIT License
