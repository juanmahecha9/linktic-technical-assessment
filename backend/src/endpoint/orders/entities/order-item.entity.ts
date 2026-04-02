import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from 'src/endpoint/products/entities/product.entity';

@Entity({ name: 'order_items', schema: 'transactions' })
export class OrderItem {
  @ApiProperty({ example: '550e8400-e29b-41d2-a716-446655440006' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 2 })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ example: 150.25 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_at_purchase: number; // Precio unitario en el momento de la compra

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  product_id: string;
}
