#!/bin/bash
# Script para build e deploy do VX Autopeças

set -e

echo "🚀 VX Autopeças - Build e Deploy Docker"
echo "======================================"

# Função para mostrar ajuda
show_help() {
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo "  build       - Build das imagens Docker"
    echo "  dev         - Iniciar ambiente de desenvolvimento"
    echo "  prod        - Iniciar ambiente de produção"
    echo "  stop        - Parar todos os containers"
    echo "  clean       - Limpar containers e imagens"
    echo "  logs        - Mostrar logs dos containers"
    echo "  restart     - Reiniciar todos os serviços"
    echo "  help        - Mostrar esta ajuda"
    echo ""
}

# Função para build das imagens
build_images() {
    echo "📦 Fazendo build das imagens Docker..."
    
    echo "🔨 Frontend (Next.js)..."
    docker build -t vx-autopecas/frontend:latest .
    
    echo "🔨 Backend (Node.js)..."
    docker build -t vx-autopecas/backend:latest ./backend
    
    echo "✅ Build concluído!"
}

# Função para ambiente de desenvolvimento
start_dev() {
    echo "🛠️ Iniciando ambiente de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml up --build -d
    echo "✅ Ambiente de desenvolvimento iniciado!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:3001"
    echo "🗄️ PostgreSQL: localhost:5432"
}

# Função para ambiente de produção
start_prod() {
    echo "🚀 Iniciando ambiente de produção..."
    docker-compose up --build -d
    echo "✅ Ambiente de produção iniciado!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:3001"
    echo "🗄️ PostgreSQL: localhost:5432"
    echo "🔄 Nginx: http://localhost:80"
}

# Função para parar containers
stop_containers() {
    echo "⏹️ Parando containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Containers parados!"
}

# Função para limpeza
clean_all() {
    echo "🧹 Limpando containers e imagens..."
    
    # Parar containers
    stop_containers
    
    # Remover containers
    docker container prune -f
    
    # Remover imagens
    docker rmi vx-autopecas/frontend:latest 2>/dev/null || true
    docker rmi vx-autopecas/backend:latest 2>/dev/null || true
    
    # Remover volumes (cuidado!)
    read -p "⚠️ Deseja remover os volumes do banco de dados? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker volume rm vx_autopecas_postgres_data 2>/dev/null || true
        docker volume rm vx_autopecas_redis_data 2>/dev/null || true
        echo "🗑️ Volumes removidos!"
    fi
    
    echo "✅ Limpeza concluída!"
}

# Função para mostrar logs
show_logs() {
    echo "📋 Logs dos containers..."
    echo "Pressione Ctrl+C para sair"
    docker-compose logs -f
}

# Função para reiniciar
restart_services() {
    echo "🔄 Reiniciando serviços..."
    stop_containers
    sleep 2
    start_prod
}

# Verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker não está rodando!"
        echo "Por favor, inicie o Docker e tente novamente."
        exit 1
    fi
}

# Main
main() {
    check_docker
    
    case "${1:-help}" in
        "build")
            build_images
            ;;
        "dev")
            start_dev
            ;;
        "prod")
            start_prod
            ;;
        "stop")
            stop_containers
            ;;
        "clean")
            clean_all
            ;;
        "logs")
            show_logs
            ;;
        "restart")
            restart_services
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"