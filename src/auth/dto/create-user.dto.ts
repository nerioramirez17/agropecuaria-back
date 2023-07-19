import {
  IsEmail,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

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
