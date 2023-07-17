import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CowsModule } from './cows/cows.module';
import { CommonModule } from './common/common.module';
import { MilkRegisterModule } from './milk_register/milk_register.module';
import { MeatRegisterModule } from './meat_register/meat_register.module';
import { MedicationRegisterModule } from './medication_register/medication_register.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    /* TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }), */
    // RAILWAY
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: `postgres://postgres:${process.env.NEW_PASSWORD_DB}@containers-us-west-11.railway.app:5690/railway`,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    AuthModule,
    CowsModule,
    CommonModule,
    MilkRegisterModule,
    MeatRegisterModule,
    MedicationRegisterModule,
  ],
})
export class AppModule {}
