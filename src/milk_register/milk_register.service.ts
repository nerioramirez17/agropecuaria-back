import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMilkRegisterDto } from './dto/create-milk_register.dto';
import { UpdateMilkRegisterDto } from './dto/update-milk_register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MilkRegister } from './entities/milk_register.entity';
import { Repository } from 'typeorm';
import { Cow } from 'src/cows/entities';

@Injectable()
export class MilkRegisterService {
  private readonly logger = new Logger('MilkRegisterService');

  constructor(
    @InjectRepository(MilkRegister)
    private readonly milkRegisterRespository: Repository<MilkRegister>,
    @InjectRepository(Cow)
    private readonly cowRespository: Repository<Cow>,
  ) {}

  async create(createMilkRegisterDto: CreateMilkRegisterDto, id: string) {
    try {
      const cow = await this.cowRespository.findOne({
        where: {
          id,
        },
      });
      if (!cow) {
        throw new NotFoundException('cow not found');
      }
      const milk = new MilkRegister();
      milk.cow = cow;
      milk.date = createMilkRegisterDto.date;
      milk.liters = createMilkRegisterDto.liters;
      return this.milkRegisterRespository.save(milk);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all milkRegister`;
  }

  findOne(id: number) {
    return `This action returns a #${id} milkRegister`;
  }

  update(id: number, updateMilkRegisterDto: UpdateMilkRegisterDto) {
    return `This action updates a #${id} milkRegister`;
  }

  remove(id: number) {
    return `This action removes a #${id} milkRegister`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
