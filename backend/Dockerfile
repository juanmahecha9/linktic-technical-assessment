# --- Etapa 1: Construcción (Builder) ---
FROM node:20-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de definición de dependencias
# Usamos comodines (*) para que no falle si no encuentra el lockfile
COPY package.json pnpm-lock.yaml* ./

# Instalar todas las dependencias (incluyendo devDependencies para build)
RUN pnpm install

# Copiar el resto del código fuente del backend
COPY . .

# Ejecutar el build de NestJS (genera la carpeta dist)
RUN pnpm run build

# --- Etapa 2: Producción (Runner) ---
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar solo lo necesario desde el builder para que la imagen sea ligera
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Variable de entorno para el puerto (Render/Railway suelen usar la que tú definas)
ENV PORT=5000
EXPOSE 5000

# Comando final para arrancar la aplicación
CMD ["node", "dist/main"]