# BATCH UPDATE (Toplu Güncelleme) Script

**Dosya Adı:** `batch_update.sh`

## Amaç

Bu script, neo projesi içindeki tüm alt projelerde ortak bir dosyayı (örneğin .gitignore, composer.json gibi) otomatik olarak güncellemek için kullanılır. Tek bir kaynak dosyasını kullanarak birden fazla projeyi aynı anda güncelleyebilir, böylece standartlaştırma ve tutarlılık sağlar.

## Kullanım

```bash
./batch_update.sh <hedef-dosya-adı> <kaynak-dosya> [--dry-run] [--regex "<regex>"]
```

### Parametreler

-   `<hedef-dosya-adı>`: Projelerde güncellenecek dosyanın adı (örn: `.gitignore`, `composer.json`)
-   `<kaynak-dosya>`: Mevcut güncel içeriği içeren şablon dosya (örn: `templates/gitignore_template.txt`)

### Seçenekler

-   `--dry-run`: Değişiklikleri uygulamadan simüle eder. Gerçek değişiklik yapmaz.
-   `--regex "<regex>"`: Sadece belirtilen regex ile eşleşen proje dizinlerinde güncelleme yapar.

## Örnekler

### Temel Kullanım

Tüm projelerde `.gitignore` dosyasını güncelle:

```bash
./batch_update.sh .gitignore templates/gitignore_template.txt
```

### Kuru Çalıştırma (Değişiklikleri Uygulamadan Önizleme)

Gerçek değişiklik yapmadan kontrol et:

```bash
./batch_update.sh .gitignore templates/gitignore_template.txt --dry-run
```

### Belirli Projelerde Güncelleme

Sadece adı "home" ile başlayan projelerde güncelleme yap:

```bash
./batch_update.sh composer.json templates/composer.json --regex "home.*"
```

## Çıktı Bölümleri

Script çalıştığında aşağıdaki bilgileri gösterir:

1. **Başlangıç Özeti**:

    - Hedef dosya adı
    - Kaynak dosya yolu
    - Ek seçenekler (kuru çalıştırma modu, regex filtresi)

2. **İlerleme Çubuğu**:

    - Proje işleme durumunu gösterir

3. **Sonuç İstatistikleri**:

    - Toplam incelenen proje sayısı
    - Güncellenen dosya sayısı
    - Yeni oluşturulan dosya sayısı
    - Değiştirilmeyen dosya sayısı
    - Hata oluşan dosya sayısı

4. **Detaylı Listeler**:
    - Güncellenen projeler listesi
    - Yeni dosya oluşturulan projeler listesi
    - Değişiklik yapılmayan projeler listesi
    - Hata oluşan projeler listesi

## Teknik Detaylar

-   Script, hedef dosyayı ve kaynak dosyayı karşılaştırır. Eğer içerikler farklıysa, güncelleme yapar.
-   Hedef dosya mevcut değilse, yeni bir dosya oluşturulur.
-   İşlem sırasında geçici dosyalar kullanılır (mktemp ile oluşturulur) ve işlem sonunda temizlenir.
-   Kuru çalıştırma modunda (`--dry-run`) gerçek değişiklik yapılmaz.

## Özelleştirme İpuçları

1. **Kaynak Şablonlar Hazırlama**:

    Projelerinizde yaygın olarak kullanılan dosyalar için standart şablonlar oluşturup `templates/` klasöründe saklayabilirsiniz:

    ```
    templates/
    ├── gitignore_template.txt
    ├── composer.json
    ├── readme_template.md
    └── license_template.txt
    ```

2. **Batch Update için Alias Tanımlama**:

    `.bashrc` veya `.zshrc` dosyanıza ekleyerek kolayca erişebilirsiniz:

    ```bash
    alias neo-update='cd /path/to/neo && ./batch_update.sh'
    ```

## Platform Uyumluluğu

-   **Linux**: Tam desteklenir
-   **macOS**: Tam desteklenir
-   **Windows**: WSL (Windows Subsystem for Linux) veya Git Bash üzerinde çalıştırılabilir

## Sorun Giderme

### Yaygın Hatalar

1. **"Hata: 'projects' klasörü bulunamadı!"**

    **Çözüm**: Script'i Neo projesinin kök dizininden çalıştırın.

2. **"Hata: Kaynak dosya bulunamadı!"**

    **Çözüm**: Kaynak dosya yolunun doğru olduğundan emin olun ve dosyanın var olduğunu kontrol edin.

3. **Güncelleme yaparken izin hatası**

    **Çözüm**: Hedef dosyanın yazma izinlerine sahip olduğunuzdan emin olun:

    ```bash
    chmod -R u+w projects/
    ```

## İlgili Komutlar

-   [search_projects.sh](SEARCH_PROJECTS.md): Projeleri arama ve filtreleme
-   [group_projects.sh](GROUP_PROJECTS.md): Projeleri gruplama ve listeleme
-   [project_stats.sh](PROJECT_STATS.md): Proje istatistiklerini toplama

---

Bu dokümantasyon, Neo projesi yönetimi için hazırlanmıştır.

_Son Güncelleme: [Tarih]_
