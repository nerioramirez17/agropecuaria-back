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
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class MilkRegisterService {
  private readonly logger = new Logger('MilkRegisterService');

  constructor(
    @InjectRepository(MilkRegister)
    private readonly milkRegisterRespository: Repository<MilkRegister>,
    @InjectRepository(Cow)
    private readonly cowRespository: Repository<Cow>,
  ) {}

  async create(createMilkRegisterDto: CreateMilkRegisterDto, user: any) {
    const id = createMilkRegisterDto.cow_id;
    try {
      const cow = await this.cowRespository.findOne({
        where: {
          id,
          user: user,
        },
      });
      if (!cow) {
        throw new InternalServerErrorException('Vacuno no encontrado');
      }
      const milk = new MilkRegister();
      milk.cow = cow;
      milk.date = createMilkRegisterDto.date;
      milk.liters = createMilkRegisterDto.liters;
      return this.milkRegisterRespository.save({ ...milk, user });
    } catch (error) {
      throw error;
    }
  }

  async findAll(paginationDto: PaginationDto, user: User) {
    const { limit, offset } = paginationDto;

    const options: FindManyOptions = {
      take: limit,
      skip: offset,
      where: { user: user },
      order: {
        id: 'ASC',
      },
      relations: ['cow'],
    };

    const [data, total] = await this.milkRegisterRespository.findAndCount(
      options,
    );

    const modifiedData = data.map((item) => ({
      id: item.id,
      liters: item.liters,
      date: item.date,
      cow_id: item.cow.id,
    }));

    return {
      total,
      data: modifiedData,
    };
  }

  async findOne(id: number, user: any) {
    const milk = await this.milkRegisterRespository.findOne({
      where: {
        id,
        user: user,
      },
    });
    if (!milk) {
      throw new NotFoundException(`Registro de leche ${id} no encontrado`);
    }
    return milk;
  }

  async update(
    id: number,
    updateMilkRegisterDto: UpdateMilkRegisterDto,
    user: any,
  ) {
    const milkRegister = await this.milkRegisterRespository.preload({
      id: id,
      ...updateMilkRegisterDto,
      user: user,
    });

    if (!milkRegister) {
      throw new NotFoundException(`Registro de leche ${id} no encontrado`);
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
