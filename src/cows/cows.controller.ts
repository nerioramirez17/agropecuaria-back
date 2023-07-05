import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { CowsService } from './cows.service';
import { CreateCowDto } from './dto/create-cow.dto';
import { UpdateCowDto } from './dto/update-cow.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('cows')
export class CowsController {
  constructor(private readonly cowsService: CowsService) {}

  @Post()
  create(@Body() createCowDto: CreateCowDto) {
    return this.cowsService.create(createCowDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.cowsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.cowsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCowDto: UpdateCowDto,
  ) {
    return this.cowsService.update(id, updateCowDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.cowsService.remove(id);
  }
}
