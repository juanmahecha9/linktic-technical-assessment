# Stage 1: Build
FROM node:20-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

WORKDIR /app

# Copiar package.json y el lockfile SOLO si existe (el * evita el error)
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias (quitamos --frozen-lockfile para evitar errores de mismatch)
RUN pnpm install

# Copiar el resto del código
COPY . .

# Construir la aplicación
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# No necesitas pnpm en producción si solo vas a ejecutar 'node dist/main'
# pero dejamos la imagen limpia

# Copiar solo lo necesario desde el builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exponer el puerto que configuraste en Nest (asegurate que sea el mismo)
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]