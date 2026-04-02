import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrderItem } from './order-item.entity';

@Entity({ name: 'orders', schema: 'transactions' })
export class Order {
  @ApiProperty({ example: '550e8400-e29b-41d2-a716-446655440005' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 450.50 })
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_amount: number;

  @ApiProperty({ example: '2026-04-01T22:15:00Z' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '550e8400-e29b-41d2-a716-446655440000' })
  @Column({ name: 'user_id' })
  user_id: string; // Relación con el usuario que realizó la orden

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
