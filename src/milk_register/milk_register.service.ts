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
import { FindManyOptions, Repository } from 'typeorm';
import { Cow } from 'src/cows/entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class MilkRegisterService {
  private readonly logger = new Logger('MilkRegisterService');

  constructor(
    @InjectRepository(MilkRegister)
    private readonly milkRegisterRespository: Repository<MilkRegister>,
    @InjectRepository(Cow)
    private readonly cowRespository: Repository<Cow>,
  ) {}

  async create(createMilkRegisterDto: CreateMilkRegisterDto, id: number) {
    try {
      const cow = await this.cowRespository.findOne({
        where: {
          id,
        },
      });
      if (!cow) {
        throw new InternalServerErrorException('cow not found');
      }
      const milk = new MilkRegister();
      milk.cow = cow;
      milk.date = createMilkRegisterDto.date;
      milk.liters = createMilkRegisterDto.liters;
      return this.milkRegisterRespository.save(milk);
    } catch (error) {
      console.log('respuesta del backend', error);
      throw error;
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit, offset } = paginationDto;

    const options: FindManyOptions = {
      take: limit,
      skip: offset,
      order: {
        id: 'ASC',
      },
    };

    return this.milkRegisterRespository
      .findAndCount(options)
      .then(([data, total]) => ({
        total,
        data,
      }));
  }

  async findOne(id: number) {
    const milk = await this.milkRegisterRespository.findOneBy({ id });
    if (!milk) {
      throw new NotFoundException(`milkRegister ${id} not found`);
    }
    return milk;
  }

  async update(id: number, updateMilkRegisterDto: UpdateMilkRegisterDto) {
    const milkRegister = await this.milkRegisterRespository.preload({
      id: id,
      ...updateMilkRegisterDto,
    });

    if (!milkRegister) {
      throw new NotFoundException(`milkRegister ${id} not found`);
    }

    try {
      await this.milkRegisterRespository.save(milkRegister);
      return milkRegister;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const milkRegister = await this.milkRegisterRespository.findOne({
      where: { id },
    });
    if (!milkRegister) {
      throw new NotFoundException('MilkRegister not found');
    }
    await this.milkRegisterRespository.remove(milkRegister);
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
