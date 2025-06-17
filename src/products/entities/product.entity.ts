import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  IsEnum
} from 'class-validator';

// Перечисление категорий
export enum ProductCategory {
  FASTENERS = 'Крепеж и метизы',
  POWER_TOOLS = 'Электроинструмент',
  HAND_TOOLS = 'Ручной инструмент',
  WELDING = 'Сварочное оборудование',
  LADDERS = 'Стремянки и леса',
  FINISHING = 'Отделочные материалы',
  PLUMBING = 'Сантехника',
  ELECTRICAL = 'Электрика',
  SAFETY = 'Безопасность и спецодежда',
  BUILDING_MATERIALS = 'Строительные материалы',
}

@Entity() // Указывает, что это сущность TypeORM
export class Product {
  @PrimaryGeneratedColumn('uuid') // Уникальный ID (можно также 'increment')
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: 'Название товара обязательно' })
  title: string; // Пример: "Болт М10x50 оцинкованный"

  @Column({ type: 'text', nullable: true })
  @IsString()
  @IsOptional()
  description?: string; // Пример: "Болт с шестигранной головкой, класс прочности 8.8"

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNumber()
  @IsNotEmpty({ message: 'Цена обязательна' })
  price: string; // Пример: 15.99 (лучше number, чем string)

  @Column({ type: 'enum', enum: ProductCategory })
  @IsEnum(ProductCategory)
  @IsNotEmpty({ message: 'Категория обязательна' })
  category: ProductCategory; // Пример: ProductCategory.FASTENERS

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  subcategory?: string; // Пример: "Болты" или "Шуруповерты"

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  keywords?: string[]; // Пример: "болт, м10, крепеж"

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  subtitle?: string; // Пример: "Оцинкованный, 50 мм"

  // Дополнительные поля
  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  brand?: string; // Пример: "Зубр", "Bosch"

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  material?: string; // Пример: "сталь", "алюминий"

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  weight?: string; // Пример: "0.1 кг"

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  dimensions?: string; // Пример: "10x50 мм"

  @Column({ default: 0 })
  @IsNumber()
  @IsOptional()
  quantity?: number; // Остаток на складе

  // Даты создания и обновления (автоматически)
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Метод для обновления данных (опционально)
  update(data: Partial<Product>) {
    Object.assign(this, data);
  }
}