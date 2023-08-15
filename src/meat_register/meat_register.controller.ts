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
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';

@Controller('meat-register')
@UseGuards(AuthGuard())
export class MeatRegisterController {
  constructor(private readonly meatRegisterService: MeatRegisterService) {}

  @Post()
  create(
    @Body() createMeatRegisterDto: CreateMeatRegisterDto,
    @GetUser() user: User,
  ) {
    return this.meatRegisterService.create(createMeatRegisterDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @GetUser() user: User) {
    return this.meatRegisterService.findAll(paginationDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.meatRegisterService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMeatRegisterDto: UpdateMeatRegisterDto,
    @GetUser() user: User,
  ) {
    return this.meatRegisterService.update(+id, updateMeatRegisterDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.meatRegisterService.remove(+id);
  }
}
