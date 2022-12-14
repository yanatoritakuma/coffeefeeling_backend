import { LikesService } from './likes.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Delete,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Likes } from '@prisma/client';
import { CreateLikeDto } from './dto/create-like.dto';
import { Request } from 'express';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Get()
  getAllLikes(): Promise<Likes[]> {
    return this.likesService.getAllLikes();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createLike(@Req() req: Request, @Body() dto: CreateLikeDto): Promise<Likes> {
    return this.likesService.createLike(req.user.id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':coffeeId')
  deleteLikeById(
    @Req() req: Request,
    @Param('coffeeId', ParseIntPipe) coffeeId: number,
  ): Promise<void> {
    return this.likesService.deleteLikeById(req.user.id, coffeeId);
  }
}
