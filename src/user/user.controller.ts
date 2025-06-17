import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UserController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getUsers() {
    return this.prisma.user.findMany();
  }

  @Post()
  async createUser(@Body() data: { email: string; name?: string }) {
    return this.prisma.user.create({ data });
  }
}