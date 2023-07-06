import { Module } from '@nestjs/common';
import { CowsService } from './cows.service';
import { CowsController } from './cows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cow } from './entities';
import { MilkRegister } from '../milk_register/entities/milk_register.entity';

@Module({
  controllers: [CowsController],
  providers: [CowsService],
  imports: [TypeOrmModule.forFeature([Cow, MilkRegister])],
})
export class CowsModule {}
