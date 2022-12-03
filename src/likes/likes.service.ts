import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Likes } from '@prisma/client';
import { CreateLikeDto } from './dto/create-like.dto';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  // 全てのいいね取得
  getAllLikes(): Promise<Likes[]> {
    return this.prisma.likes.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // coffeeIdに一致したlikeだけ取得
  getCoffeeIdLikes(
    coffeeId1: number,
    coffeeId2: number,
    coffeeId3: number,
    coffeeId4: number,
    coffeeId5: number,
    coffeeId6: number,
    coffeeId7: number,
    coffeeId8: number,
    coffeeId9: number,
    coffeeId10: number,
  ): Promise<Likes[]> {
    return this.prisma.likes.findMany({
      where: {
        coffeeId: {
          in: [
            Number(coffeeId1),
            Number(coffeeId2),
            Number(coffeeId3),
            Number(coffeeId4),
            Number(coffeeId5),
            Number(coffeeId6),
            Number(coffeeId7),
            Number(coffeeId8),
            Number(coffeeId9),
            Number(coffeeId10),
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ログインしているユーザーのいいね取得
  getLoginLikes(userId: number): Promise<Likes[]> {
    return this.prisma.likes.findMany({
      include: {
        coffee: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: 0,
      take: 10,
    });
  }

  // いいね作成
  async createLike(userId: number, dto: CreateLikeDto): Promise<Likes> {
    const like = await this.prisma.likes.create({
      data: {
        userId,
        ...dto,
      },
    });
    return like;
  }

  // いいね削除
  async deleteLikeById(userId: number, coffeeId: number): Promise<void> {
    const like = await this.prisma.likes.findMany({
      where: {
        coffeeId: coffeeId,
        userId: userId,
      },
    });

    if (!like || like[0].userId !== userId)
      throw new ForbiddenException('No permision to delete');

    await this.prisma.likes.delete({
      where: {
        id: like[0].id,
      },
    });
  }
}
