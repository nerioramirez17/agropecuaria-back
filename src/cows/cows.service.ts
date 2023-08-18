import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateCowDto } from './dto/create-cow.dto';
import { UpdateCowDto } from './dto/update-cow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Cow } from './entities';
import { MilkRegister } from 'src/milk_register/entities/milk_register.entity';
import { User } from 'src/auth/entities/user.entity';
import { ForeignKeyViolationException } from 'src/common/exception';

@Injectable()
export class CowsService {
  private readonly logger = new Logger('CowsService');

  constructor(
    @InjectRepository(Cow)
    private readonly cowRepository: Repository<Cow>,

    @InjectRepository(MilkRegister)
    private readonly milkRegisterRepository: Repository<MilkRegister>,
  ) {}

  async create(createCowDto: CreateCowDto, user: User) {
    try {
      const newCow = this.cowRepository.create({ ...createCowDto, user });
      const createdCow = await this.cowRepository.save(newCow);

      return createdCow;
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
        id: 'ASC', // Orden ascendente por el campo "id". Puedes usar 'DESC' para orden descendente.
      },
    };

    const [cows, totalCount] = await this.cowRepository.findAndCount(options);
    const minCowId = cows.length > 0 ? cows[0].id : 0;

    const cowsWithAdjustedIds = cows.map((cow) => ({
      ...cow,
      adjustedId: cow.id - minCowId,
    }));

    return {
      total: totalCount,
      data: cowsWithAdjustedIds,
    };
  }

  async findOne(id: number) {
    const cow = await this.cowRepository.findOneBy({ id });
    if (!cow) {
      throw new NotFoundException(`cow ${id} not found`);
    }
    return cow;
  }

  async update(id: number, updateCowDto: UpdateCowDto, user: User) {
    const cow = await this.cowRepository.findOneBy({ id });

    if (!cow) {
      throw new NotFoundException(`cow ${id} not found`);
    }

    try {
      cow.user = user;
      cow.birth_date = updateCowDto.birth_date;
      cow.cow_info = updateCowDto.cow_info;
      cow.id_paddock = updateCowDto.id_paddock;
      await this.cowRepository.save(cow);
      return cow;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    try {
      const cow = await this.cowRepository.findOne({
        where: { id },
      });
      await this.cowRepository.remove(cow);

      return `This action removes a #${id} cow`;
    } catch (error) {
      if (error.code === '23503') {
        throw new ForeignKeyViolationException();
      }
      throw error;
    }
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
