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


// Дополнительный DTO для изображений (если нужно)
export class ImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  alt?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Название товара обязательно' })
  title: string; // Пример: "Болт М10x50 оцинкованный"

  @IsString()
  @IsOptional()
  description?: string; // Пример: "Болт с шестигранной головкой, класс прочности 8.8"

  @IsNumber()
  @IsPositive({ message: 'Цена должна быть положительной' })
  price: string; // Пример: 15.99

  @IsEnum(ProductCategory, {
    message: `Категория должна быть одним из: ${Object.values(ProductCategory).join(', ')}`
  })
  @IsNotEmpty()
  category: ProductCategory; // Пример: ProductCategory.FASTENERS

  @IsString()
  @IsOptional()
  subcategory?: string; // Пример: "Болты"

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty()
  @IsOptional()
  keywords?: string[]; // Пример: ["болт", "м10", "крепёж"]

  @IsString()
  @IsOptional()
  subtitle?: string; // Пример: "Оцинкованный"

  @IsString()
  @IsOptional()
  brand?: string; // Пример: "Зубр"

  @IsString()
  @IsOptional()
  material?: string; // Пример: "сталь"

  @IsString()
  @IsOptional()
  weight?: string; // Пример: "0.1 кг"

  @IsString()
  @IsOptional()
  dimensions?: string; // Пример: "10x50 мм"

  @IsNumber()
  @IsPositive()
  @IsOptional()
  quantity?: number = 0; // Дефолтное значение: 0

  // Для загрузки изображений (опционально)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @IsOptional()
  images?: ImageDto[];
}