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
import { MilkRegisterService } from './milk_register.service';
import { CreateMilkRegisterDto } from './dto/create-milk_register.dto';
import { UpdateMilkRegisterDto } from './dto/update-milk_register.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('milk-register')
@UseGuards(AuthGuard())
export class MilkRegisterController {
  constructor(private readonly milkRegisterService: MilkRegisterService) {}

  @Post()
  create(@Body() createMilkRegisterDto: CreateMilkRegisterDto) {
    return this.milkRegisterService.create(
      createMilkRegisterDto,
      createMilkRegisterDto.id_cow_milk,
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.milkRegisterService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.milkRegisterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMilkRegisterDto: UpdateMilkRegisterDto,
  ) {
    return this.milkRegisterService.update(+id, updateMilkRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.milkRegisterService.remove(+id);
  }
}
