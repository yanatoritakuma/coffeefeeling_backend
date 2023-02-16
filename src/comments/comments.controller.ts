import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Comments } from '@prisma/client';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  getTargetComments(@Query('coffeeId') coffeeId: number): Promise<Comments[]> {
    return this.commentsService.getTargetComments(coffeeId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createComment(
    @Req() req: Request,
    @Body() dto: CreateCommentDto,
  ): Promise<Comments> {
    return this.commentsService.createComment(req.user.id, dto);
  }
}
