# Proje Arama Aracı

Bu belge, `search_projects.sh` adlı bash scriptinin kullanımını ve amacını açıklar.

## Amaç

`search_projects.sh` scripti, Neo projesi içindeki alt projelerde arama yapmak için tasarlanmıştır. İki temel arama modu sunar:

1. **Proje Adı Araması**: Belirtilen kelime veya ifadenin geçtiği proje adlarını bulur
2. **İçerik Araması**: Belirtilen kelime veya ifadenin projelerin dosya içeriklerinde geçtiği yerleri bulur

Bu araç sayesinde çok sayıda alt proje arasında hızlıca bilgi bulabilir ve ilgili projelere odaklanabilirsiniz.

## Kullanım

Scripti çalıştırmak için aşağıdaki komut yapısını kullanın:

```bash
./search_projects.sh <arama-terimi> [--name|--content]

### Parametreler

-   `<arama-terimi>`: Aranacak kelime veya ifade (zorunlu)
-   `--name`: Sadece proje adlarında ara (varsayılan)
-   `--content`: Proje dosyalarının içeriklerinde ara

### Örnekler

1. Proje adında "home" geçen projeleri bul:

```bash
./search_projects.sh home

veya

```bash
./search_projects.sh home --name

2. İçeriğinde "Laravel" geçen projeleri bul:

```bash
./search_projects.sh Laravel --content

## Çalışma Prensibi

### Proje Adı Araması

-   Script, `projects` klasöründeki tüm alt dizinleri kontrol eder
-   Adında aranan terimi içeren projeleri listeler
-   Eşleşen proje sayısını gösterir

### İçerik Araması

-   Script, her projenin içindeki dosyaları tarar
-   Sadece belirli dosya uzantılarını arar (php, js, vue, html, txt, md)
-   Aranan terimi içeren dosyaları buldukça ilgili projeleri listeler
-   İşlem sırasında ilerleme durumunu gösterir

## Çıktı Örnekleri

### Proje Adı Araması Örneği

============================================================
                 PROJE ARAMA ARACI
============================================================

"home" ifadesini proje adlarında arıyorum...

İşleniyor...

------------------------------------------------------------
 PROJE ADI ARAMA SONUÇLARI (8 eşleşme)
------------------------------------------------------------
  * homeacoustic
  * homeauto
  * homefitness
  * homeinternet
  * homeparty
  * homeproject
  * homeschool
  * homeshop

Arama tamamlandı.
Arama tarihi: Mon Jun 3 14:45:23 TRT 2023

### İçerik Araması Örneği

============================================================
                 PROJE ARAMA ARACI
============================================================

"Laravel" ifadesini proje içeriklerinde arıyorum...
Bu işlem, dosya sayısına bağlı olarak biraz zaman alabilir.

İşleniyor...

Proje 420/420: zerowaste

------------------------------------------------------------
 İÇERİK ARAMA SONUÇLARI (15 projede eşleşme)
------------------------------------------------------------
  * digitalarchive
  * digitallibrary
  * homeproject
  * knowledgebank
  * learngoal
  * levelup
  * onlinecourse
  * onlineshop
  * socialbridge
  * storego
  * supportix
  * timeoptimize
  * virtualevent
  * vision
  * worklife

Arama tamamlandı.
Arama tarihi: Mon Jun 3 14:50:17 TRT 2023

## Teknik Notlar

-   Script, `mktemp` komutuyla geçici dosyalar oluşturur ve işlem sonunda bunları temizler
-   İçerik aramasında, büyük boyutlu projelerde arama uzun sürebilir
-   Script varsayılan olarak sadece önemli dosya uzantılarında arama yapar

## Özelleştirme İpuçları

Script kodunu düzenleyerek aşağıdaki değişiklikleri yapabilirsiniz:

1. Aranacak dosya uzantılarını değiştirme:

    ```bash
    # Bu satırı düzenleyin:
    grep -r --include="*.php" --include="*.js" --include="*.vue" --include="*.html" --include="*.txt" --include="*.md"
    ```

2. Arama derinliğini değiştirme:
    ```bash
    # Daha derin aramalar için -maxdepth değerini artırın:
    find . -maxdepth 1 -type d
    ```

## Sorun Giderme

1. **"projects klasörü bulunamadı!" hatası alıyorsanız:**

    - Scripti Neo projesinin kök dizininden çalıştırdığınızdan emin olun
    - `projects` klasörünün mevcut olup olmadığını kontrol edin

2. **İçerik araması çok uzun sürüyorsa:**
    - Daha spesifik arama terimleri kullanın
    - Script kodunu düzenleyerek daha az dosya uzantısı arayın


