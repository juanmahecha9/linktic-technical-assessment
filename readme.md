# Backend E-commerce - Prueba Técnica Linktic

Este proyecto consiste en una plataforma de e-commerce simplificada desarrollada con NestJS, PostgreSQL y TypeORM, enfocada en la robustez, escalabilidad y buenas prácticas de desarrollo.

## Instrucciones de Instalación

1. Clonar el repositorio.
2. Contar con Node.js (v20 recomendado) y pnpm configurado.
3. Ingresar al directorio del backend:
   ```bash
   cd backend
   ```
4. Instalar las dependencias:
   ```bash
   pnpm install
   ```
5. Configurar las variables de entorno en un archivo `.env` (se puede usar el archivo `.env.dev` como referencia).

## Despliegue en Producción

La aplicación está desplegada en **Vercel** y disponible en la siguiente URL:

**https://linktic-technical-assessment.vercel.app/**

## Pasos para Ejecutar el Proyecto

### Localmente con Docker (Recomendado)
Para levantar el ecosistema completo (aplicación y base de datos):
```bash
docker-compose up --build
```
La aplicación estará disponible en `http://localhost:5000`.

### Localmente con NestJS
Si prefieres correr la base de datos de manera independiente:
1. Iniciar la base de datos PostgreSQL.
2. Ejecutar el comando de desarrollo:
   ```bash
   pnpm run start:dev
   ```

## Explicación de la Arquitectura

El proyecto sigue una arquitectura de Monolito Modular, facilitando una futura transición a microservicios si fuese necesario. Se organiza en tres dominios principales:

- **Auth**: Gestión de usuarios y autenticación. Utiliza el esquema `auth` en la base de datos para separar los datos sensibles de la lógica de negocio.
- **Products**: Gestión del catálogo de productos. Opera bajo el esquema `transactions`.
- **Orders**: Gestión de pedidos, stock y transacciones comerciales. También opera bajo el esquema `transactions`.

Se utiliza un servicio base genérico (`BaseService`) para centralizar las operaciones CRUD comunes y el manejo de excepciones, garantizando consistencia en toda la aplicación.

## Decisiones Técnicas Relevantes

### 1. Manejo de Esquemas en PostgreSQL
Se optó por utilizar esquemas lógicos (`auth` y `transactions`) para organizar la base de datos. Esto permite una mejor gestión de permisos y una separación clara entre la infraestructura de identidad y la de negocio.

### 2. Seguridad y Autenticación
Se implementó JWT (JSON Web Tokens) con Passport para proteger los endpoints. Se utiliza un `AuthGuard` global y un decorador personalizado `@Public()` para facilitar la gestión de rutas abiertas vs protegidas sin repetir código.

### 3. Transacciones Atómicas en Órdenes
Para la creación de órdenes, se utiliza `DataSource.createQueryRunner` de TypeORM. Esto garantiza que la creación del pedido, el registro de los items y la actualización del stock del producto ocurran dentro de una transacción ácida. Si falla la validación de stock o cualquier paso intermedio, la operación se revierte por completo.

### 4. Estandarización de Errores
Se implementó un patrón estricto de `try/catch` en la capa de servicios, donde se capturan errores de base de datos y se transforman en excepciones de NestJS (`NotFoundException`, `BadRequestException`, etc.) con mensajes claros para el cliente final.

### 5. Documentación con Swagger
Toda la API está documentada utilizando Swagger (OpenAPI 3.0), accesible en `/api/docs` una vez que la aplicación esté corriendo. Esto facilita enormemente el testing y la integración con el frontend.

## Estructura de Directorios

- **`backend/`**: Código fuente de NestJS, configuración de Docker y documentación.
- **`container/`**: Archivos Docker para la base de datos PostgreSQL.
- **`http-collection/`**: Colecciones de Bruno y recursos de la herramienta Kayser para pruebas de carga.

## Pruebas de la API

Las pruebas de los endpoints se encuentran disponibles en los **environments de Bruno** y en la **colección HTTP** ubicada en el directorio `http-collection/`. Estas colecciones incluyen los requests preconfigurados para probar todos los endpoints de la API, tanto en entorno local como en producción (Vercel).
