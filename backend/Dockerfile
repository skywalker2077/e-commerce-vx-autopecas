# VX Autopeças Backend - Dockerfile Multi-stage
# Base: Red Hat Enterprise Linux 9 com Node.js

# Stage 1: Build dependencies
FROM registry.access.redhat.com/ubi9/nodejs-18:latest AS builder

# Metadados da imagem
LABEL maintainer="VX Autopeças <contato@vxautopecas.com.br>"
LABEL description="Backend API Node.js para e-commerce VX Autopeças"
LABEL version="1.0.0"

# Usuário root temporário para instalações
USER root

# Instalar dependências do sistema para build
RUN dnf update -y && \
    dnf install -y \
        git \
        python3 \
        make \
        gcc-c++ \
        && \
    dnf clean all && \
    rm -rf /var/cache/dnf

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo dev)
RUN npm ci --silent

# Copiar código fonte
COPY . .

# Stage 2: Production
FROM registry.access.redhat.com/ubi9/nodejs-18:latest AS production

USER root

# Instalar apenas dependências runtime necessárias
RUN dnf update -y && \
    dnf install -y \
        curl \
        postgresql \
        && \
    dnf clean all && \
    rm -rf /var/cache/dnf

# Configurar diretório de trabalho
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production --silent && \
    npm cache clean --force

# Copiar código do stage builder
COPY --from=builder /app .

# Criar usuário não-privilegiado
RUN adduser -r -s /bin/false vxuser && \
    mkdir -p /app/uploads && \
    chown -R vxuser:vxuser /app

# Mudar para usuário não-root
USER vxuser

# Expor porta
EXPOSE 3001

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3001/api/health || exit 1

# Comando de inicialização
CMD ["npm", "start"]

# Stage 3: Development (opcional)
FROM builder AS development

USER root

# Instalar nodemon globalmente
RUN npm install -g nodemon

# Voltar para usuário padrão
USER default

# Configurar variáveis de ambiente para dev
ENV NODE_ENV=development
ENV PORT=3001

# Expor porta
EXPOSE 3001

# Comando de desenvolvimento
CMD ["npm", "run", "dev"]