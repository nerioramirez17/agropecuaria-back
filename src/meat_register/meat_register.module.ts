import { Module } from '@nestjs/common';
import { MeatRegisterService } from './meat_register.service';
import { MeatRegisterController } from './meat_register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeatRegister } from './entities/meat_register.entity';
import { Cow } from 'src/cows/entities';

@Module({
  controllers: [MeatRegisterController],
  providers: [MeatRegisterService],
  imports: [TypeOrmModule.forFeature([MeatRegister, Cow])],
})
export class MeatRegisterModule {}