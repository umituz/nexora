#!/bin/bash

# Renkli çıktı için
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Sabit değişkenler
CONFIG_DIR="config"
LOGS_DIR="logs"
COMPOSE_DIR="compose"
BACKUP_DIR="backup"
CONFIG_FILE="$CONFIG_DIR/container_config.json"
LOG_FILE="$LOGS_DIR/container_manager.log"

# Log fonksiyonu
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
    echo -e "$1"
}

# Docker container yönetimi
manage_docker() {
    local action=$1
    local container=$2

    case $action in
        "start")
            log "${BLUE}Container başlatılıyor: $container${NC}"
            docker start "$container"
            ;;
        "stop")
            log "${BLUE}Container durduruluyor: $container${NC}"
            docker stop "$container"
            ;;
        "restart")
            log "${BLUE}Container yeniden başlatılıyor: $container${NC}"
            docker restart "$container"
            ;;
        "remove")
            log "${YELLOW}Container siliniyor: $container${NC}"
            docker rm -f "$container"
            ;;
        "logs")
            docker logs -f "$container"
            ;;
        *)
            log "${RED}Geçersiz Docker aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ İşlem başarılı${NC}"
        return 0
    else
        log "${RED}✗ İşlem başarısız${NC}"
        return 1
    fi
}

# Kubernetes pod yönetimi
manage_kubernetes() {
    local action=$1
    local pod=$2
    local namespace=${3:-default}

    case $action in
        "describe")
            kubectl describe pod "$pod" -n "$namespace"
            ;;
        "logs")
            kubectl logs -f "$pod" -n "$namespace"
            ;;
        "exec")
            kubectl exec -it "$pod" -n "$namespace" -- /bin/bash
            ;;
        "delete")
            log "${YELLOW}Pod siliniyor: $pod${NC}"
            kubectl delete pod "$pod" -n "$namespace"
            ;;
        *)
            log "${RED}Geçersiz Kubernetes aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ İşlem başarılı${NC}"
        return 0
    else
        log "${RED}✗ İşlem başarısız${NC}"
        return 1
    fi
}

# Docker Compose yönetimi
manage_compose() {
    local action=$1
    local project=$2
    local compose_file="$COMPOSE_DIR/$project/docker-compose.yml"

    if [ ! -f "$compose_file" ]; then
        log "${RED}✗ Compose dosyası bulunamadı: $compose_file${NC}"
        return 1
    fi

    case $action in
        "up")
            log "${BLUE}Compose projesi başlatılıyor: $project${NC}"
            docker-compose -f "$compose_file" up -d
            ;;
        "down")
            log "${BLUE}Compose projesi durduruluyor: $project${NC}"
            docker-compose -f "$compose_file" down
            ;;
        "restart")
            log "${BLUE}Compose projesi yeniden başlatılıyor: $project${NC}"
            docker-compose -f "$compose_file" restart
            ;;
        "logs")
            docker-compose -f "$compose_file" logs -f
            ;;
        *)
            log "${RED}Geçersiz Compose aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ İşlem başarılı${NC}"
        return 0
    else
        log "${RED}✗ İşlem başarısız${NC}"
        return 1
    fi
}

# Container registry yönetimi
manage_registry() {
    local action=$1
    local image=$2
    local tag=${3:-latest}
    local registry=${4:-"docker.io"}

    case $action in
        "push")
            log "${BLUE}Image push ediliyor: $image:$tag${NC}"
            docker push "$registry/$image:$tag"
            ;;
        "pull")
            log "${BLUE}Image pull ediliyor: $image:$tag${NC}"
            docker pull "$registry/$image:$tag"
            ;;
        "tag")
            local new_tag=$4
            log "${BLUE}Image tag'leniyor: $image:$tag -> $image:$new_tag${NC}"
            docker tag "$image:$tag" "$registry/$image:$new_tag"
            ;;
        *)
            log "${RED}Geçersiz Registry aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ İşlem başarılı${NC}"
        return 0
    else
        log "${RED}✗ İşlem başarısız${NC}"
        return 1
    fi
}

# Container monitoring
monitor_containers() {
    local container_name=$1

    log "${BLUE}Container monitoring başlatılıyor: $container_name${NC}"

    while true; do
        echo -e "\n${YELLOW}Container Metrikleri:${NC}"
        docker stats --no-stream "$container_name"

        echo -e "\n${YELLOW}Container Durumu:${NC}"
        docker inspect --format='{{.State.Status}}' "$container_name"

        echo -e "\n${YELLOW}Container Logları (son 5 satır):${NC}"
        docker logs --tail 5 "$container_name"

        sleep 5
        clear
    done
}

# Container backup
backup_container() {
    local container=$1
    local backup_name="container_${container}_$(date +%Y%m%d_%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"

    log "${BLUE}Container yedeği alınıyor: $container${NC}"

    # Container commit
    docker commit "$container" "backup/$container"

    # Image'i kaydet
    docker save "backup/$container" | gzip > "$backup_path.tar.gz"

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ Container yedeği başarıyla alındı: $backup_path.tar.gz${NC}"
        # Geçici image'i sil
        docker rmi "backup/$container"
        return 0
    else
        log "${RED}✗ Container yedeği alınamadı${NC}"
        return 1
    fi
}

# Container network yönetimi
manage_network() {
    local action=$1
    local network=$2

    case $action in
        "create")
            log "${BLUE}Network oluşturuluyor: $network${NC}"
            docker network create "$network"
            ;;
        "remove")
            log "${YELLOW}Network siliniyor: $network${NC}"
            docker network rm "$network"
            ;;
        "connect")
            local container=$3
            log "${BLUE}Container network'e bağlanıyor: $container -> $network${NC}"
            docker network connect "$network" "$container"
            ;;
        "disconnect")
            local container=$3
            log "${BLUE}Container network'ten çıkarılıyor: $container -> $network${NC}"
            docker network disconnect "$network" "$container"
            ;;
        "inspect")
            docker network inspect "$network"
            ;;
        *)
            log "${RED}Geçersiz Network aksiyonu: $action${NC}"
            return 1
            ;;
    esac

    if [ $? -eq 0 ]; then
        log "${GREEN}✓ İşlem başarılı${NC}"
        return 0
    else
        log "${RED}✗ İşlem başarısız${NC}"
        return 1
    fi
}

# Ana menü
show_menu() {
    echo -e "\n${YELLOW}Container Yönetim Menüsü${NC}"
    echo "1. Docker Container Yönetimi"
    echo "2. Kubernetes Pod Yönetimi"
    echo "3. Docker Compose Yönetimi"
    echo "4. Container Registry Yönetimi"
    echo "5. Container Monitoring"
    echo "6. Container Backup"
    echo "7. Container Network Yönetimi"
    echo "8. Çıkış"
}

# Dizinleri oluştur
mkdir -p "$CONFIG_DIR" "$LOGS_DIR" "$COMPOSE_DIR" "$BACKUP_DIR"

# Ana döngü
while true; do
    show_menu
    read -p "Seçiminiz (1-8): " choice

    case $choice in
        1)
            echo -e "\n${YELLOW}Docker Container Yönetimi${NC}"
            echo "1. Container Başlat"
            echo "2. Container Durdur"
            echo "3. Container Yeniden Başlat"
            echo "4. Container Sil"
            echo "5. Container Logları"
            read -p "Seçiminiz (1-5): " docker_choice
            read -p "Container adı: " container_name

            case $docker_choice in
                1) manage_docker "start" "$container_name" ;;
                2) manage_docker "stop" "$container_name" ;;
                3) manage_docker "restart" "$container_name" ;;
                4) manage_docker "remove" "$container_name" ;;
                5) manage_docker "logs" "$container_name" ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        2)
            echo -e "\n${YELLOW}Kubernetes Pod Yönetimi${NC}"
            echo "1. Pod Bilgisi"
            echo "2. Pod Logları"
            echo "3. Pod Shell"
            echo "4. Pod Sil"
            read -p "Seçiminiz (1-4): " k8s_choice
            read -p "Pod adı: " pod_name
            read -p "Namespace (varsayılan: default): " namespace

            case $k8s_choice in
                1) manage_kubernetes "describe" "$pod_name" "${namespace:-default}" ;;
                2) manage_kubernetes "logs" "$pod_name" "${namespace:-default}" ;;
                3) manage_kubernetes "exec" "$pod_name" "${namespace:-default}" ;;
                4) manage_kubernetes "delete" "$pod_name" "${namespace:-default}" ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        3)
            echo -e "\n${YELLOW}Docker Compose Yönetimi${NC}"
            echo "1. Compose Up"
            echo "2. Compose Down"
            echo "3. Compose Restart"
            echo "4. Compose Logs"
            read -p "Seçiminiz (1-4): " compose_choice
            read -p "Proje adı: " project_name

            case $compose_choice in
                1) manage_compose "up" "$project_name" ;;
                2) manage_compose "down" "$project_name" ;;
                3) manage_compose "restart" "$project_name" ;;
                4) manage_compose "logs" "$project_name" ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        4)
            echo -e "\n${YELLOW}Container Registry Yönetimi${NC}"
            echo "1. Image Push"
            echo "2. Image Pull"
            echo "3. Image Tag"
            read -p "Seçiminiz (1-3): " registry_choice
            read -p "Image adı: " image_name
            read -p "Tag (varsayılan: latest): " image_tag
            read -p "Registry (varsayılan: docker.io): " registry_url

            case $registry_choice in
                1) manage_registry "push" "$image_name" "${image_tag:-latest}" "${registry_url:-docker.io}" ;;
                2) manage_registry "pull" "$image_name" "${image_tag:-latest}" "${registry_url:-docker.io}" ;;
                3)
                    read -p "Yeni tag: " new_tag
                    manage_registry "tag" "$image_name" "${image_tag:-latest}" "$new_tag"
                    ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        5)
            read -p "Container adı: " container_name
            monitor_containers "$container_name"
            ;;
        6)
            read -p "Container adı: " container_name
            backup_container "$container_name"
            ;;
        7)
            echo -e "\n${YELLOW}Container Network Yönetimi${NC}"
            echo "1. Network Oluştur"
            echo "2. Network Sil"
            echo "3. Container Network'e Bağla"
            echo "4. Container Network'ten Çıkar"
            echo "5. Network Bilgisi"
            read -p "Seçiminiz (1-5): " network_choice
            read -p "Network adı: " network_name

            case $network_choice in
                1) manage_network "create" "$network_name" ;;
                2) manage_network "remove" "$network_name" ;;
                3)
                    read -p "Container adı: " container_name
                    manage_network "connect" "$network_name" "$container_name"
                    ;;
                4)
                    read -p "Container adı: " container_name
                    manage_network "disconnect" "$network_name" "$container_name"
                    ;;
                5) manage_network "inspect" "$network_name" ;;
                *) echo -e "${RED}Geçersiz seçim!${NC}" ;;
            esac
            ;;
        8)
            exit 0
            ;;
        *)
            echo -e "${RED}Geçersiz seçim!${NC}"
            ;;
    esac
done
