# PROJECT VERSIONS (Versiyon Kontrol) Script

**Dosya Adı:** `project_versions.sh`

## Amaç

`project_versions.sh` scripti, Neo projesi içindeki tüm alt projelerin Git durumunu kontrol etmek ve detaylı bir versiyon raporu oluşturmak için kullanılır. Bu script ile:

-   Değiştirilmiş dosyaları görüntüleyebilir
-   Push edilmemiş commitleri tespit edebilir
-   Stage edilmiş değişiklikleri listeleyebilir
-   Takip edilmeyen dosyaları bulabilir
-   Dal (branch) bilgilerini görüntüleyebilir
-   Son commitleri inceleyebilir
-   Projelerin Git durumlarını toplu olarak raporlayabilirsiniz

Bu script sayesinde tüm projelerinizin versiyon kontrol durumunu tek bir komutla takip edebilir ve yönetebilirsiniz.

## Kullanım

```bash
./project_versions.sh [seçenekler]
```

## Seçenekler

| Seçenek                | Açıklama                                          |
| ---------------------- | ------------------------------------------------- |
| `-a, --all`            | Tüm git bilgilerini göster                        |
| `-m, --modified`       | Değiştirilmiş dosyaları göster                    |
| `-s, --staged`         | Stage edilmiş değişiklikleri göster               |
| `-u, --unpushed`       | Push edilmemiş commitleri göster                  |
| `-n, --untracked`      | Takip edilmeyen dosyaları göster                  |
| `-b, --branches`       | Dal (branch) bilgilerini göster                   |
| `-r, --recent [n]`     | Son n adet commiti göster (varsayılan: 5)         |
| `--sort-name`          | İsme göre sırala (varsayılan)                     |
| `--sort-date`          | En son commit tarihine göre sırala                |
| `--sort-changes`       | Değişiklik sayısına göre sırala                   |
| `--regex "<pattern>"`  | Belirtilen regex ile eşleşen projeleri kontrol et |
| `-o, --output <dosya>` | Sonuçları belirtilen dosyaya yaz                  |
| `--format <format>`    | Çıktı formatı: console, markdown, csv             |
| `-h, --help`           | Yardım mesajını göster                            |

## Örnekler

### Tüm Projelerin Git Durumunu Görüntüleme

```bash
./project_versions.sh --all
```

### Değişiklik İçeren ve Push Edilmemiş Commitleri Olan Projeleri Görüntüleme

```bash
./project_versions.sh --modified --unpushed
```

### Son 10 Commiti Görüntüleme

```bash
./project_versions.sh --recent 10
```

### Regex ile Filtreli Raporlama

```bash
./project_versions.sh --all --regex "web.*"
```

### Markdown Formatında Rapor Oluşturma

```bash
./project_versions.sh --all --format markdown -o git_report.md
```

### Projeleri Son Commit Tarihine Göre Sıralama

```bash
./project_versions.sh --all --sort-date
```

## Çıktı Bölümleri

Script çalıştırıldığında aşağıdaki bilgileri içeren bir rapor görüntülenir:

1. **Banner ve Başlık**:

    - Script adı ve amacını belirten başlık

2. **Tarama Bilgileri**:

    - Taranan dizin
    - Taranan toplam proje sayısı
    - Kullanılan filtreleme kriterleri

3. **İlerleme Göstergesi**:

    - Tarama sırasında işlenen projelerin durumu

4. **Proje Detayları**:

    - Her bir projenin Git durumu
    - Aktif dal
    - Son commit bilgisi
    - Son commit tarihi
    - Değişiklik sayıları
    - Seçilen seçeneklere göre detaylı bilgiler:
        - Değiştirilmiş dosyalar
        - Stage edilmiş dosyalar
        - Takip edilmeyen dosyalar
        - Dal bilgileri
        - Son commitler
        - Push edilmemiş commitler

5. **Özet Bölümü**:
    - Toplam proje sayısı
    - Git repo içeren proje sayısı
    - Değişiklik içeren proje sayısı
    - Temiz proje sayısı
    - Push edilmemiş commit içeren proje sayısı

## Çıktı Formatları

Script, çıktıyı farklı formatlarda sunabilir:

1. **Console** (Varsayılan): Terminalde okunabilir, renklendirilmiş çıktı
2. **Markdown**: Dokümantasyon veya GitHub'da görüntülemek için Markdown formatı
3. **CSV**: Veri analizi veya diğer araçlara aktarmak için CSV formatı

## Teknik Detaylar

### Git Durumu Kontrolü

Script, her proje için aşağıdaki Git komutlarını kullanır:

-   `git status -s`: Değişiklikleri kontrol eder
-   `git branch --show-current`: Mevcut dalı belirler
-   `git log`: Commit bilgilerini alır
-   `git diff`: Değişiklikleri karşılaştırır
-   `git ls-files`: Takip edilmeyen dosyaları bulur
-   `git log @{u}..`: Push edilmemiş commitleri tespit eder

### Sıralama Seçenekleri

Script, projeleri üç farklı kritere göre sıralayabilir:

1. **İsim**: Alfabetik olarak proje adına göre sıralama (varsayılan)
2. **Tarih**: En son commit tarihine göre sıralama (en yeni en üstte)
3. **Değişiklik**: Değişiklik sayısına göre sıralama (en çok değişiklik en üstte)

### Raporlama

Script, raporları doğrudan terminal ekranına yazdırabilir veya belirtilen bir dosyaya kaydedebilir. Dosyaya yazılan raporlar, seçilen formata göre düzenlenir ve renklendirilmez.

## En İyi Uygulama Önerileri

1. **Düzenli Kontrol**:

    - Projelerinizin durumunu düzenli olarak kontrol edin
    - Önemli değişikliklerden önce ve sonra rapor oluşturun

2. **Filtreleme Kullanımı**:

    - Çok sayıda projeniz varsa, `--regex` seçeneği ile ilgili projeleri filtreleyebilirsiniz
    - İsim, tarih veya değişiklik sayısına göre sıralama yaparak önemli projeleri öne çıkarabilirsiniz

3. **Raporlama**:

    - Önemli durumları belgelemek için `--format markdown -o rapor.md` ile Markdown raporlar oluşturun
    - CSV çıktısı ile verileri diğer araçlarda kullanabilirsiniz

4. **CI/CD Entegrasyonu**:
    - Bu scripti CI/CD süreçlerinize dahil ederek proje durumlarını otomatik olarak raporlayabilirsiniz

## Sorun Giderme

### Yaygın Hatalar

1. **"Hata: 'projects' klasörü bulunamadı!"**

    **Çözüm**: Scripti Neo projesinin kök dizininden çalıştırdığınızdan emin olun.

2. **Uzak dal bilgisi hataları**

    **Çözüm**: Remote bilgilerinin güncel olduğundan emin olmak için `git fetch --all` komutunu çalıştırın.

3. **Push edilmemiş commit tespiti sorunları**

    **Çözüm**: Remote branch konfigürasyonunuzu kontrol edin. Upstream branch ayarlanmamış olabilir. `git branch --set-upstream-to=origin/main main` gibi bir komutla ayarlayın.

4. **Performans sorunları (çok sayıda proje varsa)**

    **Çözüm**: `--regex` ile sadece belirli projeleri tarayın veya sadece ihtiyacınız olan Git bilgilerini içeren seçenekleri kullanın.

## Platform Uyumluluğu

-   **Linux**: Tam desteklenir
-   **macOS**: Tam desteklenir
-   **Windows**: Git Bash veya WSL (Windows Subsystem for Linux) ile desteklenir

## İlgili Komutlar

-   [group_projects.sh](GROUP_PROJECTS.md): Projeleri gruplama ve listeleme
-   [search_projects.sh](SEARCH_PROJECTS.md): Projeleri arama ve filtreleme
-   [project_stats.sh](PROJECT_STATS.md): Proje istatistiklerini toplama
-   [batch_update.sh](BATCH_UPDATE.md): Projelerde toplu dosya güncelleme
-   [project_maintenance.sh](PROJECT_MAINTENANCE.md): Projelerde bakım ve temizlik işlemleri
-   [project_create.sh](PROJECT_CREATE.md): Yeni proje oluşturma

---

Bu dokümantasyon, Neo projesi yönetimi için hazırlanmıştır.

_Son Güncelleme: Şubat 2024_
