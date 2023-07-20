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
      // Guarda la nueva vaca en la base de datos
      const createdCow = await this.cowRepository.save(newCow);

      // Asocia los registros de leche a la vaca recién creada
      /* if (createCowDto.milk_register && createCowDto.milk_register.length > 0) {
        const milkRegisters = createCowDto.milk_register.map((data) =>
          this.milkRegisterRepository.create({ ...data, cow: createdCow }),
        );
        // La relación uno a muchas ha sido establecida automáticamente debido a la configuración de las entidades y relaciones en TypeORM
        await this.milkRegisterRepository.save(milkRegisters);
      } */

      return createdCow;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto, user: User) {
    const { limit, offset } = paginationDto;

    const options: FindManyOptions = {
      take: limit,
      skip: offset,
      where: { user: user },
      order: {
        id: 'ASC', // Orden ascendente por el campo "id". Puedes usar 'DESC' para orden descendente.
      },
    };

    return this.cowRepository.findAndCount(options).then(([data, total]) => ({
      total,
      data,
    }));
  }

  async findOne(id: number) {
    const cow = await this.cowRepository.findOneBy({ id });
    if (!cow) {
      throw new NotFoundException(`cow ${id} not found`);
    }
    return cow;
  }

  async update(id: number, updateCowDto: UpdateCowDto, user: User) {
    const cow = await this.cowRepository.preload({
      id: id,
      ...updateCowDto,
    });

    if (!cow) {
      throw new NotFoundException(`cow ${id} not found`);
    }

    try {
      cow.user = user;
      await this.cowRepository.save(cow);
      return cow;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const cow = await this.cowRepository.findOne({
      where: { id },
    });
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
