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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdeteCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from '@prisma/client';
import { TFeeling } from 'src/types/coffee';

@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) {}

  @Get()
  getAllCoffees(): Promise<Coffee[]> {
    return this.coffeeService.getAllCoffees();
  }

  // @Get()
  // getCoffees(@Req() req: Request): Promise<Coffee[]> {
  //   return this.coffeeService.getCoffees(req.user.id);
  // }

  @Get(':id')
  getFeeling(@Param('id') id: TFeeling): Promise<Coffee[]> {
    return this.coffeeService.getFeeling(id);
  }

  // @Get(':id')
  // getCoffeeById(
  //   @Req() req: Request,
  //   @Param('id', ParseIntPipe) coffeeId: number,
  // ): Promise<Coffee> {
  //   return this.coffeeService.getCoffeeById(req.user.id, coffeeId);
  // }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createCoffee(
    @Req() req: Request,
    @Body() dto: CreateCoffeeDto,
  ): Promise<Coffee> {
    return this.coffeeService.createCoffee(req.user.id, dto);
  }

  @Patch(':id')
  updateCoffeeById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) coffeeId: number,
    @Body() dto: UpdeteCoffeeDto,
  ): Promise<Coffee> {
    return this.coffeeService.updateCoffeeById(req.user.id, coffeeId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteCoffeeById(
    @Req() req: Request,
    @Param('id', ParseIntPipe) coffeeId: number,
  ): Promise<void> {
    return this.coffeeService.deleteCoffeeById(req.user.id, coffeeId);
  }
}
