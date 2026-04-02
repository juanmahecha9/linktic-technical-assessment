import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users', schema: 'authv2' })
export class User {
  @ApiProperty({ example: '550e8400-e29b-41d2-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  password_hash: string;
}
