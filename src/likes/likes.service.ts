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
