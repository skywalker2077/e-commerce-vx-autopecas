# VX Autopeças - E-commerce

> Plataforma completa de e-commerce para venda de autopeças, desenvolvida com Next.js, Node.js e PostgreSQL.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 16** - Framework React com SSR/SSG
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos
- **ESLint** - Linting e qualidade de código

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **JSON Web Tokens** - Autenticação
- **Bcrypt** - Criptografia de senhas
- **Helmet** - Segurança HTTP

### DevOps & Ferramentas
- **Docker** (recomendado para PostgreSQL)
- **Git** - Controle de versão
- **VS Code** - Editor recomendado

## 🎨 Design

O site utiliza uma paleta de cores profissional:
- **Preto** (#0f172a) - Headers e elementos principais
- **Azul** (#3b82f6) - Call-to-actions e destaque
- **Branco** (#ffffff) - Backgrounds e texto
- **Cinza** (várias tonalidades) - Elementos secundários

## 📋 Funcionalidades

### Para Clientes
- ✅ Catálogo de produtos com filtros
- ✅ Busca avançada por marca, modelo, categoria
- ✅ Página de detalhes do produto
- ✅ Carrinho de compras
- ✅ Sistema de avaliações
- ✅ Checkout simplificado
- ✅ Histórico de pedidos

### Para Administradores
- ✅ Painel administrativo completo
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Controle de estoque
- ✅ Gestão de categorias
- ✅ Relatórios de vendas
- ✅ Dashboard com métricas

### Recursos Técnicos
- ✅ API REST completa
- ✅ Autenticação JWT
- ✅ Criptografia de senhas
- ✅ Rate limiting
- ✅ Validação de dados
- ✅ Paginação
- ✅ Soft delete
- ✅ Índices otimizados

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- PostgreSQL 12+
- npm ou yarn
- Docker e Docker Compose (para containerização)

## 🐋 Execução com Docker (Recomendado)

### Opção 1: Docker Compose

#### Ambiente de Desenvolvimento
```bash
# Iniciar apenas banco de dados e backend
docker-compose -f docker-compose.dev.yml up -d

# Ou usar o script helper
.\scripts\deploy.bat dev  # Windows
./scripts/deploy.sh dev   # Linux/Mac
```

#### Ambiente de Produção Completo
```bash
# Iniciar todos os serviços (Frontend, Backend, PostgreSQL, Redis, Nginx)
docker-compose up --build -d

# Ou usar o script helper
.\scripts\deploy.bat prod  # Windows
./scripts/deploy.sh prod   # Linux/Mac
```

### Opção 2: Containers Individuais

#### 1. Banco de Dados PostgreSQL
```bash
docker run -d \
  --name vx-autopecas-db \
  -e POSTGRES_DB=vx_autopecas \
  -e POSTGRES_USER=vxuser \
  -e POSTGRES_PASSWORD=vx_secure_password \
  -p 5432:5432 \
  postgres:15-alpine
```

#### 2. Backend API
```bash
# Build da imagem
docker build -t vx-autopecas/backend ./backend

# Executar container
docker run -d \
  --name vx-autopecas-api \
  --link vx-autopecas-db:database \
  -e DB_HOST=database \
  -e DB_USER=vxuser \
  -e DB_PASSWORD=vx_secure_password \
  -e DB_NAME=vx_autopecas \
  -e JWT_SECRET=jwt_secret_key \
  -p 3001:3001 \
  vx-autopecas/backend
```

#### 3. Frontend Next.js
```bash
# Build da imagem
docker build -t vx-autopecas/frontend .

# Executar container
docker run -d \
  --name vx-autopecas-web \
  --link vx-autopecas-api:backend \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  -p 3000:3000 \
  vx-autopecas/frontend
```

### Scripts de Deploy Disponíveis

#### Windows
```cmd
# Ver todos os comandos
.\scripts\deploy.bat help

# Build das imagens
.\scripts\deploy.bat build

# Ambiente de desenvolvimento
.\scripts\deploy.bat dev

# Ambiente de produção
.\scripts\deploy.bat prod

# Parar containers
.\scripts\deploy.bat stop

# Ver logs
.\scripts\deploy.bat logs

# Limpeza completa
.\scripts\deploy.bat clean
```

#### Linux/Mac
```bash
# Dar permissão de execução
chmod +x scripts/deploy.sh

# Ver todos os comandos
./scripts/deploy.sh help

# Build das imagens
./scripts/deploy.sh build

# Ambiente de desenvolvimento
./scripts/deploy.sh dev

# Ambiente de produção
./scripts/deploy.sh prod

# Parar containers
./scripts/deploy.sh stop

# Ver logs
./scripts/deploy.sh logs

# Limpeza completa
./scripts/deploy.sh clean
```

### Acessos com Docker

Após iniciar os containers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432
- **Nginx (Produção)**: http://localhost:80
- **Admin**: http://localhost:3000/admin
  - Email: admin@vxautopecas.com
  - Senha: admin123

### Monitoramento

#### Verificar status dos containers
```bash
docker-compose ps
```

#### Ver logs em tempo real
```bash
docker-compose logs -f
```

#### Acessar container
```bash
# Backend
docker exec -it vx-autopecas-api sh

# Frontend
docker exec -it vx-autopecas-web sh

# Database
docker exec -it vx-autopecas-db psql -U vxuser -d vx_autopecas
```

## 🛠️ Instalação Manual (Sem Docker)

### 1. Clone o repositório
```bash
git clone [URL_DO_REPOSITORIO]
cd e-commerce-vx-autopecas
```

### 2. Configuração do Backend

```bash
cd backend
npm install
```

#### Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vx_autopecas
DB_USER=postgres
DB_PASSWORD=sua_senha
JWT_SECRET=sua_chave_jwt_muito_segura
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Inicializar banco de dados
```bash
npm run init-db
```

#### Iniciar servidor backend
```bash
npm run dev
```

### 3. Configuração do Frontend

```bash
# Na raiz do projeto
npm install
npm run dev
```

## 🏗️ Arquitetura Docker

### Imagens Base
- **Frontend**: Red Hat UBI 9 + Node.js 18
- **Backend**: Red Hat UBI 9 + Node.js 18
- **Database**: PostgreSQL 15 Alpine
- **Cache**: Redis 7 Alpine
- **Proxy**: Nginx Alpine

### Rede e Comunicação
```
┌─────────────────────────────────────────────┐
│                 Nginx Proxy                 │
│            (Load Balancer)                  │
│              Port: 80/443                   │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
┌───▼────┐          ┌────▼────┐
│Frontend│          │ Backend │
│Next.js │          │Node.js  │
│Port:3000│◄────────►│Port:3001│
└────────┘          └─────┬───┘
                          │
                    ┌─────▼──┐    ┌───────┐
                    │PostgreSQL   │ Redis │
                    │Port:5432│   │Port:6379
                    └─────────┘   └───────┘
```

### Volumes Persistentes
- `postgres_data`: Dados do PostgreSQL
- `redis_data`: Cache Redis
- `uploads`: Arquivos enviados

### Variáveis de Ambiente
Configuradas no `docker-compose.yml`:
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`
- `JWT_SECRET`
- `NODE_ENV`
- `FRONTEND_URL`

## 🔧 Scripts Disponíveis

### Frontend
- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Inicia servidor de produção
- `npm run lint` - Executa linting

### Backend
- `npm run dev` - Inicia servidor com nodemon
- `npm start` - Inicia servidor de produção
- `npm run init-db` - Inicializa banco de dados

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

#### users
- id, name, email, password, phone, role, timestamps

#### categories
- id, name, slug, description, image_url, active, timestamps

#### products
- id, name, description, price, stock, category_id, brand, model, part_number, images, active, timestamps

#### orders
- id, user_id, total, status, shipping_address, payment_method, payment_status, tracking_code, timestamps

#### order_items
- id, order_id, product_id, quantity, price, timestamps

#### cart_items
- id, user_id, product_id, quantity, timestamps

## 🔐 Autenticação

### Usuário Administrador Padrão
- **Email:** admin@vxautopecas.com
- **Senha:** admin123

### Endpoints da API

#### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

#### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Buscar produto
- `POST /api/products` - Criar produto (admin)
- `PUT /api/products/:id` - Atualizar produto (admin)
- `DELETE /api/products/:id` - Remover produto (admin)

#### Categorias
- `GET /api/categories` - Listar categorias
- `GET /api/categories/:slug` - Buscar categoria

#### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/:id` - Buscar pedido específico

## 🚀 Deploy

### Frontend (Vercel)
```bash
npm run build
# Deploy na Vercel ou plataforma de sua escolha
```

### Backend (Railway/Heroku)
```bash
# Configurar variáveis de ambiente na plataforma
# Fazer deploy do diretório backend/
```

### Banco de Dados
- Recomendado: Railway PostgreSQL, Supabase ou Neon

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte técnico ou dúvidas:
- Email: contato@vxautopecas.com.br
- WhatsApp: (11) 9999-9999

## 🎯 Roadmap

### Próximas Funcionalidades
- [ ] Sistema de cupons de desconto
- [ ] Integração com gateway de pagamento
- [ ] Chat em tempo real
- [ ] Sistema de pontos/fidelidade
- [ ] App mobile (React Native)
- [ ] Integração com ERPs
- [ ] Sistema de afiliados

### Melhorias Técnicas
- [ ] Testes unitários e integração
- [ ] Docker compose
- [ ] CI/CD Pipeline
- [ ] Monitoramento e logs
- [ ] Cache Redis
- [ ] CDN para imagens

---

**VX Autopeças** - Qualidade e Confiança em Autopeças 🚗⚙️