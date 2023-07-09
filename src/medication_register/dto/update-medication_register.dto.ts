import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationRegisterDto } from './create-medication_register.dto';

export class UpdateMedicationRegisterDto extends PartialType(CreateMedicationRegisterDto) {}
