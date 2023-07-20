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

@Injectable()
export class MeatRegisterService {
  private readonly logger = new Logger('MeatRegisterRespository');
  constructor(
    @InjectRepository(MeatRegister)
    private readonly meatRegisterRespository: Repository<MeatRegister>,
    @InjectRepository(Cow)
    private readonly cowRespository: Repository<Cow>,
  ) {}

  async create(createMeatRegisterDto: CreateMeatRegisterDto, id: number) {
    try {
      const cow = await this.cowRespository.findOne({
        where: {
          id,
        },
      });
      if (!cow) {
        throw new InternalServerErrorException('cow not found');
      }
      const meat = new MeatRegister();
      meat.cow = cow;
      meat.date = createMeatRegisterDto.date;
      meat.kg = createMeatRegisterDto.kg;
      return this.meatRegisterRespository.save(meat);
    } catch (error) {
      this.handleDBExceptions(error);
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

    return this.meatRegisterRespository
      .findAndCount(options)
      .then(([data, total]) => ({
        total,
        data,
      }));
  }

  async findOne(id: number) {
    const meat = await this.meatRegisterRespository.findOneBy({ id });
    if (!meat) {
      throw new NotFoundException(`meatRegister ${id} not found`);
    }
    return meat;
  }

  async update(id: number, updateMeatRegisterDto: UpdateMeatRegisterDto) {
    const meatRegister = await this.meatRegisterRespository.preload({
      id: id,
      ...updateMeatRegisterDto,
    });

    if (!meatRegister) {
      throw new NotFoundException(`meatRegister ${id} not found`);
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
