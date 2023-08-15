import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMilkRegisterDto {
  @IsNumber()
  cow_id?: number;

  @IsNumber()
  @IsNotEmpty()
  liters: number;

  @IsString()
  date: string;
}
