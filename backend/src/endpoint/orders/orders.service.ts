import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const itemInput of createOrderDto.products) {
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: itemInput.productId },
        });

        if (!product) {
          throw new NotFoundException(
            `Producto con ID ${itemInput.productId} no encontrado.`,
          );
        }

        if (product.stock < itemInput.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}, Solicitado: ${itemInput.quantity}`,
          );
        }

        // Calcular total y restar stock
        totalAmount += Number(product.price) * itemInput.quantity;
        product.stock -= itemInput.quantity;
        await queryRunner.manager.save(product);

        // Crear item de la orden
        const orderItem = new OrderItem();
        orderItem.product_id = product.id;
        orderItem.quantity = itemInput.quantity;
        orderItem.price_at_purchase = Number(product.price);
        orderItems.push(orderItem);
      }

      const order = new Order();
      order.user_id = userId;
      order.total_amount = totalAmount;
      order.items = orderItems;

      const savedOrder = await queryRunner.manager.save(Order, order);

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Error al crear la orden de compra', error);

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      throw new HttpException(
        'Error interno al procesar la orden de compra.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: { user_id: userId },
        relations: ['items', 'items.product'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error('Error al obtener el historial de órdenes', error);
      throw new HttpException(
        'Error interno al obtener el historial de órdenes.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
