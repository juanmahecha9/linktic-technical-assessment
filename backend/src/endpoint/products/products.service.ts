import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { BaseService } from '../../core/base/base.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService extends BaseService<Product> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    super(productRepository, 'Products');
  }

  // Metodo de creacion de productos
  async createProduct(data: CreateProductDto): Promise<Product> {
    try {
      //-> Validar que el nombre del producto no exista (Validar en Upper para evitar duplicidad)
      const existingProduct = await this.productRepository.findOne({
        where: { name: data.name.toUpperCase() },
      });

      if (existingProduct) {
        //-> Se lanza una excepcion si el producto ya existe
        throw new BadRequestException('El producto ya existe');
      }

      //-> Se crea el producto con el nombre en UpperCase
      const product = this.productRepository.create({
        ...data,
        name: data.name.toUpperCase(),
      });
      return await this.productRepository.save(product);
    } catch (error) {
      this.logger.error('Error al crear el producto', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new HttpException(
        'Error al crear el producto',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
