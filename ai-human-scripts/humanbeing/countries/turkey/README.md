# Türk İsimleri Veritabanı

Bu klasör, Türk isimlerini cinsiyet ve alfabetik sıraya göre düzenlenmiş şekilde içerir. Her isim için rastgele seçilmiş 5 farklı soyisim kombinasyonu bulunmaktadır.

## Klasör Yapısı

```
names/
├── a/
│   ├── female/
│   │   ├── ayse.md         # İçinde: Ayşe Yılmaz, Ayşe Kaya, vs.
│   │   ├── asya.md        # İçinde: Asya Demir, Asya Çelik, vs.
│   │   └── ...
│   └── male/
│       ├── ahmet.md       # İçinde: Ahmet Öztürk, Ahmet Aydın, vs.
│       ├── ali.md         # İçinde: Ali Yıldız, Ali Arslan, vs.
│       └── ...
├── b/
│   ├── female/
│   │   ├── beren.md       # İçinde: Beren Doğan, Beren Kılıç, vs.
│   │   └── ...
│   └── male/
│       ├── baran.md       # İçinde: Baran Şahin, Baran Yıldırım, vs.
│       └── ...
└── ...
```

## Dosya İçeriği

Her `.md` dosyası şu yapıdadır:

```markdown
# İsim

## İsim-Soyisim Kombinasyonları

-   İsim Soyisim1
-   İsim Soyisim2
-   İsim Soyisim3
-   İsim Soyisim4
-   İsim Soyisim5

## OSINT Araştırma Önerileri

Her bir isim-soyisim kombinasyonu için:

-   Sosyal medya hesapları
-   Profesyonel profiller
-   Akademik çalışmalar
-   Haber ve medya aramaları
```

## Kullanım

1. İsim dosyaları markdown formatındadır
2. Her isim kendi baş harfinin klasöründe bulunur
3. Cinsiyet ayrımı için `female` ve `male` alt klasörleri kullanılır
4. Her isim için 5 farklı soyisim kombinasyonu mevcuttur

Örnek:

-   `Kübra` ismi ve kombinasyonları: `names/k/female/kubra.md`
-   `Kaan` ismi ve kombinasyonları: `names/k/male/kaan.md`

## İsim Ekleme

Yeni isim eklemek için:

```bash
# Kadın ismi ekleme
echo "# Yeni İsim" > names/[ilk_harf]/female/[isim].md

# Erkek ismi ekleme
echo "# Yeni İsim" > names/[ilk_harf]/male/[isim].md
```

## İsim Listesi Oluşturma

Tüm isimleri listelemek için:

```bash
# Kadın isimleri
find names/*/female -name "*.md" | sort

# Erkek isimleri
find names/*/male -name "*.md" | sort
```

## Otomatik Oluşturma

İsim veritabanını ve soyisim kombinasyonlarını otomatik oluşturmak için:

```bash
./name_generator.sh
```

## Not

Bu veritabanındaki isimler gerçek Türk isimlerinden oluşmaktadır ve her isim için rastgele seçilmiş 5 farklı soyisim kombinasyonu içermektedir. Veritabanı düzenli olarak güncellenmektedir.
