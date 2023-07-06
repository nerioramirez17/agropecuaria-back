import { Module } from '@nestjs/common';
import { MilkRegisterService } from './milk_register.service';
import { MilkRegisterController } from './milk_register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MilkRegister } from './entities/milk_register.entity';
import { Cow } from 'src/cows/entities';

@Module({
  controllers: [MilkRegisterController],
  providers: [MilkRegisterService],
  imports: [TypeOrmModule.forFeature([MilkRegister, Cow])],
})
export class MilkRegisterModule {}
