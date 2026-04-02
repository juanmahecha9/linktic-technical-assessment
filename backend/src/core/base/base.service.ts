import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export abstract class BaseService<T> {
  protected logger: Logger;
  protected entityName: string; // Nombre de la entidad

  constructor(
    private readonly repository: Repository<T>,
    entityName: string,
  ) {
    this.entityName = entityName;
    this.logger = new Logger(entityName);
  }

  async findAll(): Promise<T[]> {
    try {
      return await this.repository.find();
    } catch (error) {
      this.logger.error(
        `Error al obtener todos los registros de ${this.entityName}`,
        error,
      );
      throw new HttpException(
        `Error al obtener todos los registros de ${this.entityName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string | number): Promise<T | null> {
    try {
      const entity = await this.repository.findOne({ where: { id } } as any);
      if (!entity) {
        throw new NotFoundException(
          `Registro con ID ${id} no encontrado en ${this.entityName}`,
        );
      }
      return entity;
    } catch (error) {
      this.logger.error(
        `Error al obtener el registro con ID ${id} en ${this.entityName}`,
        error,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        `Error al obtener el registro con ID ${id} en ${this.entityName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(data: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(data);
      return await this.repository.save(entity);
    } catch (error) {
      this.logger.error(
        `Error al crear un registro en ${this.entityName}`,
        error,
      );
      throw new HttpException(
        `Error al crear un registro en ${this.entityName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string | number, data: DeepPartial<T>): Promise<T> {
    try {
      await this.repository.update(id, data as any); // 🔥 Se castea para evitar error de TypeORM
      return await this.findOne(id);
    } catch (error) {
      this.logger.error(
        `Error al actualizar el registro con ID ${id} en ${this.entityName}`,
        error,
      );
      throw new HttpException(
        `Error al actualizar el registro con ID ${id} en ${this.entityName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string | number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      this.logger.error(
        `Error al eliminar el registro con ID ${id} en ${this.entityName}`,
        error,
      );
      throw new HttpException(
        `Error al eliminar el registro con ID ${id} en ${this.entityName}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
