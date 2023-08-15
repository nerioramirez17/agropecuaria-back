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
    user: any,
  ) {
    const id = createMedicationRegisterDto.cow_id;
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
      const medication = new MedicationRegister();
      medication.cow = cow;
      medication.date = createMedicationRegisterDto.date;
      medication.medication = createMedicationRegisterDto.medication;
      return this.medicationRegisterRespository.save({ ...medication, user });
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

    const [data, total] = await this.medicationRegisterRespository.findAndCount(
      options,
    );

    const modifiedData = data.map((item) => ({
      id: item.id,
      medication: item.medication,
      date: item.date,
      cow_id: item.cow.id,
    }));

    return {
      total,
      data: modifiedData,
    };
  }

  async findOne(id: number, user: any) {
    const medication = await this.medicationRegisterRespository.findOneBy({
      id,
      user: user,
    });
    if (!medication) {
      throw new NotFoundException(`Registro de medicacion ${id} no encontrado`);
    }
    return medication;
  }

  async update(
    id: number,
    updateMedicationRegisterDto: UpdateMedicationRegisterDto,
    user: any,
  ) {
    const medicationRegister = await this.medicationRegisterRespository.preload(
      {
        id: id,
        ...updateMedicationRegisterDto,
        user: user,
      },
    );

    if (!medicationRegister) {
      throw new NotFoundException(`Registro de medicacion ${id} no encontrado`);
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
