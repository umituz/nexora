# Proje İstatistikleri Aracı

Bu belge, `project_stats.sh` adlı bash scriptinin kullanımını ve amacını açıklar.

## Amaç

`project_stats.sh` scripti, Neo projesi içindeki alt projelerin detaylı istatistiklerini toplar ve görsel olarak raporlar. Bu script sayesinde:

-   Projelerin boyut ve dosya sayısı gibi teknik özelliklerini inceleyebilirsiniz
-   En büyük, en kapsamlı veya en güncel projeleri belirleyebilirsiniz
-   Projelerinizin kullandığı teknolojilere (PHP, JS, Vue vb.) dair istatistikler elde edebilirsiniz
-   Projeleri farklı kriterlere göre sıralayabilirsiniz

## Kullanım

Scripti çalıştırmak için aşağıdaki komut yapısını kullanabilirsiniz:

```bash
./project_stats.sh [seçenekler]
```

### Seçenekler

Script, aşağıdaki seçenekleri destekler:

-   `--sort-size`: Projeleri boyuta göre sıralar (büyükten küçüğe)
-   `--sort-files`: Projeleri dosya sayısına göre sıralar (büyükten küçüğe)
-   `--sort-date`: Projeleri son değişiklik tarihine göre sıralar (yeniden eskiye)
-   `--detailed`: Daha detaylı istatistikler gösterir (dosya türleri vb.)
-   `--help`: Yardım mesajını gösterir

### Örnekler

1. Temel istatistikleri alfabetik sırayla göster:

```bash
./project_stats.sh
```

2. Projeleri boyuta göre büyükten küçüğe sırala:

```bash
./project_stats.sh --sort-size
```

3. En son değiştirilen projeleri göster:

```bash
./project_stats.sh --sort-date
```

4. Dosya sayısına göre sıralanmış detaylı istatistikleri göster:

```bash
./project_stats.sh --sort-files --detailed
```

## Çıktı Bölümleri

Script çıktısı, aşağıdaki bölümlerden oluşur:

### 1. Ana İstatistik Tablosu

Temel modda:

```
Proje Adı                      | Boyut (KB) | Dosyalar | Son Değişiklik
--------------------------------|------------|----------|----------------
project1                        | 1.2 MB     | 128      | 2023-06-01 14:30
project2                        | 450 KB     | 42       | 2023-05-28 10:15
...
```

Detaylı modda (`--detailed` seçeneği ile):

```
Proje Adı                      | Boyut (KB) | Dosyalar | Son Değişiklik | PHP | JS | Vue | CSS | Resim
--------------------------------|------------|----------|----------------|-----|----|----|-----|-------
project1                        | 1.2 MB     | 128      | 2023-06-01 14:30| 45  | 32 | 12 | 18  | 21
project2                        | 450 KB     | 42       | 2023-05-28 10:15| 20  | 10 | 0  | 8   | 4
...
```

### 2. Özet Bilgiler

Temel bilgileri içerir:

```
Toplam Proje Sayısı: 420
Toplam Boyut: 2.34 GB
Toplam Dosya Sayısı: 45872
En Büyük Proje: digitalarchive (124.5 MB)
En Fazla Dosyaya Sahip Proje: learngoal (1245 dosya)
En Son Değiştirilen Proje: vision (2023-06-03 09:42)
```

### 3. Detaylı Dosya Türü İstatistikleri

Sadece `--detailed` seçeneği ile gösterilir:

```
Dosya Türü İstatistikleri:
  * PHP Dosyaları: 12458
  * JavaScript Dosyaları: 9824
  * Vue Dosyaları: 3541
  * CSS/SCSS Dosyaları: 4210
  * Resim Dosyaları: 7845
```

## Teknik Detaylar

Script, projeleri analiz ederken aşağıdaki adımları izler:

1. Proje dizinlerini dolaşır ve her biri için:

    - Toplam boyut hesaplanır (`du` komutu kullanılarak)
    - Dosya sayısı belirlenir
    - Son değişiklik tarihi bulunur
    - İstenirse dosya türlerine göre sayılar hesaplanır

2. Elde edilen veriler, belirtilen kritere göre sıralanır:

    - İsim (Alfabetik) - varsayılan
    - Boyut (Büyükten küçüğe)
    - Dosya sayısı (Büyükten küçüğe)
    - Son değişiklik tarihi (Yeniden eskiye)

3. Sonuçlar, tablo formatında ve özet bilgilerle gösterilir

## Özelleştirme İpuçları

Script kodunu düzenleyerek aşağıdaki değişiklikleri yapabilirsiniz:

1. Detaylı mod için incelenecek dosya türlerini değiştirme:

    ```bash
    # Bu bloğa yeni dosya türü ekleyebilirsiniz:
    php_count=$(find "$project_dir" -name "*.php" | wc -l | tr -d ' ')
    # Örneğin: Python dosyaları için:
    # py_count=$(find "$project_dir" -name "*.py" | wc -l | tr -d ' ')
    ```

2. Sıralama kriterleri ekleme:

    ```bash
    # case bloğuna yeni sıralama kriteri ekleyin:
    ```

3. İlerleme çubuğu genişliğini değiştirme:
    ```bash
    # Bu değeri değiştirerek ilerleme çubuğunun genişliğini ayarlayabilirsiniz
    PROGRESS_WIDTH=40
    ```

## Platform Uyumluluğu

Script, hem macOS hem de Linux sistemlerinde çalışacak şekilde tasarlanmıştır. Windows kullanıcıları, WSL (Windows Subsystem for Linux) üzerinde çalıştırabilir.

## Sorun Giderme

1. **"projects klasörü bulunamadı!" hatası alıyorsanız:**

    - Scripti Neo projesinin kök dizininden çalıştırdığınızdan emin olun
    - `projects` klasörünün mevcut olup olmadığını kontrol edin

2. **"date: geçersiz tarih" hatası alıyorsanız:**

    - Bu hata Linux ve macOS arasındaki `date` komutu farklılıklarından kaynaklanabilir
    - İlgili satırları düzenleyerek sisteminize uygun date formatı kullanın

3. **İşlem çok uzun sürüyorsa:**
    - Büyük proje yapıları için normal bir durumdur
    - Belirli bir proje alt kümesine odaklanmak için scripti değiştirebilirsiniz
