import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMedicationRegisterDto } from './dto/create-medication_register.dto';
import { UpdateMedicationRegisterDto } from './dto/update-medication_register.dto';
import { MedicationRegister } from './entities/medication_register.entity';
import { Cow } from 'src/cows/entities';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class MedicationRegisterService {
  private readonly logger = new Logger('MedicationRegisterService');

  constructor(
    @InjectRepository(MedicationRegister)
    private readonly medicationRegisterRespository: Repository<MedicationRegister>,
    @InjectRepository(Cow)
    private readonly cowRespository: Repository<Cow>,
  ) {}

  async create(
    createMedicationRegisterDto: CreateMedicationRegisterDto,
    id: number,
  ) {
    try {
      const cow = await this.cowRespository.findOne({
        where: {
          id,
        },
      });
      if (!cow) {
        throw new InternalServerErrorException('cow not found');
      }
      const medication = new MedicationRegister();
      medication.cow = cow;
      medication.date = createMedicationRegisterDto.date;
      medication.medication = createMedicationRegisterDto.medication;
      return this.medicationRegisterRespository.save(medication);
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

    return this.medicationRegisterRespository
      .findAndCount(options)
      .then(([data, total]) => ({
        total,
        data,
      }));
  }

  async findOne(id: number) {
    const medication = await this.medicationRegisterRespository.findOneBy({
      id,
    });
    if (!medication) {
      throw new NotFoundException(`milkRegister ${id} not found`);
    }
    return medication;
  }

  async update(
    id: number,
    updateMedicationRegisterDto: UpdateMedicationRegisterDto,
  ) {
    const medicationRegister = await this.medicationRegisterRespository.preload(
      {
        id: id,
        ...updateMedicationRegisterDto,
      },
    );

    if (!medicationRegister) {
      throw new NotFoundException(`medicationRegister ${id} not found`);
    }

    try {
      await this.medicationRegisterRespository.save(medicationRegister);
      return medicationRegister;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: number) {
    const medication = await this.medicationRegisterRespository.findOne({
      where: { id },
    });
    if (!medication) {
      throw new NotFoundException('medication not found');
    }
    await this.medicationRegisterRespository.remove(medication);
    return `This action removes a #${id} medication`;
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
