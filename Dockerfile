# VX Autopeças Frontend - Dockerfile
# Base: Red Hat Enterprise Linux 9 com Node.js

FROM registry.access.redhat.com/ubi9/nodejs-18:latest

# Metadados da imagem
LABEL maintainer="VX Autopeças <contato@vxautopecas.com.br>"
LABEL description="Frontend Next.js para e-commerce VX Autopeças"
LABEL version="1.0.0"

# Usuário não-root para segurança
USER root

# Instalar dependências do sistema
RUN dnf update -y && \
    dnf install -y \
        git \
        curl \
        && \
    dnf clean all && \
    rm -rf /var/cache/dnf

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.js ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Instalar dependências
RUN npm ci --only=production --silent

# Copiar código fonte
COPY src/ ./src/
COPY public/ ./public/

# Build da aplicação Next.js
RUN npm run build

# Criar usuário não-privilegiado
RUN adduser -r -s /bin/false vxuser && \
    chown -R vxuser:vxuser /app

# Mudar para usuário não-root
USER vxuser

# Expor porta
EXPOSE 3000

# Configurar variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de inicialização
CMD ["npm", "start"]