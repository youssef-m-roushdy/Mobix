import {
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePhoneModelDto {
  @IsString()
  @Length(2, 100)
  brand: string;

  @IsString()
  @Length(2, 100)
  modelName: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  storage?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  color?: string;

  @IsString()
  @Matches(/^[A-Za-z0-9-]{4,32}$/, {
    message: 'SKU must be 4-32 chars, letters, digits, and hyphens',
  })
  sku: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  basePrice: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;
}