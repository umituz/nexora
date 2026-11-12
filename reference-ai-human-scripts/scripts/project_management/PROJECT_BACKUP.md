# Proje Yedekleme Aracı (project_backup.sh)

`project_backup.sh`, Neo projelerinin güvenli ve verimli bir şekilde yedeklenmesini sağlayan bir araçtır. Bu script, projeleri sıkıştırılmış arşivler halinde veya ayrı dizinler olarak yedeklemenize olanak tanır.

## Amaç

Bu araç, aşağıdaki amaçları gerçekleştirmek için tasarlanmıştır:

-   Projelerin güvenli bir şekilde yedeklenmesi
-   Artımlı yedeklemeler oluşturma
-   Seçili projeleri veya belirli bir desene uyan projeleri yedekleme
-   Yedekleri sıkıştırarak depolama alanından tasarruf etme
-   Yedekleri farklı formatlarda (zip, tar.gz, vb.) oluşturma

## Kullanım

```bash
./project_backup.sh [seçenekler] [proje_adı1 proje_adı2 ...]
```

### Seçenekler

| Seçenek                 | Açıklama                                               |
| ----------------------- | ------------------------------------------------------ |
| `-h, --help`            | Yardım mesajını gösterir                               |
| `-d, --dest <dizin>`    | Yedeklerin kaydedileceği dizin (varsayılan: ./backups) |
| `-p, --prefix <önek>`   | Yedek dosya adı öneki (varsayılan: neo-backup)         |
| `-f, --format <format>` | Yedek formatı (zip, tar, tar.gz, tar.bz2, tar.xz, dir) |
| `-s, --source <desen>`  | Yedeklenecek projeleri regex ile belirle               |
| `-a, --all`             | Tüm projeleri yedekle                                  |
| `-g, --include-git`     | Git dizinlerini de yedekle                             |
| `-i, --incremental`     | Artımlı yedek oluştur (sadece değişen dosyaları)       |
| `-c, --separate`        | Her projeyi ayrı arşiv olarak yedekle                  |
| `--dry-run`             | Gerçekte yedek almadan simüle et                       |
| `-v, --verbose`         | Ayrıntılı çıktı göster                                 |

## Örnekler

### Tüm projeleri ZIP formatında yedekleme

```bash
./project_backup.sh --all --format zip
```

### Belirli projeleri ayrı arşivler olarak yedekleme

```bash
./project_backup.sh --separate --format tar.gz proje1 proje2
```

### İsmi "api" ile başlayan projeleri yedekleme

```bash
./project_backup.sh --source "^api" --format tar.xz
```

### Artımlı yedek oluşturma

```bash
./project_backup.sh --all --incremental --dest /mnt/backup
```

## Teknik Detaylar

### Yedekleme Süreci

1. Komut satırı parametreleri işlenir
2. Yedeklenecek projeler belirlenir
3. Hedef dizin oluşturulur veya kontrol edilir
4. Projeler için geçici dizin oluşturulur
5. Her proje belirlenen kurallara göre yedeklenir
6. Yedekler belirlenen formatta arşivlenir
7. Geçici dosyalar temizlenir

### Yedekleme Formatları

-   **zip**: En yaygın arşiv formatı, çoğu platformda desteklenir
-   **tar**: UNIX/Linux sistemlerinde yaygın kullanılan sıkıştırmasız arşiv formatı
-   **tar.gz**: Orta düzeyde sıkıştırma sağlayan GNU gzip ile sıkıştırılmış tar arşivi
-   **tar.bz2**: Daha yüksek sıkıştırma sağlayan bzip2 ile sıkıştırılmış tar arşivi
-   **tar.xz**: En yüksek sıkıştırma oranına sahip xz ile sıkıştırılmış tar arşivi
-   **dir**: Sıkıştırma olmadan, dizin olarak yedekleme

### Performans Faktörleri

-   Sıkıştırma seviyesi arttıkça yedekleme süresi uzar ama dosya boyutu küçülür
-   ZIP formatı daha hızlı ama daha az sıkıştırma sağlar
-   XZ formatı daha yavaş ama daha fazla sıkıştırma sağlar
-   Artımlı yedekleme, sadece değişen dosyaları içerdiği için daha hızlıdır

## Sorun Giderme

### Yedekleme Başarısız Oluyor

Aşağıdaki durumları kontrol edin:

-   Hedef dizinin yazma izinleri var mı?
-   Disk alanı yeterli mi?
-   Gerekli komutlar (zip, tar, vb.) yüklü mü?

### Yedekler Çok Büyük

Çözüm önerileri:

-   `vendor` ve `node_modules` gibi dizinlerin dışarıda bırakıldığından emin olun
-   Daha yüksek sıkıştırma oranına sahip formatlar kullanın (tar.xz gibi)
-   Artımlı yedekleme kullanmayı deneyin

### Yedekleme Çok Uzun Sürüyor

Çözüm önerileri:

-   Daha hızlı sıkıştırma formatları kullanın (zip veya tar.gz gibi)
-   Sadece gerekli projeleri yedekleyin
-   Büyük ve sık değişmeyen dosyaları hariç tutmayı düşünün

## Güvenlik Hususları

-   Yedekler, kritik verileri içerebilir ve güvenli bir şekilde saklanmalıdır
-   Düzenli olarak yedeklerin sağlamlığını test edin
-   Yedekleri farklı fiziksel konumlarda saklayın
-   Yedeğe alınan dosyalara uygun erişim izinleri ayarlayın

---

**Son Güncelleme:** Şubat 2024

**İlgili Komutlar:**

-   [Proje Kopyalama/Taşıma](PROJECT_COPYMOVE.md)
-   [Proje İstatistikleri](PROJECT_STATS.md)
-   [Proje Bakımı](PROJECT_MAINTENANCE.md)
