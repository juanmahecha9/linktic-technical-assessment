# Technical Assessment Linktic - E-commerce Backend

Este es el backend para la plataforma de e-commerce simplificada, desarrollado con **NestJS**, **PostgreSQL** y **TypeORM**.

## Acceso a la Aplicación

La aplicación está configurada para correr en el puerto **5000** por defecto.

- **URL Base**: `http://localhost:5000/api/v1/technical-assessment`
- **Documentación Swagger**: `http://localhost:5000/api/docs`

---

## Instalación y Ejecución Local

1. Instalar dependencias:

```bash
pnpm install
```

2. Configurar el archivo `backend/.env` con las credenciales de tu base de datos (puedes usar el archivo `.env` local).

3. Correr en modo desarrollo:

```bash
pnpm run start:dev
```

---

## Dockerización (Recomendado)

Para levantar todo el stack de manera automática y consistente con las variables de entorno:

```bash
docker-compose up --build
```

> [!IMPORTANT]
> El archivo `docker-compose.yml` está configurado para leer automáticamente las variables de entorno desde **`./backend/.env`**, por lo que no es necesario pasar parámetros adicionales.

---

## Características principales

- **Arquitectura Modular**: Separación clara de responsabilidades entre Auth, Products y Orders.
- **Seguridad**: Implementación de JWT y encriptación de contraseñas con Bcrypt.
- **Base de Datos**: Uso de esquemas lógicos (`auth` y `transactions`) en PostgreSQL.
- **Validación**: Uso global de `class-validator` y `class-transformer`.
- **Swagger**: Documentación interactiva de todos los endpoints.
