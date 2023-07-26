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
import { CowsService } from './cows.service';
import { CreateCowDto } from './dto/create-cow.dto';
import { UpdateCowDto } from './dto/update-cow.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('cows')
@UseGuards(AuthGuard())
export class CowsController {
  constructor(private readonly cowsService: CowsService) {}

  @Post()
  create(@Body() createCowDto: CreateCowDto, @GetUser() user: User) {
    return this.cowsService.create(createCowDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.cowsService.findAll(paginationDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.cowsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateCowDto: UpdateCowDto,
    @GetUser() user: User,
  ) {
    return this.cowsService.update(id, updateCowDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.cowsService.remove(id);
  }
}
