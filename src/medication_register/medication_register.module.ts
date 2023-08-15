import { Module } from '@nestjs/common';
import { MedicationRegisterService } from './medication_register.service';
import { MedicationRegisterController } from './medication_register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cow } from 'src/cows/entities';
import { MedicationRegister } from './entities/medication_register.entity';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MedicationRegisterController],
  providers: [MedicationRegisterService],
  imports: [
    TypeOrmModule.forFeature([MedicationRegister, Cow]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
})
export class MedicationRegisterModule {}
