import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva orden de compra (Protegido)' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Stock insuficiente o datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar historial de compras del usuario (Protegido)' })
  @ApiResponse({ status: 200, description: 'Lista de órdenes del usuario.' })
  findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.ordersService.findAll(userId);
  }
}
