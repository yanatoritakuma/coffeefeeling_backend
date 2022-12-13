import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdeteCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from '@prisma/client';
import { TBestCoffee } from 'src/type/typeCoffee';

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
  getCoffeeByUserId(
    userId: number,
    skipPage: number,
    takePage: number,
  ): Promise<Coffee[]> {
    return this.prisma.coffee.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            _count: {
              select: { coffee: true },
            },
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: Number(skipPage),
      take: Number(takePage),
    });
  }

  // ユーザー気分で取得
  async getFeeling(
    category: string,
    bitter: number,
    acidity: number,
    price: number,
    place: string,
  ): Promise<TBestCoffee> {
    const categoryJson = JSON.parse(String(category));
    const bitterJson = JSON.parse(String(bitter));
    const acidityJson = JSON.parse(String(acidity));
    const priceJson = JSON.parse(String(price));
    const placeJson = JSON.parse(String(place));

    const bitterBest = await this.prisma.$queryRaw<Coffee[]>`
      SELECT "Coffee".*, "User"."name" AS user_name, "User"."image" AS user_image,
      ARRAY_AGG("Likes"."userId") AS like_user_id
      FROM "Coffee"
      JOIN "User"
      ON "userId" = "User"."id"
      LEFT JOIN "Likes"
      ON "Coffee"."id" = "Likes"."coffeeId"
      WHERE category = ${categoryJson}
      AND price = ${priceJson}
      AND place = ${placeJson}
      GROUP BY "Coffee"."id", "User"."name", "User"."image"
      ORDER BY abs(bitter - ${bitterJson})
      LIMIT 3
    `;

    const acidityBest = await this.prisma.$queryRaw<Coffee[]>`
      SELECT "Coffee".*, "User"."name" AS user_name, "User"."image" AS user_image,
      ARRAY_AGG("Likes"."userId") AS like_user_id
      FROM "Coffee"
      JOIN "User"
      ON "userId" = "User"."id"
      LEFT JOIN "Likes"
      ON "Coffee"."id" = "Likes"."coffeeId"
      WHERE category = ${categoryJson}
      AND price = ${priceJson}
      AND place = ${placeJson}
      GROUP BY "Coffee"."id", "User"."name", "User"."image"
      ORDER BY abs(acidity - ${acidityJson})
      LIMIT 3
    `;

    const bestCoffee = {
      bitterBest: bitterBest,
      acidityBest: acidityBest,
    };

    return bestCoffee;
  }

  // いいねTOP10のコーヒ取得
  getLikeRankingCoffees(): Promise<Coffee[]> {
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
      take: 10,
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
      include: {
        user: {
          select: {
            name: true,
            image: true,
            _count: {
              select: { coffee: true },
            },
          },
        },
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteCoffeeById(
    userId: number,
    coffeeId: number,
    userAdmin: boolean,
  ): Promise<void> {
    const coffee = await this.prisma.coffee.findUnique({
      where: {
        id: coffeeId,
      },
    });

    if (!userAdmin) {
      if (!coffee || coffee.userId !== userId)
        throw new ForbiddenException('No permision to delete');
    }

    await this.prisma.coffee.delete({
      where: {
        id: coffeeId,
      },
    });
  }
}
