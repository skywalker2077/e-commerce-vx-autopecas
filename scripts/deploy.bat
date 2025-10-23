@echo off
REM Script para build e deploy do VX Autopeças no Windows

echo 🚀 VX Autopeças - Build e Deploy Docker
echo ======================================

REM Função para mostrar ajuda
if "%1"=="help" goto show_help
if "%1"=="" goto show_help
if "%1"=="build" goto build_images
if "%1"=="dev" goto start_dev
if "%1"=="prod" goto start_prod
if "%1"=="stop" goto stop_containers
if "%1"=="clean" goto clean_all
if "%1"=="logs" goto show_logs
if "%1"=="restart" goto restart_services

:show_help
echo Uso: %0 [COMANDO]
echo.
echo Comandos disponíveis:
echo   build       - Build das imagens Docker
echo   dev         - Iniciar ambiente de desenvolvimento
echo   prod        - Iniciar ambiente de produção
echo   stop        - Parar todos os containers
echo   clean       - Limpar containers e imagens
echo   logs        - Mostrar logs dos containers
echo   restart     - Reiniciar todos os serviços
echo   help        - Mostrar esta ajuda
echo.
goto end

:build_images
echo 📦 Fazendo build das imagens Docker...
echo 🔨 Frontend (Next.js)...
docker build -t vx-autopecas/frontend:latest .
echo 🔨 Backend (Node.js)...
docker build -t vx-autopecas/backend:latest ./backend
echo ✅ Build concluído!
goto end

:start_dev
echo 🛠️ Iniciando ambiente de desenvolvimento...
docker-compose -f docker-compose.dev.yml up --build -d
echo ✅ Ambiente de desenvolvimento iniciado!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3001
echo 🗄️ PostgreSQL: localhost:5432
goto end

:start_prod
echo 🚀 Iniciando ambiente de produção...
docker-compose up --build -d
echo ✅ Ambiente de produção iniciado!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3001
echo 🗄️ PostgreSQL: localhost:5432
echo 🔄 Nginx: http://localhost:80
goto end

:stop_containers
echo ⏹️ Parando containers...
docker-compose down
docker-compose -f docker-compose.dev.yml down
echo ✅ Containers parados!
goto end

:clean_all
echo 🧹 Limpando containers e imagens...
call :stop_containers
docker container prune -f
docker rmi vx-autopecas/frontend:latest 2>nul
docker rmi vx-autopecas/backend:latest 2>nul
echo ⚠️ Para remover volumes do banco, execute:
echo docker volume rm vx_autopecas_postgres_data
echo docker volume rm vx_autopecas_redis_data
echo ✅ Limpeza concluída!
goto end

:show_logs
echo 📋 Logs dos containers...
echo Pressione Ctrl+C para sair
docker-compose logs -f
goto end

:restart_services
echo 🔄 Reiniciando serviços...
call :stop_containers
timeout /t 2 /nobreak > nul
call :start_prod
goto end

:end
pause