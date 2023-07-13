import { Module } from '@nestjs/common';
import { CowsService } from './cows.service';
import { CowsController } from './cows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cow } from './entities';
import { MilkRegister } from '../milk_register/entities/milk_register.entity';
import { MeatRegister } from 'src/meat_register/entities/meat_register.entity';
import { MedicationRegister } from 'src/medication_register/entities/medication_register.entity';
import { AuthModule } from 'src/auth/auth.module';

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
    AuthModule,
  ],
})
export class CowsModule {}
