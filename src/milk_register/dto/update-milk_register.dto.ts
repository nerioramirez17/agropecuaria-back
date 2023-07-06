import { PartialType } from '@nestjs/mapped-types';
import { CreateMilkRegisterDto } from './create-milk_register.dto';

export class UpdateMilkRegisterDto extends PartialType(CreateMilkRegisterDto) {}
