import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdeteCoffeeDto {
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
  price?: number;

  @IsString()
  @IsOptional()
  place?: string;
}
