#!/bin/bash

clear
echo "============================================================"
echo "                PROJE GRUPLANDIRMA ARACI                    "
echo "============================================================"
echo

echo "Projeleri harflere göre gruplandırma işlemi başlıyor..."
echo "Lütfen bekleyin, projeler analiz ediliyor..."
echo

cd "$(dirname "$0")/projects" || { echo "Hata: projects klasörü bulunamadı!"; exit 1; }

# İlerleme çubuğunu göster (basit hali)
echo -n "İşleniyor ["
for ((i=0; i<20; i++)); do
  sleep 0.05
  echo -n "#"
done
echo "] Tamamlandı!"
echo

echo "------------------------------------------------------------"
echo "            PROJELERİN HARF GRUPLARINA GÖRE DAĞILIMI       "
echo "------------------------------------------------------------"
echo

# Toplam proje sayısını hesapla
total=$(ls -d */ 2>/dev/null | wc -l | tr -d ' ')

# Her harf için projeleri bul ve grupla
for letter in {A..Z}; do
  # Bu harfle başlayan projeleri bul
  projects=$(ls -d */ 2>/dev/null | grep -i "^$letter" | tr -d "/")

  # Proje sayısını hesapla
  count=$(echo "$projects" | grep -v "^$" | wc -l | tr -d ' ')

  # Eğer proje varsa, grubu göster
  if [ "$count" -gt 0 ]; then
    echo "==================== $letter GRUBU ($count proje) ===================="
    echo "$projects" | sort | sed "s/^/  * /"
    echo
  fi
done

# Diğer karakterlerle başlayan projeleri bul
other_projects=$(ls -d */ 2>/dev/null | grep -i -v "^[a-z]" | tr -d "/")
other_count=$(echo "$other_projects" | grep -v "^$" | wc -l | tr -d ' ')

if [ "$other_count" -gt 0 ]; then
  echo "==================== DİĞER GRUBU ($other_count proje) ===================="
  echo "$other_projects" | sort | sed "s/^/  * /"
  echo
fi

# Özet bilgisi
echo "============================================================"
echo "                       ÖZET BİLGİSİ                         "
echo "============================================================"
echo

echo "TOPLAM PROJE SAYISI: $total"
echo "Script tamamlandı. Tüm projeler başarıyla gruplandırıldı."
echo

# Tarih bilgisi ekle
echo "Rapor oluşturulma tarihi: $(date)"
echo
