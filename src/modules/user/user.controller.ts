import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from 'src/common/global/decarator';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  @ApiResponse({ status: 200, description: 'Barcha foydalanuvchilar royxati' })
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('single/:id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'ASSISTANT')
  @ApiOperation({ summary: 'ID orqali userni olish' })
  @ApiResponse({ status: 200, description: 'Topilgan user' })
  getOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get('by-phone/:phone')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Telefon raqami orqali userni olish' })
  @ApiResponse({ status: 200, description: 'Telefon orqali topilgan user' })
  getByPhone(@Param('phone') phone: string) {
    return this.usersService.findByPhone(phone);
  }

  @Get('mentors')
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'ASSISTANT')
  @ApiOperation({ summary: 'Mentorlar royxatini olish' })
  @ApiResponse({ status: 200, description: 'Mentorlar royxati' })
  getMentors() {
    return this.usersService.findAllMentors();
  }

  @Get('mentors/:id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'ASSISTANT')
  @ApiOperation({ summary: 'Mentorni ID orqali olish' })
  @ApiResponse({ status: 200, description: 'Mentor topildi' })
  getMentor(@Param('id') id: string) {
    return this.usersService.findMentorById(+id);
  }

  @Post()
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Yangi user yaratish' })
  @ApiResponse({ status: 201, description: 'User yaratildi' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN', 'ASSISTANT')
  @ApiOperation({ summary: 'User malumotlarini tahrirlash' })
  @ApiResponse({ status: 200, description: 'User yangilandi' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(+id, dto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Userni ochirish' })
  @ApiResponse({ status: 200, description: 'User ochirildi' })
  delete(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}