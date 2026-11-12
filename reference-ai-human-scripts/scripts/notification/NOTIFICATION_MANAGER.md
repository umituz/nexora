# Bildirim Yönetim Sistemi

## Genel Bakış

Bu script, farklı bildirim kanallarını (email, push, SMS, Slack) merkezi bir yerden yönetmek için tasarlanmış kapsamlı bir bildirim yönetim sistemidir.

## Özellikler

-   Çoklu bildirim kanalı desteği
-   Kuyruk tabanlı bildirim işleme
-   Detaylı loglama sistemi
-   Renkli terminal çıktıları
-   JSON tabanlı konfigürasyon
-   Hata yönetimi ve raporlama

## Kullanım

```bash
./notification_manager.sh
```

### Menü Seçenekleri

1. Email Bildirimi Gönder
2. Push Bildirimi Gönder
3. SMS Bildirimi Gönder
4. Slack Bildirimi Gönder
5. Bildirim Kuyruğunu İşle
6. Bildirim Loglarını Görüntüle

## Konfigürasyon

`notification_config.json` dosyasında aşağıdaki ayarları yapabilirsiniz:

-   Email sunucu ayarları
-   Push notification credentials
-   SMS gateway ayarları
-   Slack webhook URL'leri

## Bildirim Türleri

### Email

-   SMTP üzerinden email gönderimi
-   HTML ve düz metin desteği
-   Dosya eki desteği
-   Toplu mail gönderimi

### Push

-   Firebase Cloud Messaging desteği
-   Apple Push Notification Service desteği
-   Web Push bildirimleri
-   Rich notification desteği

### SMS

-   Çoklu SMS gateway desteği
-   Toplu SMS gönderimi
-   SMS durum takibi
-   Şablon desteği

### Slack

-   Webhook entegrasyonu
-   Kanal ve DM desteği
-   Rich message formatı
-   Interaktif bileşenler

## Kuyruk Sistemi

-   JSON formatında bildirim kuyruğu
-   Asenkron bildirim işleme
-   Yeniden deneme mekanizması
-   Öncelik bazlı işleme

## Loglama

-   Detaylı log kayıtları
-   Rotasyon desteği
-   Log seviye yönetimi
-   Log analizi

## Hata Yönetimi

-   Otomatik hata yakalama
-   Yeniden deneme mekanizması
-   Hata bildirimleri
-   Durum raporlama

## Güvenlik

-   API anahtarı yönetimi
-   Rate limiting
-   IP kısıtlamaları
-   Şifreleme desteği

## Performans

-   Asenkron işleme
-   Batch processing
-   Önbellekleme
-   Kaynak optimizasyonu

## Entegrasyon

-   RESTful API desteği
-   Webhook entegrasyonları
-   Event-driven mimari
-   Mikroservis uyumlu

## Örnekler

### Email Bildirimi

```bash
./notification_manager.sh email "Önemli Duyuru" "users.txt"
```

### Push Bildirimi

```bash
./notification_manager.sh push "Yeni Güncelleme" "all_devices"
```

### SMS Bildirimi

```bash
./notification_manager.sh sms "Acil Durum Bildirimi" "phone_list.txt"
```

### Slack Bildirimi

```bash
./notification_manager.sh slack "Deploy Tamamlandı" "#deploy-channel"
```

## Sorun Giderme

-   Yaygın hatalar ve çözümleri
-   Debugging ipuçları
-   Log analizi
-   Sistem durumu kontrolü

## Katkıda Bulunma

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Lisans

MIT License
