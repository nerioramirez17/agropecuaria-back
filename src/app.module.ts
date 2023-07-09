import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { CowsModule } from './cows/cows.module';
import { CommonModule } from './common/common.module';
import { MilkRegisterModule } from './milk_register/milk_register.module';
import { MeatRegisterModule } from './meat_register/meat_register.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    AuthModule,
    CowsModule,
    CommonModule,
    MilkRegisterModule,
    MeatRegisterModule,
  ],
})
export class AppModule {}
