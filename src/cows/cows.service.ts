import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCowDto } from './dto/create-cow.dto';
import { UpdateCowDto } from './dto/update-cow.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CowMilk, Cow } from './entities';

@Injectable()
export class CowsService {
  private readonly logger = new Logger('CowsService');

  constructor(
    @InjectRepository(Cow)
    private readonly cowRepository: Repository<Cow>,

    @InjectRepository(CowMilk)
    private readonly cowMilkRepository: Repository<CowMilk>,
  ) {}

  async create(createCowDto: CreateCowDto) {
    try {
      const { milk_register = [], ...cowDetails } = createCowDto;
      const cow = this.cowRepository.create({
        ...cowDetails,
        milk_register: milk_register.map((milk) =>
          this.cowMilkRepository.create({
            date: milk.date,
            liters: milk.liters,
          }),
        ),
      });
      await this.cowRepository.save(cow);
      return cow;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.cowRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(id: string) {
    const cow = await this.cowRepository.findOneBy({ id });
    if (!cow) {
      throw new NotFoundException(`cow ${id} not found`);
    }
    return cow;
  }

  async update(id: string, updateCowDto: UpdateCowDto) {
    const cow = await this.cowRepository.preload({
      id: id,
      ...updateCowDto,
      milk_register: [],
    });

    if (!cow) {
      throw new NotFoundException(`cow ${id} not found`);
    }

    try {
      await this.cowRepository.save(cow);
      return cow;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const cow = await this.findOne(id);
    await this.cowRepository.remove(cow);
    return `This action removes a #${id} cow`;
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
