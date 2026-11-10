# Proje Gruplandırma Aracı

Bu belge, `group_projects.sh` adlı bash scriptinin kullanımını ve amacını açıklar.

## Amaç

`group_projects.sh` scripti, bir ana dizin içindeki alt projeleri alfabetik olarak gruplandırmak için tasarlanmıştır. Neo projesi gibi çok sayıda alt projeye sahip büyük projelerde, hangi proje klasörlerinin mevcut olduğunu ve bunların harflere göre nasıl dağıldığını hızlıca görmenizi sağlar.

## Kullanım

Scripti çalıştırmak için aşağıdaki komutu kullanın:

```bash
./group_projects.sh
```

Script, aşağıdaki adımları gerçekleştirir:

1. Projeleri ilk harflerine göre (A'dan Z'ye) gruplar
2. Her grupta kaç proje olduğunu gösterir
3. Projeleri alfabetik sırayla listeler
4. Toplam proje sayısını hesaplar ve gösterir
5. Raporun oluşturulduğu tarih ve saati ekler

## Çıktıyı Dosyaya Yönlendirme

Script çıktısını bir dosyaya yönlendirmek için aşağıdaki komutu kullanabilirsiniz:

```bash
./group_projects.sh > proje_raporu.txt
```

Bu şekilde, sonuçları daha sonra incelemek üzere kaydedebilirsiniz.

## Teknik Detaylar

Script, Neo projesinin `projects` klasörünü hedefler ve bu klasördeki tüm alt dizinleri (klasörleri) proje olarak kabul eder. Her projenin adı, ilk harfine göre gruplandırılır.

Gruplandırma işlemi:

-   A-Z arasındaki harfler için ayrı gruplar oluşturulur
-   Harf dışı karakterle başlayan projeler "DİĞER" grubunda listelenir
-   Her grup için proje sayısı hesaplanır
-   Tüm projeler için toplam sayı gösterilir

## Özelleştirme İpuçları

Scripti kendi ihtiyaçlarınıza göre özelleştirmek isterseniz:

1. Proje klasörünün yolu:

    - `cd "$(dirname "$0")/projects"` satırını değiştirerek farklı bir klasör hedefleyebilirsiniz

2. Harf gruplaması:

    - `for letter in {A..Z}` satırını değiştirerek farklı gruplamalar yapabilirsiniz

3. Bekleme süresi:
    - İlerleme çubuğundaki `sleep 0.05` değerini değiştirerek hızı ayarlayabilirsiniz

## Çıktı Örneği

```
============================================================
                PROJE GRUPLANDIRMA ARACI
============================================================

Projeleri harflere göre gruplandırma işlemi başlıyor...
Lütfen bekleyin, projeler analiz ediliyor...

İşleniyor [####################] Tamamlandı!

------------------------------------------------------------
            PROJELERİN HARF GRUPLARINA GÖRE DAĞILIMI
------------------------------------------------------------

==================== A GRUBU (24 proje) ====================
  * acupuncture
  * agri
  * aiartist
  ...

==================== B GRUBU (17 proje) ====================
  * babysafe
  * bake
  * balletcoach
  ...

...

============================================================
                       ÖZET BİLGİSİ
============================================================

TOPLAM PROJE SAYISI: 420
Script tamamlandı. Tüm projeler başarıyla gruplandırıldı.

Rapor oluşturulma tarihi: Mon Jun 3 12:34:56 TRT 2023
```

## Sorun Giderme

1. **"projects klasörü bulunamadı!" hatası alıyorsanız:**

    - Scripti Neo projesinin kök dizininden çalıştırdığınızdan emin olun
    - `projects` klasörünün mevcut olup olmadığını kontrol edin

2. **Çıktıda hiç proje göremiyorsanız:**

    - `projects` klasörünün içinde alt klasörlerin olup olmadığını kontrol edin
    - Klasör izinlerini kontrol edin

3. **Script çalıştırılamıyorsa:**
    - `chmod +x group_projects.sh` komutu ile çalıştırma izni verdiğinizden emin olun
