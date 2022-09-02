import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdeteCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from '@prisma/client';
import { TFeeling } from 'src/types/coffee';

@Injectable()
export class CoffeeService {
  constructor(private prisma: PrismaService) {}

  // 全ての投稿取得
  getAllCoffees(): Promise<Coffee[]> {
    return this.prisma.coffee.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 特定のユーザーが投稿したデータ取得
  getCoffees(userId: number): Promise<Coffee[]> {
    return this.prisma.coffee.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ユーザー気分で取得
  getFeeling(coffee: TFeeling): Promise<Coffee[]> {
    const coffeeJson = JSON.parse(String(coffee));

    return this.prisma.coffee.findMany({
      where: {
        category: coffeeJson.category,
        price: coffeeJson.price,
        place: coffeeJson.place,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 特定のユーザーが投稿した特定のデータ取得
  getCoffeeById(userId: number, coffeeId: number): Promise<Coffee> {
    return this.prisma.coffee.findFirst({
      where: {
        userId,
        id: coffeeId,
      },
    });
  }

  async createCoffee(userId: number, dto: CreateCoffeeDto): Promise<Coffee> {
    const coffee = await this.prisma.coffee.create({
      data: {
        userId,
        ...dto,
      },
    });
    return coffee;
  }

  async updateCoffeeById(
    userId: number,
    coffeeId: number,
    dto: UpdeteCoffeeDto,
  ): Promise<Coffee> {
    const coffee = await this.prisma.coffee.findUnique({
      where: {
        id: coffeeId,
      },
    });

    if (!coffee || coffee.userId !== userId)
      throw new ForbiddenException('No permision to update');

    return this.prisma.coffee.update({
      where: {
        id: coffeeId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCoffeeById(userId: number, coffeeId: number): Promise<void> {
    const coffee = await this.prisma.coffee.findUnique({
      where: {
        id: coffeeId,
      },
    });

    if (!coffee || coffee.userId !== userId)
      throw new ForbiddenException('No permision to delete');

    await this.prisma.coffee.delete({
      where: {
        id: coffeeId,
      },
    });
  }
}
