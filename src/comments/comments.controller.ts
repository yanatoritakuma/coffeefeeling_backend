import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteCommentById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) commentId: number,
  ): Promise<void> {
    return this.commentsService.deleteCommentById(req.user.id, commentId);
  }
}
