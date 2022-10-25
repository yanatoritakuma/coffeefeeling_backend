import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdeteCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from '@prisma/client';

@Injectable()
export class CoffeeService {
  constructor(private prisma: PrismaService) {}

  // 全ての投稿取得
  getAllCoffees(): Promise<Coffee[]> {
    return this.prisma.coffee.findMany({
      include: {
        _count: {
          select: { likes: true },
        },
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        likes: {
          _count: 'desc',
        },
      },
    });
  }

  // 特定のユーザーが投稿したデータ取得
  getCoffeeByUserId(userId: number): Promise<Coffee[]> {
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
  getFeeling(
    category: string,
    bitter: number,
    acidity: number,
    price: number,
    place: string,
  ): Promise<Coffee[]> {
    const categoryJson = JSON.parse(String(category));
    const bitterJson = JSON.parse(String(bitter));
    const acidityJson = JSON.parse(String(acidity));
    const priceJson = JSON.parse(String(price));
    const placeJson = JSON.parse(String(place));

    return this.prisma.$queryRaw<any[]>`
      select * from "Coffee"
      where category = ${categoryJson}
      and
      place = ${placeJson}
      and
      abs(bitter - ${bitterJson}) = (select min(abs(bitter - ${bitterJson}))from "Coffee")
      or
      abs(acidity - ${acidityJson}) = (select min(acidity - abs(${acidityJson}))from "Coffee")
      and
      abs(price - ${priceJson}) = (select min(price - abs(${priceJson}))from "Coffee")
    `;
  }

  // 特定のユーザーが投稿した特定のデータ取得
  // getCoffeeById(userId: number, coffeeId: number): Promise<Coffee> {
  //   return this.prisma.coffee.findFirst({
  //     where: {
  //       userId,
  //       id: coffeeId,
  //     },
  //   });
  // }

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
    userAdmin: boolean,
    coffeeId: number,
    dto: UpdeteCoffeeDto,
  ): Promise<Coffee> {
    const coffee = await this.prisma.coffee.findUnique({
      where: {
        id: coffeeId,
      },
    });

    if (!userAdmin) {
      if (!coffee || coffee.userId !== userId) {
        throw new ForbiddenException('No permision to update');
      }
    }

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
