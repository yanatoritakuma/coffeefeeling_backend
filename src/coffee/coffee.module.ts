import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CoffeeController } from './coffee.controller';
import { CoffeeService } from './coffee.service';

@Module({
  imports: [PrismaModule],
  controllers: [CoffeeController],
  providers: [CoffeeService],
})
export class CoffeeModule {}
