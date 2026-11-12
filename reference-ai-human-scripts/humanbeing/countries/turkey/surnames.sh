#!/bin/bash

# Türk soyisimleri listesi
SURNAMES=(
    "Yılmaz" "Kaya" "Demir" "Çelik" "Şahin" "Yıldız" "Yıldırım" "Öztürk" "Aydın" "Özdemir"
    "Arslan" "Doğan" "Kılıç" "Aslan" "Çetin" "Kara" "Kurt" "Koç" "Özkan" "Şimşek"
    "Korkmaz" "Özer" "Çakır" "Erdoğan" "Şen" "Yalçın" "Güler" "Aktaş" "Kocaman" "Ateş"
    "Avcı" "Uçar" "Güneş" "Polat" "Aksoy" "Kaplan" "Alkan" "Bulut" "Taş" "Yüksel"
    "Tekin" "Ünal" "Şentürk" "Demirci" "Erkuş" "Tunç" "Yavuz" "Toprak" "Sönmez" "Erdem"
    "Kartal" "Duman" "Akın" "Çolak" "Koçak" "Bektaş" "Uzun" "Güzel" "Mutlu" "Duran"
    "Uysal" "Kılınç" "Aksu" "Aydoğan" "Güven" "Türk" "Yücel" "Çiçek" "Genç" "Koca"
    "Arı" "Bilgin" "Asil" "Akgül" "Turan" "Göktürk" "Alp" "Akar" "Yaman" "Eroğlu"
    "Sarı" "Ergin" "Akyol" "Özen" "Önal" "Keskin" "Gül" "Akyüz" "Ekinci" "Akbaş"
    "Türkmen" "Ceylan" "Altun" "Akman" "Gümüş" "Dağ" "Uyar" "Demirel" "Bozkurt" "Altay"
)

# Soyisimleri dosyaya kaydet
echo "# Türk Soyisimleri" > surnames.txt
printf "%s\n" "${SURNAMES[@]}" >> surnames.txt

echo "[+] Soyisimler surnames.txt dosyasına kaydedildi"
