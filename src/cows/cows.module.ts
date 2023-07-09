import { Module } from '@nestjs/common';
import { CowsService } from './cows.service';
import { CowsController } from './cows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cow } from './entities';
import { MilkRegister } from '../milk_register/entities/milk_register.entity';
import { MeatRegister } from 'src/meat_register/entities/meat_register.entity';
import { MedicationRegister } from 'src/medication_register/entities/medication_register.entity';

@Module({
  controllers: [CowsController],
  providers: [CowsService],
  imports: [
    TypeOrmModule.forFeature([
      Cow,
      MilkRegister,
      MeatRegister,
      MedicationRegister,
    ]),
  ],
})
export class CowsModule {}
