# Comando de ejecucion de la imagen de postgres

```bash
# Crear y ejecutar la imagen de postgres
docker-compose up -d
```

```bash
# Crear y ejecutar la imagen de postgres de forma manual
docker run --name ecommerce_postgres -e POSTGRES_USER=linktic_user -e POSTGRES_PASSWORD=w6T07nT4P4Lo -e POSTGRES_DB=technical_assessment_db -p 5432:5433 -d postgres:15-alpine
```
