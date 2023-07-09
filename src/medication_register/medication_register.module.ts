import { Module } from '@nestjs/common';
import { MedicationRegisterService } from './medication_register.service';
import { MedicationRegisterController } from './medication_register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cow } from 'src/cows/entities';
import { MedicationRegister } from './entities/medication_register.entity';

@Module({
  controllers: [MedicationRegisterController],
  providers: [MedicationRegisterService],
  imports: [TypeOrmModule.forFeature([MedicationRegister, Cow])],
})
export class MedicationRegisterModule {}
