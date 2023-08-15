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
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('medication-register')
@UseGuards(AuthGuard())
export class MedicationRegisterController {
  constructor(
    private readonly medicationRegisterService: MedicationRegisterService,
  ) {}

  @Post()
  create(
    @Body() createMedicationRegisterDto: CreateMedicationRegisterDto,
    @GetUser() user: User,
  ) {
    return this.medicationRegisterService.create(
      createMedicationRegisterDto,
      user,
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.medicationRegisterService.findAll(paginationDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.medicationRegisterService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMedicationRegisterDto: UpdateMedicationRegisterDto,
    @GetUser() user: User,
  ) {
    return this.medicationRegisterService.update(
      +id,
      updateMedicationRegisterDto,
      user,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicationRegisterService.remove(+id);
  }
}
