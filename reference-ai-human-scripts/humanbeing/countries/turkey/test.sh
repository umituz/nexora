#!/bin/bash

# Başlangıç mesajı
echo "Test scripti başlatılıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Renkli mesajlar yazdır
echo -e "${RED}Bu kırmızı bir mesaj${NC}"
echo -e "${GREEN}Bu yeşil bir mesaj${NC}"
echo -e "${YELLOW}Bu sarı bir mesaj${NC}"

# Bitiş mesajı
echo "Test scripti tamamlandı."
