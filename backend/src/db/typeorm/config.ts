import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENTITIES } from './entities';

const configService = new ConfigService();

export const TYPEORMCONFIG: TypeOrmModuleOptions = {
  type: 'postgres', // O 'mysql', 'sqlite', etc.
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: Number(configService.get<string>('DB_PORT')) || 5432, // Cambiar según el motor de BD
  username: configService.get<string>('DB_USER') || 'postgres',
  password: configService.get<string>('DB_PASSWORD') || 'postgres',
  database: configService.get<string>('DB_NAME') || 'postgres',
  autoLoadEntities: true, // Carga automática de entidades
  synchronize: false, // No usar en producción
  entities: ENTITIES,
};
