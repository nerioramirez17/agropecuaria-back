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
import { MeatRegisterService } from './meat_register.service';
import { CreateMeatRegisterDto } from './dto/create-meat_register.dto';
import { UpdateMeatRegisterDto } from './dto/update-meat_register.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('meat-register')
@UseGuards(AuthGuard())
export class MeatRegisterController {
  constructor(private readonly meatRegisterService: MeatRegisterService) {}

  @Post()
  create(@Body() createMeatRegisterDto: CreateMeatRegisterDto) {
    return this.meatRegisterService.create(
      createMeatRegisterDto,
      createMeatRegisterDto.id_cow_meat.toString(),
    );
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.meatRegisterService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.meatRegisterService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeatRegisterDto: UpdateMeatRegisterDto,
  ) {
    return this.meatRegisterService.update(+id, updateMeatRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meatRegisterService.remove(+id);
  }
}
