import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMeatRegisterDto {
  @IsNumber()
  id_cow_meat: number;

  @IsNumber()
  @IsNotEmpty()
  kg: number;

  @IsString()
  date: string;
}
