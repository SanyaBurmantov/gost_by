import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ProductCategory } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Создание товара
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        title: createProductDto.title,
        description: createProductDto.description,
        price: createProductDto.price,
        category: createProductDto.category,
        subcategory: createProductDto.subcategory,
        keywords: createProductDto.keywords,
        subtitle: createProductDto.subtitle,
        brand: createProductDto.brand,
        material: createProductDto.material,
        weight: createProductDto.weight,
        dimensions: createProductDto.dimensions,
        quantity: createProductDto.quantity || 0, // Дефолтное значение
      },
    });
  }

  // Получение всех товаров (с пагинацией и фильтрами)
  async findAll(params: {
    skip?: number;
    take?: number;
    category?: ProductCategory;
    subcategory?: string;
  }) {
    const { skip, take, category, subcategory } = params;
    return this.prisma.product.findMany({
      skip: skip || undefined,
      take: take || undefined,
      where: {
        category: category || undefined,
        subcategory: subcategory || undefined,
      },
      orderBy: {
        createdAt: 'desc', // Сортировка по новизне
      },
    });
  }

  // Поиск товара по ID
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Товар с ID ${id} не найден`);
    }

    return product;
  }

  // Обновление товара
  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id); // Проверка существования товара

    return this.prisma.product.update({
      where: { id },
      data: {
        title: updateProductDto.title,
        description: updateProductDto.description,
        price: updateProductDto.price,
        category: updateProductDto.category,
        subcategory: updateProductDto.subcategory,
        keywords: updateProductDto.keywords,
        subtitle: updateProductDto.subtitle,
        brand: updateProductDto.brand,
        material: updateProductDto.material,
        weight: updateProductDto.weight,
        dimensions: updateProductDto.dimensions,
        quantity: updateProductDto.quantity || 0, // Дефолтное значение
      },
    });
  }

  // Удаление товара
  async remove(id: string) {
    await this.findOne(id); // Проверка существования товара

    return this.prisma.product.delete({
      where: { id },
    });
  }

  // Дополнительные методы (примеры)
  async searchByKeyword(keyword: string) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
          {
            keywords: {
              has: keyword
            }
          },
        ],
      },
    });
  }

  async getCategories() {
    return Object.values(ProductCategory); // Если используется enum
  }
}