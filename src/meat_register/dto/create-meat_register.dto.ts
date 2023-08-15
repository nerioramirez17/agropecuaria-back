import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMeatRegisterDto {
  @IsNumber()
  cow_id?: number;

  @IsNumber()
  @IsNotEmpty()
  kg: number;

  @IsString()
  date: string;
}
