# PROJECT MAINTENANCE (Proje Bakım) Script

**Dosya Adı:** `project_maintenance.sh`

## Amaç

Bu script, Neo projesindeki alt projelerde çeşitli bakım ve temizlik işlemleri gerçekleştirir. Vendor dizinleri, node_modules, geçici dosyalar, log dosyaları gibi gereksiz veya geliştirme esnasında oluşan dosyaları temizler ve proje dosyalarının izinlerini düzenler. Depolama alanından tasarruf sağlamak, geliştirme ortamını optimize etmek ve projelerin bakımını otomatize etmek için kullanılır.

## Kullanım

```bash
./project_maintenance.sh [seçenekler]
```

### Seçenekler

| Seçenek               | Açıklama                                               |
| --------------------- | ------------------------------------------------------ |
| `-h, --help`          | Yardım mesajını gösterir                               |
| `-v, --vendor`        | vendor/ dizinlerini temizler                           |
| `-n, --node`          | node_modules/ dizinlerini temizler                     |
| `-t, --temp`          | Geçici dosyaları temizler (_.tmp, _.bak, \*.log, vb.)  |
| `-d, --ds-store`      | .DS_Store dosyalarını kaldırır (macOS)                 |
| `-l, --logs`          | Log dosyalarını temizler                               |
| `-p, --permissions`   | Dosya izinlerini düzeltir (chmod)                      |
| `-a, --all`           | Tüm temizleme işlemlerini uygular                      |
| `--regex "<pattern>"` | Sadece belirtilen regex ile eşleşen projelerde çalışır |
| `--dry-run`           | Değişiklikleri uygulamadan simüle eder                 |
| `--verbose`           | Ayrıntılı çıktı verir                                  |

## Örnekler

### Tüm Temizlik İşlemlerini Uygulama

```bash
./project_maintenance.sh --all
```

### Sadece Vendor ve Node Modülleri Temizleme

```bash
./project_maintenance.sh --vendor --node
```

### Kuru Çalıştırma (Dry Run) ile Önizleme

```bash
./project_maintenance.sh --all --dry-run
```

### Belirli Projelerde Çalıştırma

```bash
./project_maintenance.sh --all --regex "web.*"
```

### Ayrıntılı Çıktı ile Çalıştırma

```bash
./project_maintenance.sh --all --verbose
```

## Çıktı Bölümleri

Script çalıştığında aşağıdaki bilgileri gösterir:

1. **Başlangıç Özeti**:

    - Seçilen işlemler listesi
    - İşlenecek toplam proje sayısı
    - Kuru çalıştırma modu (etkinse)
    - Regex filtresi (belirtilmişse)

2. **İşlem Detayları**:

    - Her projenin işlenmesi sırasında ilerleme göstergesi
    - Verbose mod etkinse, temizlenen her dosya/dizin için detaylı bilgi

3. **Sonuç İstatistikleri**:
    - Toplam işlenen proje sayısı
    - Geçen süre
    - Kurtarılan disk alanı (MB)
    - Temizlenen öğelerin sayısı kategoriye göre:
        - Vendor dizinleri
        - Node modülleri
        - Geçici dosyalar
        - .DS_Store dosyaları
        - Log dosyaları
        - İzinleri düzeltilen projeler

## Teknik Detaylar

-   Script, sadece `projects/` dizini altındaki projeleri işler.
-   Geçici dosyalar için arama şablonları: _.tmp, _.bak, _.swp, _.cache, .phpunit.result.cache
-   Log dosyaları için kontrol edilen dizinler: storage/logs/, var/log/, log/ ve \*.log uzantılı dosyalar
-   Dosya izinleri düzeltme işlemi:
    -   Dizinler için: 755 (rwxr-xr-x)
    -   Dosyalar için: 644 (rw-r--r--)
    -   \*.sh dosyaları için: +x (çalıştırılabilir özelliği eklenir)
-   Kuru çalıştırma modu (`--dry-run`) etkinken gerçek değişiklik yapılmaz.

## Performans Optimizasyonu

Bu script, özellikle büyük projelerde ve büyük miktarda disk alanını kurtarmak için tasarlanmıştır:

-   **Vendor Dizinleri**: Genellikle projelerde en çok yer kaplayan dizinlerdir.
-   **Node Modülleri**: Çok sayıda dosya içerdiğinden hem disk alanını hem de dosya sistemi performansını etkiler.
-   **Log Dosyaları**: Zaman içinde büyüyebilir ve gereksiz disk alanı kullanımına neden olabilir.

## En İyi Uygulama Önerileri

1. **Düzenli Kullanım**: Projenizi düzenli olarak (örneğin haftada bir) temizlemek, disk alanını optimize eder.

2. **Büyük Değişikliklerden Önce**:

    ```bash
    ./project_maintenance.sh --all --dry-run
    ```

    komutu ile nelerin silineceğini önceden kontrol edin.

3. **Toplu Proje Bakımı**:
    ```bash
    ./project_maintenance.sh --all --verbose
    ```
    komutu ile tüm projelerde kapsamlı bir temizlik yaparak disk alanından tasarruf edin.

## Platform Uyumluluğu

-   **Linux**: Tam desteklenir
-   **macOS**: Tam desteklenir
-   **Windows**: WSL (Windows Subsystem for Linux) veya Git Bash üzerinde çalıştırılabilir

## Sorun Giderme

### Yaygın Hatalar

1. **"Hata: 'projects' klasörü bulunamadı!"**

    **Çözüm**: Script'i Neo projesinin kök dizininden çalıştırın.

2. **Bazı dosyaların silinememesi**

    **Çözüm**: İzin sorunlarını kontrol edin, gerekirse `sudo` ile çalıştırın (dikkatli olun).

3. **İzin hatası alınması**

    **Çözüm**: `--permissions` seçeneğiyle dosya izinlerini düzeltin veya manuel olarak:

    ```bash
    chmod -R u+w projects/
    ```

4. **Performans sorunları**

    **Çözüm**: Belirli projeleri hedeflemek için `--regex` parametresini kullanın veya sadece gerekli temizlik seçeneklerini belirtin.

## İlgili Komutlar

-   [search_projects.sh](SEARCH_PROJECTS.md): Projeleri arama ve filtreleme
-   [group_projects.sh](GROUP_PROJECTS.md): Projeleri gruplama ve listeleme
-   [batch_update.sh](BATCH_UPDATE.md): Projelerde toplu dosya güncelleme

---

Bu dokümantasyon, Neo projesi yönetimi için hazırlanmıştır.

_Son Güncelleme: [Tarih]_
