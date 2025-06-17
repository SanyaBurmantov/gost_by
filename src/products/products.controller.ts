import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductCategory } from './entities/product.entity';

@Controller('api/parsed_products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Создание товара
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Получение всех товаров (с пагинацией и фильтрами)
  @Get()
  findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('category') category?: ProductCategory,
    @Query('subcategory') subcategory?: string,
  ) {
    return this.productsService.findAll({
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      category,
      subcategory,
    });
  }

  // Поиск товара по ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const product = await this.productsService.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  // Обновление товара
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  // Удаление товара
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }

  // Поиск по ключевому слову
  @Get('search/:keyword')
  searchByKeyword(@Param('keyword') keyword: string) {
    return this.productsService.searchByKeyword(keyword);
  }

  // Получение списка категорий
  @Get('categories/all')
  getCategories() {
    return this.productsService.getCategories();
  }
}