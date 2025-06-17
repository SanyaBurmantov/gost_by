import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      await this.checkDatabaseConnection();
      this.logger.log('Successfully connected to the database');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error.stack);
      throw error;
    }
  }

  private async checkDatabaseConnection() {
    try {
      await this.$queryRaw`SELECT 1`;
    } catch (error) {
      this.logger.error('Database connection check failed');
      throw new Error('Database connection check failed: ' + error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}