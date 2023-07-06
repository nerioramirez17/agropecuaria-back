import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMilkRegisterDto {
  @IsNumber()
  id_cow_milk: number;

  @IsNumber()
  @IsNotEmpty()
  liters: number;

  @IsString()
  date: string;
}
