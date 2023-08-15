import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMedicationRegisterDto {
  @IsNumber()
  cow_id?: number;

  @IsNotEmpty()
  medication: string;

  @IsString()
  date: string;
}
