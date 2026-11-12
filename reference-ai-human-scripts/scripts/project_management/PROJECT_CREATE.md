# PROJECT CREATE (Proje Oluşturma) Script

**Dosya Adı:** `project_create.sh`

## Amaç

`project_create.sh` scripti, Neo projesi içinde farklı türlerde yeni alt projeler oluşturmak için kullanılır. Önceden tanımlanmış şablonları kullanarak, standart proje yapılarını hızlıca oluşturabilir, git reposunu başlatabilir ve bağımlılıkları otomatik olarak kurabilir. Bu script ile proje başlangıç sürecini otomatize ederek zaman kazanabilir ve tüm projelerinizde tutarlı bir yapı sağlayabilirsiniz.

## Kullanım

```bash
./project_create.sh -n <proje-adı> [seçenekler]
```

### Zorunlu Parametreler

-   `-n, --name <isim>`: Yeni oluşturulacak projenin adı (zorunlu)

### Seçenekler

| Seçenek                        | Açıklama                                    |
| ------------------------------ | ------------------------------------------- |
| `-t, --type <tür>`             | Proje türü/şablonu (varsayılan: `empty`)    |
| `-d, --description <açıklama>` | Proje açıklaması                            |
| `-g, --git`                    | Git reposu başlat                           |
| `-i, --install`                | Bağımlılıkları otomatik kur (composer, npm) |
| `-r, --require <paket>`        | Ek bağımlılıklar (composer için)            |
| `-v, --verbose`                | Ayrıntılı çıktı                             |
| `-h, --help`                   | Yardım mesajını göster                      |

## Desteklenen Proje Türleri

Script, aşağıdaki proje türlerini destekler:

1. **empty** (Varsayılan): Temel klasör yapısı ve README dosyası içeren boş proje
2. **laravel**: Laravel framework kullanılan PHP projesi
3. **vue**: Vue.js kullanılan frontend projesi

## Örnekler

### Temel Bir Proje Oluşturma

```bash
./project_create.sh -n myproject
```

### Laravel Projesi Oluşturma ve Git Reposu Başlatma

```bash
./project_create.sh -n ecommerce -t laravel -g -d "E-ticaret sitesi projesi"
```

### Vue Projesi Oluşturma ve Bağımlılıkları Kurma

```bash
./project_create.sh -n dashboard -t vue -g -i -d "Yönetim paneli"
```

### Ek Paketlerle Birlikte Laravel Projesi Oluşturma

```bash
./project_create.sh -n blog -t laravel -g -i -r "spatie/laravel-permission spatie/laravel-medialibrary"
```

## İşleyiş Detayları

Script çalıştırıldığında şu adımları gerçekleştirir:

1. **Şablonları Kontrol Et**:

    - `templates/` dizini altında şablonlar yoksa, temel şablonları oluşturur
    - Kullanıcıya özel şablonlar ekleyebileceğini belirtir

2. **Proje Bilgilerini Doğrulama**:

    - Proje adının geçerliliğini kontrol eder
    - Seçilen şablonun mevcut olduğunu doğrular
    - Proje adının daha önce kullanılmadığını kontrol eder

3. **Proje Klasör Yapısı Oluşturma**:

    - Belirtilen şablondan dosyaları kopyalar
    - Proje türüne göre özel dosya ve klasörleri oluşturur

4. **Proje Türüne Özel İşlemler**:

    - **Laravel** için: composer.json, klasör yapısı ve temel dosyalar
    - **Vue** için: package.json, vite yapılandırması, giriş nokta dosyaları
    - **Empty** için: README ve temel klasörler

5. **Git Reposu Başlatma** (istenirse):

    - Standart bir .gitignore dosyası oluşturur
    - Git reposunu başlatır ve ilk commiti yapar

6. **Bağımlılıkları Kurma** (istenirse):

    - Composer ile PHP bağımlılıklarını kurar
    - NPM ile JavaScript bağımlılıklarını kurar
    - Ek belirtilen paketleri yükler

7. **Meta Bilgileri Ekleme**:

    - Proje hakkında bilgileri içeren .project-info dosyası oluşturur
    - Oluşturma tarihi, kullanıcı ve host bilgilerini kaydeder

8. **Sonraki Adımlar**:
    - Projeyi kullanmaya başlamak için öneriler sunar

## Oluşturulan Dosya Yapıları

### Empty (Boş) Proje

```
myproject/
├── README.md
├── .project-info
├── src/
└── docs/
```

### Laravel Projesi

```
laravel-project/
├── README.md
├── .project-info
├── composer.json
├── config/
│   └── app.php
├── database/
│   └── migrations/
├── resources/
│   └── views/
├── routes/
│   └── web.php
└── src/
```

### Vue Projesi

```
vue-project/
├── README.md
├── .project-info
├── index.html
├── package.json
├── vite.config.js
├── public/
└── src/
    ├── App.vue
    ├── main.js
    ├── assets/
    └── components/
```

## Özelleştirme

### Kendi Şablonlarınızı Oluşturma

1. `templates/` dizini altında kendi şablon klasörünüzü oluşturun:

```bash
mkdir -p templates/custom-template
```

2. Şablon dosyalarını yerleştirin:

```bash
cp -r proje-model/* templates/custom-template/
```

3. Şablonu kullanarak yeni bir proje oluşturun:

```bash
./project_create.sh -n yeniproje -t custom-template
```

### Şablonlarda Değişkenler

Script, şablon dosyaları içindeki şu özel değişkenleri proje bilgileriyle değiştirir:

-   `$PROJECT_NAME`: Proje adı
-   `$DESCRIPTION`: Proje açıklaması

## Sorun Giderme

### Yaygın Hatalar

1. **"Hata: 'X' şablonu bulunamadı!"**

    **Çözüm**: Şablon adının doğru olduğundan emin olun. `templates/` dizini altında şablon klasörünün var olduğunu kontrol edin.

2. **"Hata: 'Y' adında bir proje klasörü zaten var!"**

    **Çözüm**: Farklı bir proje adı seçin veya mevcut projeyi silin/taşıyın.

3. **Bağımlılık kurulumu başarısız**

    **Çözüm**: `composer` veya `npm` komutlarının sisteminizde kurulu olduğundan emin olun. `--verbose` seçeneği ile daha fazla bilgi alın.

4. **Git repo başlatma hatası**

    **Çözüm**: Git'in sisteminizde kurulu olduğundan emin olun ve gerekirse manuel olarak repo başlatın.

## En İyi Uygulama Önerileri

1. **Proje Adı Seçimi**:

    - Kısa ve anlamlı isimler kullanın
    - Özel karakterlerden ve boşluklardan kaçının
    - Küçük harfler ve tireler `-` tercih edin

2. **Şablon Kullanımı**:

    - Sık kullandığınız proje yapıları için kendi şablonlarınızı oluşturun
    - Core şablonları güncel tutun

3. **Git ve Bağımlılıklar**:

    - `-g` ve `-i` seçeneklerini kullanarak otomatik kurulum yapın
    - `.gitignore` dosyasını projenin ihtiyaçlarına göre özelleştirin

4. **Dokümantasyon**:
    - Her proje için anlamlı bir açıklama belirtin (`-d` seçeneği ile)
    - README.md dosyalarını proje başlangıcında düzenleyin

## İlgili Komutlar

-   [group_projects.sh](GROUP_PROJECTS.md): Projeleri gruplama ve listeleme
-   [search_projects.sh](SEARCH_PROJECTS.md): Projeleri arama ve filtreleme
-   [project_stats.sh](PROJECT_STATS.md): Proje istatistiklerini toplama
-   [batch_update.sh](BATCH_UPDATE.md): Projelerde toplu dosya güncelleme
-   [project_maintenance.sh](PROJECT_MAINTENANCE.md): Projelerde bakım ve temizlik işlemleri

---

Bu dokümantasyon, Neo projesi yönetimi için hazırlanmıştır.

_Son Güncelleme: [Tarih]_
