import { IsOptional } from 'class-validator';

export class CreateLikeDto {
  @IsOptional()
  coffeeId: number;
}
