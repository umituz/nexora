#!/bin/bash

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Mevcut yılı al
CURRENT_YEAR=$(date +%Y)

# Yaş tahmini fonksiyonu
estimate_age() {
    local name=$1
    case $name in
        "Ayse"|"Fatma"|"Hatice"|"Emine")
            echo "1950-1970"
            ;;
        "Zehra"|"Ahmet"|"Mehmet"|"Ali"|"Mustafa")
            echo "1960-1980"
            ;;
        "Murat")
            echo "1970-1990"
            ;;
        "Zeynep")
            echo "1980-2000"
            ;;
        "Elif")
            echo "1990-2010"
            ;;
        "Ece"|"Yigit")
            echo "2000-2020"
            ;;
        "Defne"|"Cinar")
            echo "2010-2023"
            ;;
        *)
            echo "1980-2000"
            ;;
    esac
}

# Meslek tahmini fonksiyonu
estimate_profession() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    # Yaş grubuna göre olası meslekler
    if [ $start_year -lt 1965 ]; then
        case $gender in
            "female")
                echo "- Emekli Öğretmen
- Emekli Hemşire
- Ev Hanımı
- Terzi
- Esnaf"
                ;;
            "male")
                echo "- Emekli Memur
- Emekli Öğretmen
- Esnaf
- Çiftçi
- Emekli Asker/Polis"
                ;;
        esac
    elif [ $start_year -lt 1980 ]; then
        case $gender in
            "female")
                echo "- Öğretmen
- Doktor
- Hemşire
- Bankacı
- Muhasebeci"
                ;;
            "male")
                echo "- Mühendis
- Doktor
- Öğretmen
- İşletmeci
- Memur"
                ;;
        esac
    elif [ $start_year -lt 1995 ]; then
        case $gender in
            "female")
                echo "- Yazılım Mühendisi
- Dijital Pazarlama Uzmanı
- Grafik Tasarımcı
- Psikolog
- Akademisyen"
                ;;
            "male")
                echo "- Yazılım Geliştirici
- Veri Bilimci
- Dijital Pazarlama Uzmanı
- Girişimci
- Finans Uzmanı"
                ;;
        esac
    elif [ $start_year -lt 2010 ]; then
        case $gender in
            "female")
                echo "- Öğrenci (Üniversite/Lise)
- Sosyal Medya Yöneticisi
- Influencer
- Freelancer
- Stajyer"
                ;;
            "male")
                echo "- Öğrenci (Üniversite/Lise)
- E-Sporcu
- Yazılım Geliştirici
- YouTuber
- Stajyer"
                ;;
        esac
    else
        echo "- Öğrenci (İlkokul/Ortaokul)"
    fi
}

# Nesil açıklaması fonksiyonu
get_generation_description() {
    local start_year=$1

    if [ $start_year -lt 1965 ]; then
        echo "Baby Boomer Nesli (1946-1964): Geleneksel değerlere bağlı, çalışkan ve disiplinli bir nesil."
    elif [ $start_year -lt 1980 ]; then
        echo "X Nesli (1965-1979): Teknoloji ile büyüyen ilk nesil, adaptasyon yeteneği yüksek."
    elif [ $start_year -lt 1995 ]; then
        echo "Y Nesli/Milenyum (1980-1994): Dijital dünyaya adapte olan, değişime açık nesil."
    elif [ $start_year -lt 2010 ]; then
        echo "Z Nesli (1995-2009): Dijital yerliler, teknoloji ile iç içe büyüyen nesil."
    else
        echo "Alfa Nesli (2010-günümüz): Teknolojinin içine doğan, dijital dünyada yaşayan nesil."
    fi
}

# Eğitim durumu tahmini fonksiyonu
estimate_education() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- İlkokul Mezunu
- Ortaokul Mezunu
- Lise Mezunu (Nadir)"
    elif [ $start_year -lt 1980 ]; then
        echo "- Lise Mezunu
- Üniversite Mezunu
- Yüksek Lisans (Nadir)"
    elif [ $start_year -lt 1995 ]; then
        echo "- Üniversite Mezunu
- Yüksek Lisans
- Doktora
- Yurtdışı Eğitim Deneyimi"
    elif [ $start_year -lt 2010 ]; then
        echo "- Lise Öğrencisi/Mezunu
- Üniversite Öğrencisi/Mezunu
- Yüksek Lisans Öğrencisi"
    else
        echo "- İlkokul Öğrencisi
- Ortaokul Öğrencisi"
    fi
}

# Hobi ve ilgi alanları tahmini fonksiyonu
estimate_hobbies() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        case $gender in
            "female")
                echo "- El İşi (Örgü, Nakış)
- Yemek Yapmak
- Bahçe İşleri
- TV Dizileri
- Komşu Ziyaretleri"
                ;;
            "male")
                echo "- Kahvehane Sohbetleri
- Bahçe/Tarla İşleri
- Gazete Okuma
- Balık Tutma
- Tavla/Okey"
                ;;
        esac
    elif [ $start_year -lt 1980 ]; then
        case $gender in
            "female")
                echo "- Kitap Okuma
- Yürüyüş/Pilates
- Yemek Yapma
- Seyahat
- Sosyal Medya"
                ;;
            "male")
                echo "- Spor (Futbol, Basketbol)
- Seyahat
- Fotoğrafçılık
- Araba Modifiye
- Teknoloji"
                ;;
        esac
    elif [ $start_year -lt 1995 ]; then
        case $gender in
            "female")
                echo "- Fitness/Yoga
- Fotoğrafçılık
- Seyahat
- Yabancı Dil Öğrenme
- Sosyal Medya İçerik Üretme"
                ;;
            "male")
                echo "- Fitness/Vücut Geliştirme
- Teknoloji/Yazılım
- E-Spor/Gaming
- Kripto Para/Yatırım
- Drone/Fotoğrafçılık"
                ;;
        esac
    elif [ $start_year -lt 2010 ]; then
        case $gender in
            "female")
                echo "- TikTok/Instagram İçerik Üretme
- K-Pop/Anime
- Dans
- Makeup/Kozmetik
- Dizi/Film Streaming"
                ;;
            "male")
                echo "- Gaming/Twitch Yayıncılığı
- Yazılım/Robotik
- Spor (Fitness, Basketbol)
- Müzik (Rap, Elektronik)
- YouTube İçerik Üretme"
                ;;
        esac
    else
        echo "- Sosyal Medya
- Gaming
- YouTube/TikTok
- Müzik Dinleme
- Dans"
    fi
}

# Yaşanılan şehir tahmini fonksiyonu
estimate_city() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Anadolu Şehirleri (Konya, Kayseri, Sivas)
- İstanbul (Fatih, Üsküdar, Eyüp)
- Ankara (Mamak, Keçiören)
- İzmir (Karşıyaka, Bornova)"
    elif [ $start_year -lt 1980 ]; then
        echo "- İstanbul (Kadıköy, Bakırköy, Beşiktaş)
- Ankara (Çankaya, Yenimahalle)
- İzmir (Karşıyaka, Bornova, Alsancak)
- Bursa, Eskişehir, Antalya"
    elif [ $start_year -lt 1995 ]; then
        echo "- İstanbul (Beşiktaş, Şişli, Kadıköy)
- Ankara (Çankaya, Bahçelievler)
- İzmir (Bornova, Karşıyaka)
- Eskişehir, Antalya
- Yurtdışı (Almanya, Hollanda, İngiltere)"
    elif [ $start_year -lt 2010 ]; then
        echo "- İstanbul (Ataşehir, Beylikdüzü)
- Ankara (Çankaya, Etimesgut)
- İzmir (Bornova, Çiğli)
- Bursa, Kocaeli
- Yurtdışı Eğitim Planı"
    else
        echo "- Büyükşehirler (İstanbul, Ankara, İzmir)
- Gelişmekte Olan Şehirler
- Aile ile Yaşanılan Şehir"
    fi
}

# Medeni durum tahmini fonksiyonu
estimate_marital_status() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Evli (40+ yıllık)
- Çocuk Sayısı: 3-5
- Torun Sayısı: 5-10"
    elif [ $start_year -lt 1980 ]; then
        echo "- Evli (20-30 yıllık)
- Çocuk Sayısı: 2-3
- Torun Sayısı: 0-3"
    elif [ $start_year -lt 1995 ]; then
        echo "- Evli (5-15 yıllık)
- Çocuk Sayısı: 1-2
- Bekar (Kariyer Odaklı)
- Boşanmış Olabilir"
    elif [ $start_year -lt 2010 ]; then
        echo "- Bekar
- İlişkisi Var
- Evlilik Düşünmüyor
- Kariyer Odaklı"
    else
        echo "- Bekar
- Öğrenci"
    fi
}

# Siyasi görüş tahmini fonksiyonu
estimate_political_view() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Muhafazakar/Geleneksel eğilimli
- Milliyetçi değerlere yakın
- Yerel/ulusal siyasete ilgili
- Gazete okuma alışkanlığı yüksek
- TV haber programlarını takip eder"
    elif [ $start_year -lt 1980 ]; then
        echo "- Merkez sağ/sol eğilimli
- Pragmatik siyasi yaklaşım
- Ekonomi odaklı siyasi tercihler
- Hem geleneksel hem dijital medyadan siyaseti takip eder
- Yerel ve ulusal siyasetle ilgilenir"
    elif [ $start_year -lt 1995 ]; then
        echo "- Liberal/Progresif eğilimli
- Çevre ve sosyal adalet konularına duyarlı
- Dijital aktivizme yatkın
- Sosyal medyadan siyaseti takip eder
- Global siyasi konularla ilgilenir"
    else
        echo "- Post-ideolojik yaklaşım
- Sosyal medya aktivizmi
- Çevreci ve sosyal adalet odaklı
- Geleneksel siyasi kalıplardan uzak
- Dijital platformlardan siyasi bilgi edinme"
    fi
}

# Dini inanç/yaşam tarzı tahmini fonksiyonu
estimate_lifestyle() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Geleneksel dini değerlere bağlı
- Düzenli ibadet alışkanlığı
- Muhafazakar yaşam tarzı
- Aile ve komşuluk ilişkilerine önem verir
- Geleneksel giyim tarzı"
    elif [ $start_year -lt 1980 ]; then
        echo "- Ilımlı dini yaklaşım
- Modern-geleneksel değer sentezi
- Karma yaşam tarzı
- İş-aile dengesi önemli
- Esnek giyim tarzı"
    elif [ $start_year -lt 1995 ]; then
        echo "- Seküler/Spiritüel eğilimli
- Bireysel inanç sistemi
- Modern yaşam tarzı
- İş ve kariyer odaklı
- Trend giyim tarzı"
    else
        echo "- Post-modern inanç yaklaşımı
- Çoğulcu dünya görüşü
- Minimalist/Sürdürülebilir yaşam
- Dijital göçebe potansiyeli
- Özgün/Vintage giyim tarzı"
    fi
}

# Ekonomik durum tahmini fonksiyonu
estimate_economic_status() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Emekli maaşı/kira geliri
- Muhafazakar yatırım tercihleri (altın, döviz)
- Tasarruf odaklı yaşam
- Mülk sahibi olma eğilimi
- Düşük-orta gelir grubu"
    elif [ $start_year -lt 1980 ]; then
        echo "- Düzenli maaş/iş geliri
- Karma yatırım portföyü
- Dengeli harcama alışkanlığı
- Ev/araba sahibi
- Orta-üst gelir grubu"
    elif [ $start_year -lt 1995 ]; then
        echo "- Yüksek gelir potansiyeli
- Modern yatırım araçları (kripto, borsa)
- Lüks tüketim eğilimi
- Kiracı/yeni ev sahibi
- Üst gelir grubu"
    else
        echo "- Değişken gelir (freelance/girişimci)
- Dijital yatırımlar
- Deneyim odaklı harcama
- Kiracı/dijital göçebe
- Gelişmekte olan gelir"
    fi
}

# Sosyal medya kullanım alışkanlıkları tahmini fonksiyonu
estimate_social_media_habits() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Facebook temel kullanım
- WhatsApp aile grupları
- YouTube geleneksel içerik
- Sınırlı sosyal medya kullanımı
- Sabah/akşam giriş rutini"
    elif [ $start_year -lt 1980 ]; then
        echo "- Facebook aktif kullanım
- Instagram fotoğraf paylaşımı
- LinkedIn profesyonel ağ
- Twitter haber takibi
- Günde 2-3 saat kullanım"
    elif [ $start_year -lt 1995 ]; then
        echo "- Instagram hikaye/post
- Twitter gündem takibi
- LinkedIn kariyer ağı
- YouTube içerik tüketimi
- Günde 4-6 saat kullanım"
    else
        echo "- Instagram reels/hikaye
- TikTok aktif kullanım
- Twitch yayın/izleme
- BeReal anlık paylaşım
- Günde 6-8 saat kullanım"
    fi
}

# Sağlık durumu tahmini fonksiyonu
estimate_health_status() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Kronik hastalık riski (tansiyon, diyabet)
- Düzenli hastane kontrolleri
- Ortopedik sorunlar olabilir
- İlaç kullanımı muhtemel
- Düzenli yürüyüş/hafif egzersiz"
    elif [ $start_year -lt 1980 ]; then
        echo "- Genel sağlık durumu iyi
- Ara sıra check-up
- Stres kaynaklı sorunlar
- Ofis çalışanı sendromu
- Düzenli spor/fitness"
    elif [ $start_year -lt 1995 ]; then
        echo "- Sağlık durumu çok iyi
- Fitness/yoga takipçisi
- Sağlıklı beslenme
- Mental sağlık farkındalığı
- Düzenli spor aktiviteleri"
    elif [ $start_year -lt 2010 ]; then
        echo "- Mükemmel sağlık durumu
- Aktif yaşam tarzı
- Spor/dans aktiviteleri
- Beslenme takibi (vegan/vejetaryen eğilim)
- Mental sağlık uygulamaları"
    else
        echo "- Çocukluk/ergenlik sağlık kontrolleri
- Aşı takibi
- Spor/aktivite katılımı
- Dengeli beslenme programı
- Dijital göz yorgunluğu riski"
    fi
}

# Tatil tercihleri tahmini fonksiyonu
estimate_vacation_preferences() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Termal/kaplıca tatili
- Memleket ziyaretleri
- Yakın mesafe turları
- Hac/umre ziyareti
- All-inclusive oteller"
    elif [ $start_year -lt 1980 ]; then
        echo "- Aile tatilleri
- Yurt içi kültür turları
- Yazlık ev tercihi
- Akraba ziyaretleri
- Doğa/kamp aktiviteleri"
    elif [ $start_year -lt 1995 ]; then
        echo "- Yurtdışı seyahatler
- Macera turizmi
- Butik oteller
- Şehir turları
- Doğa sporları"
    elif [ $start_year -lt 2010 ]; then
        echo "- Backpacking
- Hostel konaklamaları
- Festival turizmi
- Interrail seyahatleri
- Ekstrem sporlar"
    else
        echo "- Aile ile tatiller
- Yaz kampları
- Okul gezileri
- Akraba ziyaretleri
- Eğitim amaçlı seyahatler"
    fi
}

# Yemek/mutfak tercihleri tahmini fonksiyonu
estimate_food_preferences() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Geleneksel Türk mutfağı
- Ev yapımı yemekler
- Hamur işleri
- Kahvaltı kültürü
- Konserve/turşu yapımı"
    elif [ $start_year -lt 1980 ]; then
        echo "- Karma mutfak tercihi
- Fast-food ara sıra
- Ev yemekleri
- Restoran deneyimi
- Kahve kültürü"
    elif [ $start_year -lt 1995 ]; then
        echo "- Dünya mutfakları
- Sushi/Uzak Doğu
- Vejetaryen eğilim
- Food truck deneyimi
- 3. dalga kahve"
    elif [ $start_year -lt 2010 ]; then
        echo "- Vegan/vejetaryen
- Food blogger tarzı
- Korean/Japon mutfağı
- Smoothie/bowl
- Bubble tea"
    else
        echo "- Fast-food
- Atıştırmalıklar
- Hazır gıdalar
- Okul kantini
- Abur cubur"
    fi
}

# Araba/ulaşım tercihleri tahmini fonksiyonu
estimate_transportation_preferences() {
    local name=$1
    local gender=$2
    local year_range=$3
    local start_year=$(echo $year_range | cut -d'-' -f1)

    if [ $start_year -lt 1965 ]; then
        echo "- Klasik/eski model araç
- Toplu taşıma
- Taksi kullanımı
- Yürüme mesafesi tercih
- Şehir içi otobüs"
    elif [ $start_year -lt 1980 ]; then
        echo "- Orta segment araç
- SUV tercihi
- Araç kredisi
- Metro/Metrobüs
- Havayolu seyahati"
    elif [ $start_year -lt 1995 ]; then
        echo "- Premium segment araç
- Elektrikli araç ilgisi
- Uber/BiTaksi
- Scooter/Martı
- Hızlı tren"
    elif [ $start_year -lt 2010 ]; then
        echo "- Araç paylaşımı
- Elektrikli scooter
- Bisiklet
- Toplu taşıma
- Car sharing"
    else
        echo "- Okul servisi
- Ebeveyn araçları
- Bisiklet
- Toplu taşıma
- Yürüyüş"
    fi
}

# Ana dizini oluştur
mkdir -p names

# Soyadları
SURNAMES=(
    "Yilmaz" "Kaya" "Demir" "Celik" "Sahin" "Yildiz" "Yildirim" "Ozturk" "Aydin" "Ozdemir"
    "Arslan" "Dogan" "Kilic" "Aslan" "Cetin" "Kara" "Kurt" "Koc" "Ozkan" "Simsek"
    "Korkmaz" "Ozer" "Cakir" "Erdogan" "Sen" "Yalcin" "Guler" "Aktas" "Kocaman" "Ates"
    "Avci" "Ucar" "Gunes" "Polat" "Aksoy" "Kaplan" "Alkan" "Bulut" "Tas" "Yuksel"
    "Tekin" "Unal" "Senturk" "Demirci" "Erkus" "Tunc" "Yavuz" "Toprak" "Sonmez" "Erdem"
    "Kartal" "Duman" "Akin" "Colak" "Kocak" "Bektas" "Uzun" "Guzel" "Mutlu" "Duran"
    "Uysal" "Kilinc" "Aksu" "Aydogan" "Guven" "Turk" "Yucel" "Cicek" "Genc" "Koca"
    "Ari" "Bilgin" "Asil" "Akgul" "Turan" "Gokturk" "Alp" "Akar" "Yaman" "Eroglu"
    "Sari" "Ergin" "Akyol" "Ozen" "Onal" "Keskin" "Gul" "Akyuz" "Ekinci" "Akbas"
    "Turkmen" "Ceylan" "Altun" "Akman" "Gumus" "Dag" "Uyar" "Demirel" "Bozkurt" "Altay"
)

# İsim işleme fonksiyonu
process_name() {
    local name=$1
    local gender=$2
    local letter=$(echo $name | cut -c1 | tr '[:upper:]' '[:lower:]')

    # Dizin oluştur
    mkdir -p "names/$letter/$gender"

    # Dosya yolu
    local file_path="names/$letter/$gender/$(echo $name | tr '[:upper:]' '[:lower:]').md"

    # Markdown dosyası oluştur
    echo "# $name" > "$file_path"

    # Yaş tahmini yap
    local year_range=$(estimate_age "$name")
    local start_year=$(echo $year_range | cut -d'-' -f1)
    local end_year=$(echo $year_range | cut -d'-' -f2)

    # Yaş aralığını hesapla
    local min_age=$((CURRENT_YEAR - end_year))
    local max_age=$((CURRENT_YEAR - start_year))

    # Nesil açıklamasını al
    local generation_desc=$(get_generation_description $start_year)

    # Yaş tahminini ekle
    echo "" >> "$file_path"
    echo "## Yaş Tahmini" >> "$file_path"
    echo "- Tahmini Yaş Aralığı: $min_age-$max_age yaş" >> "$file_path"
    echo "- Tahmini Doğum Yılı: $start_year-$end_year" >> "$file_path"
    echo "- Nesil: $generation_desc" >> "$file_path"

    # Olası meslekleri ekle
    echo "" >> "$file_path"
    echo "## Olası Meslekler" >> "$file_path"
    echo "" >> "$file_path"
    estimate_profession "$name" "$gender" "$year_range" >> "$file_path"

    # Eğitim durumu tahmini ekle
    echo "" >> "$file_path"
    echo "## Eğitim Durumu Tahmini" >> "$file_path"
    echo "" >> "$file_path"
    estimate_education "$name" "$gender" "$year_range" >> "$file_path"

    # Hobi ve ilgi alanları tahmini ekle
    echo "" >> "$file_path"
    echo "## Olası Hobi ve İlgi Alanları" >> "$file_path"
    echo "" >> "$file_path"
    estimate_hobbies "$name" "$gender" "$year_range" >> "$file_path"

    # Yaşanılan şehir tahmini ekle
    echo "" >> "$file_path"
    echo "## Muhtemel Yaşadığı Şehirler" >> "$file_path"
    echo "" >> "$file_path"
    estimate_city "$name" "$gender" "$year_range" >> "$file_path"

    # Medeni durum tahmini ekle
    echo "" >> "$file_path"
    echo "## Medeni Durum Tahmini" >> "$file_path"
    echo "" >> "$file_path"
    estimate_marital_status "$name" "$gender" "$year_range" >> "$file_path"

    # Siyasi görüş tahmini ekle
    echo "" >> "$file_path"
    echo "## Siyasi Görüş Tahmini" >> "$file_path"
    echo "" >> "$file_path"
    estimate_political_view "$name" "$gender" "$year_range" >> "$file_path"

    # Dini inanç/yaşam tarzı tahmini ekle
    echo "" >> "$file_path"
    echo "## Dini İnanç ve Yaşam Tarzı Tahmini" >> "$file_path"
    echo "" >> "$file_path"
    estimate_lifestyle "$name" "$gender" "$year_range" >> "$file_path"

    # Ekonomik durum tahmini ekle
    echo "" >> "$file_path"
    echo "## Ekonomik Durum Tahmini" >> "$file_path"
    echo "" >> "$file_path"
    estimate_economic_status "$name" "$gender" "$year_range" >> "$file_path"

    # Sosyal medya kullanım alışkanlıkları ekle
    echo "" >> "$file_path"
    echo "## Sosyal Medya Kullanım Alışkanlıkları" >> "$file_path"
    echo "" >> "$file_path"
    estimate_social_media_habits "$name" "$gender" "$year_range" >> "$file_path"

    # Sağlık durumu tahmini ekle
    echo "" >> "$file_path"
    echo "## Sağlık Durumu Tahmini" >> "$file_path"
    echo "" >> "$file_path"
    estimate_health_status "$name" "$gender" "$year_range" >> "$file_path"

    # Tatil tercihleri tahmini ekle
    echo "" >> "$file_path"
    echo "## Tatil Tercihleri Tahmini" >> "$file_path"
    echo "" >> "$file_path"
    estimate_vacation_preferences "$name" "$gender" "$year_range" >> "$file_path"

    # Yemek/mutfak tercihleri tahmini ekle
    echo "" >> "$file_path"
    echo "## Yemek ve Mutfak Tercihleri" >> "$file_path"
    echo "" >> "$file_path"
    estimate_food_preferences "$name" "$gender" "$year_range" >> "$file_path"

    # Araba/ulaşım tercihleri tahmini ekle
    echo "" >> "$file_path"
    echo "## Ulaşım Tercihleri" >> "$file_path"
    echo "" >> "$file_path"
    estimate_transportation_preferences "$name" "$gender" "$year_range" >> "$file_path"

    # İsim-soyisim kombinasyonlarını ekle
    echo "" >> "$file_path"
    echo "## İsim-Soyisim Kombinasyonları" >> "$file_path"
    echo "" >> "$file_path"
    local count=1
    for surname in "${SURNAMES[@]}"; do
        echo "$count. $name $surname" >> "$file_path"
        ((count++))
    done

    # OSINT araştırma önerilerini ekle
    echo "" >> "$file_path"
    echo "## OSINT Araştırma Önerileri" >> "$file_path"
    echo "" >> "$file_path"
    echo "Her bir isim-soyisim kombinasyonu için:" >> "$file_path"
    echo "- Sosyal medya hesapları" >> "$file_path"
    echo "  - Facebook" >> "$file_path"
    echo "  - Instagram" >> "$file_path"
    echo "  - Twitter" >> "$file_path"
    echo "  - LinkedIn" >> "$file_path"
    echo "  - TikTok" >> "$file_path"
    echo "" >> "$file_path"
    echo "- Profesyonel profiller" >> "$file_path"
    echo "  - LinkedIn" >> "$file_path"
    echo "  - ResearchGate" >> "$file_path"
    echo "  - Academia.edu" >> "$file_path"
    echo "  - GitHub" >> "$file_path"
    echo "" >> "$file_path"
    echo "- Akademik çalışmalar" >> "$file_path"
    echo "  - Google Scholar" >> "$file_path"
    echo "  - YÖK Tez Merkezi" >> "$file_path"
    echo "  - DergiPark" >> "$file_path"
    echo "" >> "$file_path"
    echo "- Haber ve medya aramaları" >> "$file_path"
    echo "  - Google News" >> "$file_path"
    echo "  - Gazete arşivleri" >> "$file_path"
    echo "  - YouTube" >> "$file_path"

    echo "[+] Oluşturuldu: $gender/$name"
}

# Kadın isimleri
for name in Ayse Asya Asli Aylin Azra Aleyna Ayca Arya Aybuke Alya; do
    process_name "$name" "female"
done

for name in Beren Beril Betul Beyza Buse Busra Bahar Beliz Berfin Bilge; do
    process_name "$name" "female"
done

for name in Canan Ceren Cemre Ceyda Ceylin; do
    process_name "$name" "female"
done

for name in Damla Defne Deniz Derya Dila Dilara Dilek Duru; do
    process_name "$name" "female"
done

for name in Ebru Ece Ekin Elif Elvan Emine Esra Eylul; do
    process_name "$name" "female"
done

for name in Fatma Feride Feyza Fidan Filiz; do
    process_name "$name" "female"
done

for name in Gamze Gizem Gokce Gozde Gulay Gul Gulsah; do
    process_name "$name" "female"
done

for name in Hacer Hale Hande Hatice Havva Hazal; do
    process_name "$name" "female"
done

for name in Isil Idil Ilayda Inci Ipek Irem; do
    process_name "$name" "female"
done

for name in Kader Kadriye Kubra; do
    process_name "$name" "female"
done

for name in Lale Leyla Lina; do
    process_name "$name" "female"
done

for name in Melek Melisa Melis Meltem Merve Mine; do
    process_name "$name" "female"
done

for name in Naz Nazli Nergis Neslihan Nil Nilufer Nur; do
    process_name "$name" "female"
done

for name in Ozge Ozlem Oyku; do
    process_name "$name" "female"
done

for name in Pelin Pinar; do
    process_name "$name" "female"
done

for name in Rabia Ruya; do
    process_name "$name" "female"
done

for name in Seda Sedef Selin Sema Sevgi Sila Su; do
    process_name "$name" "female"
done

for name in Tugba Tugce; do
    process_name "$name" "female"
done

for name in Yagmur Yaren Yasemin Yeliz Yesim; do
    process_name "$name" "female"
done

for name in Zehra Zeliha Zeynep Zumra; do
    process_name "$name" "female"
done

# Erkek isimleri
for name in Ahmet Ali Alp Alperen Aras Arda Arslan Atakan Ayaz; do
    process_name "$name" "male"
done

for name in Baran Baris Batuhan Berk Berkay Burak Bulent; do
    process_name "$name" "male"
done

for name in Can Cem Cenk Cihan; do
    process_name "$name" "male"
done

for name in Deniz Doruk; do
    process_name "$name" "male"
done

for name in Efe Emir Emre Enes Eren Erkan; do
    process_name "$name" "male"
done

for name in Fatih Furkan; do
    process_name "$name" "male"
done

for name in Gokturk Gokhan; do
    process_name "$name" "male"
done

for name in Hakan Halil Hamza Hasan Huseyin; do
    process_name "$name" "male"
done

for name in Ibrahim Ilker Ismail; do
    process_name "$name" "male"
done

for name in Kaan Kadir Kagan Kemal Kerem; do
    process_name "$name" "male"
done

for name in Levent; do
    process_name "$name" "male"
done

for name in Mehmet Melih Mert Murat Mustafa; do
    process_name "$name" "male"
done

for name in Nazim; do
    process_name "$name" "male"
done

for name in Oguz Okan Onur Orhan Ozan; do
    process_name "$name" "male"
done

for name in Polat; do
    process_name "$name" "male"
done

for name in Recep Riza; do
    process_name "$name" "male"
done

for name in Salih Sami Selim Serkan Sinan; do
    process_name "$name" "male"
done

for name in Tahir Talha Taner Tarik Tolga Tuna; do
    process_name "$name" "male"
done

for name in Ugur Umut Utku; do
    process_name "$name" "male"
done

for name in Volkan; do
    process_name "$name" "male"
done

for name in Yagiz Yakup Yigit Yusuf; do
    process_name "$name" "male"
done

for name in Zafer; do
    process_name "$name" "male"
done

echo ""
echo "[+] Klasör yapısı ve isim dosyaları oluşturuldu"
echo "[*] Toplam klasör yapısı:"
tree names
