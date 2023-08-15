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
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('milk-register')
@UseGuards(AuthGuard())
export class MilkRegisterController {
  constructor(private readonly milkRegisterService: MilkRegisterService) {}

  @Post()
  create(
    @Body() createMilkRegisterDto: CreateMilkRegisterDto,
    @GetUser() user: User,
  ) {
    return this.milkRegisterService.create(createMilkRegisterDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.milkRegisterService.findAll(paginationDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.milkRegisterService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMilkRegisterDto: UpdateMilkRegisterDto,
    @GetUser() user: User,
  ) {
    return this.milkRegisterService.update(+id, updateMilkRegisterDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.milkRegisterService.remove(+id);
  }
}
