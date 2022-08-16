import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsOptional()
  bitter?: number;

  @IsOptional()
  acidity?: number;

  @IsOptional()
  amount?: number;

  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  place?: string;
}
