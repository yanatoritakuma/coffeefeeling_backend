import { Injectable } from '@nestjs/common';
import { Comments } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  // 指定した投稿のコメント一覧を取得
  getTargetComments(coffeeId: number): Promise<Comments[]> {
    return this.prisma.comments.findMany({
      where: {
        coffeeId: Number(coffeeId),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // コメント作成
  async createComment(
    userId: number,
    dto: CreateCommentDto,
  ): Promise<Comments> {
    const comments = await this.prisma.comments.create({
      data: {
        userId,
        ...dto,
      },
    });

    return comments;
  }
}
