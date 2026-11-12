#!/bin/bash

# Renkli çıktı için ANSI renk kodları
RED='[0;31m'
GREEN='[0;32m'
YELLOW='[1;33m'
BLUE='[0;34m'
NC='[0m'

# Yapılandırma
ANALYSIS_DIR="dependency_analysis"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_DIR="$ANALYSIS_DIR/$TIMESTAMP"
LOG_FILE="$OUTPUT_DIR/analysis.log"
GRAPH_FILE="$OUTPUT_DIR/dependency_graph.dot"
REPORT_FILE="$OUTPUT_DIR/analysis_report.html"

# Başlangıç kontrolleri
setup() {
    echo "===================================="
    echo "    Dependency Analiz Scripti"
    echo "===================================="

    mkdir -p "$OUTPUT_DIR"
    touch "$LOG_FILE"
}

# Log fonksiyonu
log() {
    echo -e "[$(date +"%Y-%m-%d %H:%M:%S")] $1" | tee -a "$LOG_FILE"
}

# Composer bağımlılıklarını analiz et
analyze_composer() {
    if [ -f "composer.json" ]; then
        log "${BLUE}Composer bağımlılıkları analiz ediliyor...${NC}"
        
        # Bağımlılık listesi
        composer show --format=json > "$OUTPUT_DIR/composer_deps.json"
        
        # Güvenlik kontrolü
        composer audit --format=json > "$OUTPUT_DIR/composer_security.json"
        
        # Kullanılmayan bağımlılıkları bul
        composer why-not --all --format=json > "$OUTPUT_DIR/composer_unused.json"
        
        log "${GREEN}Composer analizi tamamlandı${NC}"
    fi
}

# NPM bağımlılıklarını analiz et
analyze_npm() {
    if [ -f "package.json" ]; then
        log "${BLUE}NPM bağımlılıkları analiz ediliyor...${NC}"
        
        # Bağımlılık listesi
        npm list --json > "$OUTPUT_DIR/npm_deps.json"
        
        # Güvenlik kontrolü
        npm audit --json > "$OUTPUT_DIR/npm_security.json"
        
        # Güncellenebilir paketler
        npm outdated --json > "$OUTPUT_DIR/npm_outdated.json"
        
        log "${GREEN}NPM analizi tamamlandı${NC}"
    fi
}

# Bağımlılık grafiği oluştur
generate_graph() {
    log "${BLUE}Bağımlılık grafiği oluşturuluyor...${NC}"
    
    echo "digraph DependencyGraph {" > "$GRAPH_FILE"
    echo "  node [shape=box];" >> "$GRAPH_FILE"
    
    # Composer bağımlılıklarını ekle
    if [ -f "$OUTPUT_DIR/composer_deps.json" ]; then
        jq -r '.installed[] | "  \"" + .name + "\" -> \"" + (.requires | keys[]) + "\""' "$OUTPUT_DIR/composer_deps.json" >> "$GRAPH_FILE"
    fi
    
    # NPM bağımlılıklarını ekle
    if [ -f "$OUTPUT_DIR/npm_deps.json" ]; then
        jq -r '.dependencies | to_entries[] | "  \"" + .key + "\" -> \"" + (.value.requires | keys[]) + "\""' "$OUTPUT_DIR/npm_deps.json" >> "$GRAPH_FILE"
    fi
    
    echo "}" >> "$GRAPH_FILE"
    
    # Grafiği PNG'ye dönüştür
    if command -v dot >/dev/null 2>&1; then
        dot -Tpng "$GRAPH_FILE" -o "$OUTPUT_DIR/dependency_graph.png"
    fi
    
    log "${GREEN}Bağımlılık grafiği oluşturuldu${NC}"
}

# Analiz raporu oluştur
generate_report() {
    log "${BLUE}Analiz raporu oluşturuluyor...${NC}"
    
    cat > "$REPORT_FILE" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Dependency Analiz Raporu</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .section { margin: 20px 0; padding: 10px; border: 1px solid #ddd; }
        .warning { background-color: #fff3e0; }
        .error { background-color: #ffebee; }
        .success { background-color: #f1f8e9; }
    </style>
</head>
<body>
    <h1>Dependency Analiz Raporu</h1>
    <p>Tarih: $(date)</p>
    
    <div class="section">
        <h2>Özet</h2>
EOF
    
    # Composer özeti
    if [ -f "$OUTPUT_DIR/composer_deps.json" ]; then
        echo "<h3>Composer Bağımlılıkları</h3>" >> "$REPORT_FILE"
        echo "<pre>" >> "$REPORT_FILE"
        jq -r '.installed | length' "$OUTPUT_DIR/composer_deps.json" | xargs echo "Toplam paket sayısı:" >> "$REPORT_FILE"
        echo "</pre>" >> "$REPORT_FILE"
    fi
    
    # NPM özeti
    if [ -f "$OUTPUT_DIR/npm_deps.json" ]; then
        echo "<h3>NPM Bağımlılıkları</h3>" >> "$REPORT_FILE"
        echo "<pre>" >> "$REPORT_FILE"
        jq -r '.dependencies | length' "$OUTPUT_DIR/npm_deps.json" | xargs echo "Toplam paket sayısı:" >> "$REPORT_FILE"
        echo "</pre>" >> "$REPORT_FILE"
    fi
    
    # Güvenlik açıkları
    echo "<div class=\"section warning\">" >> "$REPORT_FILE"
    echo "<h2>Güvenlik Açıkları</h2>" >> "$REPORT_FILE"
    
    if [ -f "$OUTPUT_DIR/composer_security.json" ]; then
        echo "<h3>Composer Güvenlik Açıkları</h3>" >> "$REPORT_FILE"
        jq -r '.advisories' "$OUTPUT_DIR/composer_security.json" >> "$REPORT_FILE"
    fi
    
    if [ -f "$OUTPUT_DIR/npm_security.json" ]; then
        echo "<h3>NPM Güvenlik Açıkları</h3>" >> "$REPORT_FILE"
        jq -r '.advisories' "$OUTPUT_DIR/npm_security.json" >> "$REPORT_FILE"
    fi
    
    echo "</div>" >> "$REPORT_FILE"
    
    # Bağımlılık grafiği
    if [ -f "$OUTPUT_DIR/dependency_graph.png" ]; then
        echo "<div class=\"section\">" >> "$REPORT_FILE"
        echo "<h2>Bağımlılık Grafiği</h2>" >> "$REPORT_FILE"
        echo "<img src=\"dependency_graph.png\" alt=\"Dependency Graph\">" >> "$REPORT_FILE"
        echo "</div>" >> "$REPORT_FILE"
    fi
    
    echo "</body></html>" >> "$REPORT_FILE"
    
    log "${GREEN}Analiz raporu oluşturuldu: $REPORT_FILE${NC}"
}

# Ana fonksiyon
main() {
    setup
    analyze_composer
    analyze_npm
    generate_graph
    generate_report
    
    log "${GREEN}Dependency analizi tamamlandı${NC}"
}

# Scripti çalıştır
main
