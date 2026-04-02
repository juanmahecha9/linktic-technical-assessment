import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { corsConfig } from './config/cors/cors';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = Number(configService.get<string>('PORT')) || 4000;

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('E-commerce Backend API')
    .setDescription('Technical Assessment Linktic - Backend E-commerce')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix('api/v1/technical-assessment');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Usa class-transformer para convertir los DTOs automáticamente
      whitelist: true, // Remueve propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza error si hay propiedades desconocidas
    }),
  );
  app.enableCors({
    origin: (origin, callback) => {
      logger.debug('CORS origin:', origin); // Mensaje de depuración para el origen
      if (!origin || origin.includes('localhost')) {
        //console.log('ALLOWED!');
        callback(null, true);
        return;
      }

      const allowedOrigins = corsConfig;
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['*'],
    exposedHeaders: ['*'],
  });
  app.use(helmet()); // Activar Helmet

  await app.listen(PORT, () => {
    logger.log(`App_server: Running on port ${PORT}`);
  });
}
bootstrap();
