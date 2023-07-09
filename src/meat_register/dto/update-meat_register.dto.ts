import { PartialType } from '@nestjs/mapped-types';
import { CreateMeatRegisterDto } from './create-meat_register.dto';

export class UpdateMeatRegisterDto extends PartialType(CreateMeatRegisterDto) {}
