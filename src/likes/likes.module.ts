import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';

@Module({
  imports: [PrismaModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
