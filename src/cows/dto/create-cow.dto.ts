import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  IsPositive,
  IsOptional,
  IsInt,
  IsArray,
  IsIn,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

class MilkRegisterDto {
  @IsString()
  date: string;

  @IsNumber()
  @IsNotEmpty()
  liters: number;
}

export class CreateCowDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  id_paddock?: string;

  @IsInt()
  @IsPositive()
  id_cow_type: number;

  @IsString()
  @MinLength(1)
  @IsOptional()
  id_cow_mother?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  id_cow_father?: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  id_childrens?: string[];

  @IsIn(['M', 'H'])
  sex: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  birth_date?: string;

  @IsOptional()
  cow_info?: string;
}
