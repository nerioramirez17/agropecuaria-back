import {
  IsString,
  MinLength,
  IsPositive,
  IsOptional,
  IsInt,
  IsIn,
} from 'class-validator';

export class CreateCowDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  id_paddock?: string;

  @IsInt()
  @IsPositive()
  id_cow_type: number;

  @IsString()
  @IsOptional()
  id_cow_mother?: string;

  @IsString()
  @IsOptional()
  id_cow_father?: string;

  @IsIn(['M', 'H'])
  sex: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  birth_date?: string;

  @IsOptional()
  cow_info?: string;
}
