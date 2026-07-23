# syntax=docker/dockerfile:1.7

# ---------- builder --------------------------------------------------------
FROM node:20-alpine AS builder

# pnpm via corepack (no necesidad de instalar globalmente)
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH
RUN corepack enable

WORKDIR /app

# Cache de dependencias: copiar solo los lockfiles primero
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# El resto del código
COPY . .

RUN pnpm build

# ---------- runtime --------------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Sustituir la config por defecto por una con cache agresivo + gzip + SPA fallback
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar SOLO el output estático desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Etiquetas OCI
LABEL org.opencontainers.image.title="daigram" \
      org.opencontainers.image.description="Editor de diagramas animados de arquitectura, 100% client-side." \
      org.opencontainers.image.source="https://github.com/Bymatt10/daigram" \
      org.opencontainers.image.licenses="MIT"

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]