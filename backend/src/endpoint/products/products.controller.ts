import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Public } from '../../core/decorators/public.decorator';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo producto (Protegido)' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todos los productos (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de productos.' })
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un producto (Público)' })
  @ApiResponse({ status: 200, description: 'Detalle del producto.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiBearerAuth()
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto (Protegido)' })
  @ApiResponse({
    status: 200,
    description: 'Producto actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }
}
