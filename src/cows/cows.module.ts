import { Module } from '@nestjs/common';
import { CowsService } from './cows.service';
import { CowsController } from './cows.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cow, CowMilk } from './entities';

@Module({
  controllers: [CowsController],
  providers: [CowsService],
  imports: [TypeOrmModule.forFeature([Cow, CowMilk])],
})
export class CowsModule {}
