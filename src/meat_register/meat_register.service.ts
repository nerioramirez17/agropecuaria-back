import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMeatRegisterDto } from './dto/create-meat_register.dto';
import { UpdateMeatRegisterDto } from './dto/update-meat_register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MeatRegister } from './entities/meat_register.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Cow } from 'src/cows/entities';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class MeatRegisterService {
  private readonly logger = new Logger('MeatRegisterRespository');
  constructor(
    @InjectRepository(MeatRegister)
    private readonly meatRegisterRespository: Repository<MeatRegister>,
    @InjectRepository(Cow)
    private readonly cowRespository: Repository<Cow>,
  ) {}

  async create(createMeatRegisterDto: CreateMeatRegisterDto, user: any) {
    const id = createMeatRegisterDto.cow_id;
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
      const meat = new MeatRegister();
      meat.cow = cow;
      meat.date = createMeatRegisterDto.date;
      meat.kg = createMeatRegisterDto.kg;
      return this.meatRegisterRespository.save({ ...meat, user });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: any) {
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

    const [data, total] = await this.meatRegisterRespository.findAndCount(
      options,
    );

    const modifiedData = data.map((item) => ({
      id: item.id,
      kg: item.kg,
      date: item.date,
      cow_id: item.cow.id,
    }));

    return {
      total,
      data: modifiedData,
    };
  }

  async findOne(id: number, user: any) {
    const meat = await this.meatRegisterRespository.findOne({
      where: {
        id,
        user: user,
      },
    });

    if (!meat) {
      throw new NotFoundException(`Registro de carne ${id} no encontrado`);
    }
    return meat;
  }

  async update(
    id: number,
    updateMeatRegisterDto: UpdateMeatRegisterDto,
    user: any,
  ) {
    const meatRegister = await this.meatRegisterRespository.preload({
      id: id,
      ...updateMeatRegisterDto,
      user: user,
    });

    if (!meatRegister) {
      throw new NotFoundException(`Registro de carne ${id} no encontrado`);
    }

    try {
      await this.meatRegisterRespository.save(meatRegister);
      return meatRegister;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const meatRegister = await this.meatRegisterRespository.findOne({
      where: { id },
    });
    if (!meatRegister) {
      throw new NotFoundException('meatRegister not found');
    }
    await this.meatRegisterRespository.remove(meatRegister);
    return `This action removes a #${id} meatRegister`;
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
