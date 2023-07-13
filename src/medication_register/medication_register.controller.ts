import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MedicationRegisterService } from './medication_register.service';
import { CreateMedicationRegisterDto } from './dto/create-medication_register.dto';
import { UpdateMedicationRegisterDto } from './dto/update-medication_register.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('medication-register')
@UseGuards(AuthGuard())
export class MedicationRegisterController {
  constructor(
    private readonly medicationRegisterService: MedicationRegisterService,
  ) {}

  @Post()
  create(@Body() createMedicationRegisterDto: CreateMedicationRegisterDto) {
    return this.medicationRegisterService.create(
      createMedicationRegisterDto,
      createMedicationRegisterDto.id_cow_medication.toString(),
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.medicationRegisterService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicationRegisterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationRegisterDto: UpdateMedicationRegisterDto,
  ) {
    return this.medicationRegisterService.update(
      +id,
      updateMedicationRegisterDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationRegisterService.remove(+id);
  }
}
