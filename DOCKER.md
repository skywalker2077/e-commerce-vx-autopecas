# VX Autopeças - Exemplo de Execução Docker

Este arquivo demonstra como executar o projeto VX Autopeças utilizando Docker.

## 🚀 Início Rápido

### 1. Executar com Docker Compose (Mais Fácil)

```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]
cd e-commerce-vx-autopecas

# Executar ambiente de desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# OU executar ambiente de produção completo
docker-compose up --build
```

### 2. Executar com Scripts Helper

#### No Windows:
```cmd
# Ambiente de desenvolvimento
scripts\deploy.bat dev

# Ambiente de produção
scripts\deploy.bat prod

# Ver logs
scripts\deploy.bat logs

# Parar tudo
scripts\deploy.bat stop
```

#### No Linux/Mac:
```bash
# Dar permissão
chmod +x scripts/deploy.sh

# Ambiente de desenvolvimento
./scripts/deploy.sh dev

# Ambiente de produção
./scripts/deploy.sh prod

# Ver logs
./scripts/deploy.sh logs

# Parar tudo
./scripts/deploy.sh stop
```

## 🔧 Comandos Úteis

### Verificar Status
```bash
docker-compose ps
```

### Ver Logs
```bash
# Todos os serviços
docker-compose logs -f

# Apenas o backend
docker-compose logs -f backend

# Apenas o frontend
docker-compose logs -f frontend
```

### Acessar Containers
```bash
# Backend
docker exec -it vx-autopecas-api-dev sh

# Banco de dados
docker exec -it vx-autopecas-db-dev psql -U postgres -d vx_autopecas
```

### Backup do Banco
```bash
docker exec vx-autopecas-db-dev pg_dump -U postgres vx_autopecas > backup.sql
```

### Restaurar Banco
```bash
docker exec -i vx-autopecas-db-dev psql -U postgres vx_autopecas < backup.sql
```

## 🌐 Acessos

Após iniciar os containers:

- **Site**: http://localhost:3000
- **API**: http://localhost:3001
- **Admin**: http://localhost:3000/admin
- **Health Check**: http://localhost:3001/api/health

### Credenciais Admin
- **Email**: admin@vxautopecas.com
- **Senha**: admin123

## 🔍 Troubleshooting

### Problema: Porta em uso
```bash
# Verificar o que está usando a porta
netstat -tulpn | grep :3000

# Parar containers existentes
docker-compose down
```

### Problema: Banco não conecta
```bash
# Verificar logs do banco
docker-compose logs database

# Reiniciar apenas o banco
docker-compose restart database
```

### Problema: Build falha
```bash
# Limpar tudo e reconstruir
docker-compose down -v
docker system prune -f
docker-compose up --build --force-recreate
```

### Problema: Espaço em disco
```bash
# Limpar imagens não utilizadas
docker image prune -f

# Limpar tudo (CUIDADO!)
docker system prune -af --volumes
```

## 📊 Monitoramento

### CPU e Memória
```bash
docker stats
```

### Espaço em Disco
```bash
docker system df
```

### Logs de Sistema
```bash
# Linux
sudo journalctl -u docker

# Windows
# Verificar Event Viewer
```

## 🔄 Atualizações

### Atualizar Apenas uma Imagem
```bash
# Frontend
docker-compose up --build frontend

# Backend
docker-compose up --build backend
```

### Atualizar Base de Dados
```bash
# Executar migrations
docker exec vx-autopecas-api-dev npm run migrate

# Ou reinicializar
docker exec vx-autopecas-api-dev npm run init-db
```

## 📝 Notas Importantes

1. **Desenvolvimento**: Use `docker-compose.dev.yml` para desenvolvimento
2. **Produção**: Use `docker-compose.yml` para produção
3. **Dados**: Os volumes persistem os dados do banco
4. **Performance**: No Windows, considere usar WSL2
5. **Segurança**: Altere as senhas padrão em produção