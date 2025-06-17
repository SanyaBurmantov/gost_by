import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config({ path: '../../.env' });

const port = process.env.BACKEND_PORT ?? 8000;
const logger = new Logger('Bootstrap');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    // Настройка Swagger ДО app.listen()
    const config = new DocumentBuilder()
      .setTitle('Каталог строительных товаров')
      .setDescription('API для управления товарами')
      .setVersion('1.0')
      .addTag('products')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(port);
    logger.log(`Backend server started on port ${port}`);
    logger.log(`Swagger docs available at http://localhost:${port}/api/docs`);
  } catch (error) {
    logger.error('Failed to start application', error.stack);
    process.exit(1);
  }
}

bootstrap();