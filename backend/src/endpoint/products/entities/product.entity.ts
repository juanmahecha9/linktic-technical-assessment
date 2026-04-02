import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products', schema: 'transactions' })
export class Product {
  @ApiProperty({ example: '550e8400-e29b-41d2-a716-446655440003' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Smartphone' })
  @Column()
  name: string;

  @ApiProperty({ example: 'Latest generation smartphone' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: 999.99 })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ example: 100 })
  @Column({ type: 'int', default: 0 })
  stock: number;
}
