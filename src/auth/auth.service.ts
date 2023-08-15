import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userDate } = createUserDto;
      const user = this.userRepository.create({
        ...userDate,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        vetFullName: true,
        vetPhone: true,
        vetEmail: true,
        agroName: true,
        address: true,
        meters: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales no validas (email)');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales no validas (contraseña)');
    }

    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({
      id,
    });
    if (!user) {
      throw new NotFoundException(`milkRegister ${id} not found`);
    }
    return user;
  }

  generateTempPassword(): string {
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numericChars = '0123456789';

    const charset = lowercaseChars + uppercaseChars + numericChars;
    const passwordLength = crypto.randomInt(6, 10);
    const tempPassword = [];

    tempPassword.push(lowercaseChars[crypto.randomInt(lowercaseChars.length)]);
    tempPassword.push(uppercaseChars[crypto.randomInt(uppercaseChars.length)]);
    tempPassword.push(numericChars[crypto.randomInt(numericChars.length)]);

    for (let i = 3; i < passwordLength; i++) {
      const randomIndex = crypto.randomInt(charset.length);
      tempPassword.push(charset[randomIndex]);
    }

    for (let i = tempPassword.length - 1; i > 0; i--) {
      const j = crypto.randomInt(i + 1);
      [tempPassword[i], tempPassword[j]] = [tempPassword[j], tempPassword[i]];
    }

    return tempPassword.join('');
  }

  async recoverPassword(email: string) {
    const newPass = this.generateTempPassword();

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `El email: ${email} no se encuentra registrado`,
      );
    }

    const updateUser: any = {
      email: user.email,
      password: newPass,
    };

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperación de Contraseña</title>
    </head>
    <body style="font-family: Arial, sans-serif;">

        <h2>Recuperación de Contraseña</h2>

        <p>Hola,</p>

        <p>Recibimos una solicitud para restablecer tu contraseña. Aquí te dejamos una contraseña temporal:</p>

        <p><strong>Usuario:</strong> ${user.email}</p>
        <p><strong>Nueva Contraseña:</strong> ${newPass}</p>

        <p>Por favor, inicia sesión con tu nueva contraseña y asegúrate de cambiarla después de iniciar sesión.</p>

        <p>Si no solicitaste esta recuperación de contraseña, ignora este mensaje.</p>

        <p>Saludos,</p>
    </body>
    </html>
  `;

    const newUser = await this.update(user.id, updateUser);
    if (newUser) {
      this.mailerService.sendMail({
        to: user.email,
        subject: 'Olvido de contraseña',
        html: htmlTemplate,
      });
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException(`user ${id} not found`);
    }

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('medication not found');
    }
    await this.userRepository.remove(user);
    return `This action removes a #${id} auth`;
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  findAll() {
    return `This action returns all auth`;
  }
}
