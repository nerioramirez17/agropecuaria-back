import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(1)
  vetFullName: string;

  @IsString()
  @MinLength(1)
  vetPhone: string;

  @IsString()
  @MinLength(1)
  vetEmail: string;

  @IsString()
  agroName: string;

  @IsString()
  address: string;

  @IsNumber()
  meters: number;
}
