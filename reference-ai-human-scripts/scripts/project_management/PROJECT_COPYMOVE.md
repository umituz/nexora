# Proje Kopyalama/Taşıma Aracı (project_copymove.sh)

`project_copymove.sh`, Neo projelerini kolayca kopyalamak veya taşımak için kullanılan bir araçtır. Bu script, projelerin yapısını koruyarak farklı dizinlere kopyalanmasını veya taşınmasını sağlar.

## Amaç

Bu araç, aşağıdaki amaçları gerçekleştirmek için tasarlanmıştır:

-   Projeleri farklı bir dizine kopyalamak veya taşımak
-   Birden fazla projeyi tek seferde işlemek
-   Projeleri yeniden adlandırmak
-   Belirli dizinleri (vendor, node_modules, .git) dahil etmek veya hariç tutmak
-   İşlemleri simüle etmek (dry run)

## Kullanım

```bash
./project_copymove.sh [seçenekler] [proje_adı1 proje_adı2 ...]
```

### Seçenekler

| Seçenek                 | Açıklama                                        |
| ----------------------- | ----------------------------------------------- |
| `-h, --help`            | Yardım mesajını gösterir                        |
| `-c, --copy`            | Kopyalama modunu etkinleştirir (varsayılan)     |
| `-m, --move`            | Taşıma modunu etkinleştirir                     |
| `-s, --source <desen>`  | Kaynak projeleri regex ile belirle              |
| `-t, --target <dizin>`  | Hedef dizin                                     |
| `--vendor`              | vendor dizinlerini dahil et                     |
| `--no-vendor`           | vendor dizinlerini hariç tut (varsayılan)       |
| `--node`                | node_modules dizinlerini dahil et               |
| `--no-node`             | node_modules dizinlerini hariç tut (varsayılan) |
| `--git`                 | .git dizinlerini dahil et                       |
| `--no-git`              | .git dizinlerini hariç tut (varsayılan)         |
| `--rename <desen:yeni>` | Regex ile projeleri yeniden adlandır            |
| `--dry-run`             | İşlemleri simüle et, gerçekte değişiklik yapma  |
| `--force`               | Hedef dizin varsa üzerine yaz                   |
| `--verbose`             | Ayrıntılı çıktı göster                          |

## Örnekler

### Bir projeyi başka bir dizine kopyalama

```bash
./project_copymove.sh --copy --target /path/to/target proje1
```

### Birden fazla projeyi taşıma

```bash
./project_copymove.sh --move --target ../yeni-konum proje1 proje2 proje3
```

### Tüm "api" ile başlayan projeleri vendor dizinleriyle birlikte kopyalama

```bash
./project_copymove.sh --source "^api" --target /backup/apis --vendor
```

### Projeleri yeniden adlandırarak kopyalama

```bash
./project_copymove.sh --target ../yeni-projeler --rename "proje-(.+):yeni-\1" proje-a proje-b
```

### İşlemleri simüle etme (dry run)

```bash
./project_copymove.sh --target /path/to/target --dry-run --verbose proje1
```

## Teknik Detaylar

### İşlem Akışı

1. Komut satırı parametreleri işlenir
2. Kaynak ve hedef dizinler kontrol edilir
3. İşlenecek projeler belirlenir
4. Her proje için:
    - Hedef proje adı belirlenir (yeniden adlandırma varsa uygulanır)
    - Hedefteki mevcut dizinler kontrol edilir
    - rsync veya cp/mv komutuyla dosyalar kopyalanır/taşınır
5. İşlem özeti görüntülenir

### Kopyalama/Taşıma Stratejileri

-   **Rsync Kullanımı**: Varsa, rsync komutu kullanılarak verimli bir şekilde kopyalama yapılır
-   **CP/MV Fallback**: rsync yoksa, standart cp veya mv komutları kullanılır
-   **Hariç Tutma**: vendor, node_modules ve .git gibi büyük dizinler varsayılan olarak hariç tutulur
-   **Yeniden Adlandırma**: Regex deseni kullanılarak projelerin adları değiştirilebilir

### Performans Faktörleri

-   Büyük projelerde rsync kullanımı önemli ölçüde performans sağlar
-   vendor ve node_modules dizinlerinin hariç tutulması işlemi hızlandırır
-   --verbose kullanımı, büyük projelerde biraz yavaşlamaya neden olabilir

## Sorun Giderme

### "Hedef dizin oluşturulamıyor" Hatası

Çözüm:

-   Hedef dizinin yazma izinlerini kontrol edin
-   Dizin yolunun geçerli olduğundan emin olun
-   --force seçeneğini kullanmayı deneyin

### "Belirtilen proje bulunamıyor" Hatası

Çözüm:

-   Proje adını doğru yazdığınızdan emin olun
-   Kaynak dizinde projenin var olduğunu doğrulayın
-   --source seçeneğiyle regex desenini kontrol edin

### "rsync komutu bulunamadı" Uyarısı

Çözüm:

-   rsync'i yükleyin: `apt-get install rsync` veya `brew install rsync`
-   rsync olmadan işleme devam edilecektir, ama performans düşebilir

## Güvenlik Hususları

-   `--force` seçeneği, varolan dizinlerin üzerine yazar, dikkatli kullanın
-   Hassas projeleri taşırken `--dry-run` ile önce simüle edin
-   Yeterli disk alanı olduğunu kontrol edin
-   Taşıma işleminden önce mutlaka yedek alın

---

**Son Güncelleme:** Şubat 2024

**İlgili Komutlar:**

-   [Proje Yedekleme](PROJECT_BACKUP.md)
-   [Proje Oluşturma](PROJECT_CREATE.md)
-   [Proje Bakımı](PROJECT_MAINTENANCE.md)
