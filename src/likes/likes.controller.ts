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

  @Get('/coffeeIds')
  getCoffeeIdLikes(
    @Query('coffeeId1') coffeeId1: number,
    @Query('coffeeId2') coffeeId2: number,
    @Query('coffeeId3') coffeeId3: number,
    @Query('coffeeId4') coffeeId4: number,
    @Query('coffeeId5') coffeeId5: number,
    @Query('coffeeId6') coffeeId6: number,
    @Query('coffeeId7') coffeeId7: number,
    @Query('coffeeId8') coffeeId8: number,
    @Query('coffeeId9') coffeeId9: number,
    @Query('coffeeId10') coffeeId10: number,
  ): Promise<Likes[]> {
    return this.likesService.getCoffeeIdLikes(
      coffeeId1,
      coffeeId2,
      coffeeId3,
      coffeeId4,
      coffeeId5,
      coffeeId6,
      coffeeId7,
      coffeeId8,
      coffeeId9,
      coffeeId10,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/login')
  getLoginLikes(@Req() req: Request): Promise<Likes[]> {
    return this.likesService.getLoginLikes(req.user.id);
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
