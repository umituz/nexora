# Log Analyzer Script

## Açıklama
Bu script, sistem ve uygulama loglarını analiz ederek önemli hata ve uyarıları tespit eder.

## Özellikler
- Birden fazla log dosyasını aynı anda analiz edebilme
- Renkli konsol çıktısı
- Detaylı istatistikler
- Sonuçları dosyaya kaydetme

## Kullanım
```bash
./log_analyzer.sh
```

## Yapılandırma
Script içindeki şu değişkenleri özelleştirebilirsiniz:
- LOG_DIR: Log dosyalarının bulunduğu dizin
- LOG_FILES: Analiz edilecek log dosyaları
- KEYWORDS: Aranacak anahtar kelimeler

## Çıktı
Script çalıştırıldığında:
1. Her log dosyası için anahtar kelime araması yapar
2. Bulunan sonuçları ekrana ve dosyaya yazar
3. Her anahtar kelime için istatistik üretir

## Gereksinimler
- Bash shell
- grep komutu
- tee komutu
