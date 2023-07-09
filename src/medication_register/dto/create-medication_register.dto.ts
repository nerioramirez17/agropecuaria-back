import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMedicationRegisterDto {
  @IsNumber()
  id_cow_medication: number;

  @IsNotEmpty()
  medication: string;

  @IsString()
  date: string;
}
