import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductCategory } from '../entities/product.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty({
    example: 'https://example.com/images/bolt.jpg',
    description: 'URL изображения товара',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 'Болт М10x50',
    description: 'Альтернативный текст изображения',
    required: false
  })
  @IsString()
  @IsOptional()
  alt?: string;
}

export class CreateProductDto {
  @ApiProperty({
    example: 'Болт М10x50 оцинкованный',
    description: 'Название товара',
    required: true
  })
  @IsString()
  @IsNotEmpty({ message: 'Название товара обязательно' })
  title: string;

  @ApiProperty({
    example: 'Болт с шестигранной головкой, класс прочности 8.8',
    description: 'Подробное описание товара',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '15.99',
    description: 'Цена товара',
    required: true,
    type: String
  })
  @IsNumber()
  @IsPositive({ message: 'Цена должна быть положительной' })
  price: string;

  @ApiProperty({
    enum: ProductCategory,
    example: ProductCategory.FASTENERS,
    description: 'Категория товара',
    required: true
  })
  @IsEnum(ProductCategory, {
    message: `Категория должна быть одним из: ${Object.values(ProductCategory).join(', ')}`
  })
  @IsNotEmpty()
  category: ProductCategory;

  @ApiProperty({
    example: 'Болты',
    description: 'Подкатегория товара',
    required: false
  })
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiProperty({
    example: ['болт', 'м10', 'крепёж'],
    description: 'Ключевые слова для поиска',
    required: false,
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  keywords?: string[];

  @ApiProperty({
    example: 'Оцинкованный',
    description: 'Короткое дополнение к названию',
    required: false
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({
    example: 'Зубр',
    description: 'Производитель товара',
    required: false
  })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({
    example: 'сталь',
    description: 'Материал изготовления',
    required: false
  })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty({
    example: '0.1 кг',
    description: 'Вес товара с упаковкой',
    required: false
  })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiProperty({
    example: '10x50 мм',
    description: 'Габариты товара',
    required: false
  })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiProperty({
    example: 100,
    description: 'Количество товара на складе',
    required: false,
    default: 0
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number = 0;

  @ApiProperty({
    type: [ImageDto],
    description: 'Изображения товара',
    required: false,
    example: [{ url: 'https://example.com/image1.jpg', alt: 'Болт М10' }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @IsOptional()
  images?: ImageDto[];
}