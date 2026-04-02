import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import helmet from 'helmet';
import { corsConfig } from './config/cors/cors';
import express from 'express';

function configureApp(app: INestApplication) {
  const logger = new Logger('Main');

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
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: (origin, callback) => {
      logger.debug('CORS origin:', origin);
      if (!origin || origin.includes('localhost')) {
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
  app.use(helmet());
}

// Vercel serverless handler
const server = express();
let appInitialized = false;

const bootstrapServer = createNestServer(server);

async function createNestServer(expressInstance: express.Express) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  configureApp(app);
  await app.init();
  appInitialized = true;
  new Logger('Main').log('Nest application initialized for Vercel');
}

export default async (req: express.Request, res: express.Response) => {
  if (!appInitialized) {
    await bootstrapServer;
  }
  server(req, res);
};

// Local development
if (process.env.NODE_ENV !== 'production') {
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    configureApp(app);
    const configService = app.get(ConfigService);
    const PORT = Number(configService.get<string>('PORT')) || 4000;
    await app.listen(PORT, () => {
      new Logger('Main').log(`App_server: Running on port ${PORT}`);
    });
  }
  bootstrap();
}
