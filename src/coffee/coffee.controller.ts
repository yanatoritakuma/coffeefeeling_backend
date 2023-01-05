import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdeteCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from '@prisma/client';
import { TBestCoffee } from 'src/type/typeCoffee';

@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) {}

  @Get()
  getAllCoffees(): Promise<Coffee[]> {
    return this.coffeeService.getAllCoffees();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/userId')
  getCoffeeByUserId(
    @Req() req: Request,
    @Query('skipPage') skipPage: number,
    @Query('takePage') takePage: number,
  ): Promise<Coffee[]> {
    return this.coffeeService.getCoffeeByUserId(
      req.user.id,
      skipPage,
      takePage,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/likeUserId')
  getCoffeeByLikeUserId(
    @Req() req: Request,
    @Query('skipPage') skipPage: number,
    @Query('takePage') takePage: number,
  ): Promise<Coffee[]> {
    return this.coffeeService.getCoffeeByLikeUserId(
      req.user.id,
      skipPage,
      takePage,
    );
  }

  @Get('/feeling')
  getFeeling(
    @Query('category') category: string,
    @Query('bitter') bitter: number,
    @Query('acidity') acidity: number,
    @Query('price') price: number,
    @Query('place') place: string,
  ): Promise<TBestCoffee> {
    return this.coffeeService.getFeeling(
      category,
      bitter,
      acidity,
      price,
      place,
    );
  }

  @Get('/likeRankingCoffees')
  getLikeRankingCoffees(): Promise<Coffee[]> {
    return this.coffeeService.getLikeRankingCoffees();
  }

  @Get('/searchCoffee')
  getSearchCoffee(
    @Query('name') name: string,
    @Query('category') category: string,
    @Query('price') price: string,
    @Query('place') place: string,
  ): Promise<Coffee[]> {
    return this.coffeeService.getSearchCoffee(name, category, price, place);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createCoffee(
    @Req() req: Request,
    @Body() dto: CreateCoffeeDto,
  ): Promise<Coffee> {
    return this.coffeeService.createCoffee(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateCoffeeById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) coffeeId: number,
    @Body() dto: UpdeteCoffeeDto,
  ): Promise<Coffee> {
    return this.coffeeService.updateCoffeeById(
      req.user.id,
      req.user.admin,
      coffeeId,
      dto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteCoffeeById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) coffeeId: number,
  ): Promise<void> {
    return this.coffeeService.deleteCoffeeById(
      req.user.id,
      coffeeId,
      req.user.admin,
    );
  }
}
