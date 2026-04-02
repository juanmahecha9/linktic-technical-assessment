# Prueba Técnica Linktic

Este es el repositorio para la prueba técnica de Linktic, enfocado en un microservicio de E-commerce simplificado, desarrollado con **NestJS**, **PostgreSQL** y **TypeORM**.

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- **`backend/`**: Núcleo de la aplicación NestJS.
  - Implementación de módulos: **Auth**, **Products** y **Orders**.
  - Arquitectura modular con separación clara de responsabilidades.
  - Gestión de esquemas de base de datos (`auth` y `transactions`).
  - Documentación Swagger integrada.
  - Archivos de Dockerización (`Dockerfile` y `docker-compose.yml`).
- **`container/`**: Recursos para la infraestructura de persistencia.
  - Configuraciones de Docker para el motor PostgreSQL.
  - Scripts SQL iniciales y de mantenimiento.
- **`http-collection/`**: Colecciones de pruebas para validación de endpoints.
  - Compatible con herramientas de testing como Bruno y la herramienta **Kayser**.
  - **`kayser/`**: Herramienta avanzada para peticiones HTTP y pruebas de carga/estrés (Desarrollada por el autor): [Kayser App](https://kayser-fawn.vercel.app/).

## Stack Tecnológico

- **Framework**: NestJS (Node.js)
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM
- **Seguridad**: JWT & Bcrypt
- **Documentación**: Swagger / OpenAPI
- **Contenedores**: Docker & Docker Compose
