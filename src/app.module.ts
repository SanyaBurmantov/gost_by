import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostModule } from './post/post.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [PrismaModule, PostModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
