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
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/common/global/guard';
import { Roles } from 'src/common/global/decarator';
import { RoleGuard } from 'src/common/guard/role.guard';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
    @ApiResponse({ status: 200, description: 'Barcha foydalanuvchilar royxati' })
    getAllUsers() {
        return this.usersService.findAll();
    }

    @Get('single/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @Roles('ADMIN', 'ASSISTANT')
    @ApiOperation({ summary: 'ID orqali userni olish' })
    @ApiResponse({ status: 200, description: 'Topilgan user' })
    getOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    @Get('by-phone/:phone')
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Telefon raqami orqali userni olish' })
    @ApiResponse({ status: 200, description: 'Telefon orqali topilgan user' })
    getByPhone(@Param('phone') phone: string) {
        return this.usersService.findByPhone(phone);
    }

    @Get('mentors')
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @Roles('ADMIN', 'ASSISTANT')
    @ApiOperation({ summary: 'Mentorlar royxatini olish' })
    @ApiResponse({ status: 200, description: 'Mentorlar royxati' })
    getMentors() {
        return this.usersService.findAllMentors();
    }

    @Get('mentors/:id')
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @Roles('ADMIN', 'ASSISTANT')
    @ApiOperation({ summary: 'Mentorni ID orqali olish' })
    @ApiResponse({ status: 200, description: 'Mentor topildi' })
    getMentor(@Param('id') id: string) {
        return this.usersService.findMentorById(+id);
    }

    @Post('register')
    @ApiOperation({ summary: 'Yangi user ro\'yxatdan o\'tkazish (Public)' })
    @ApiResponse({ status: 201, description: 'User ro\'yxatdan o\'tdi' })
    register(@Body() dto: CreateUserDto) {
        return this.usersService.createUser(dto);
    }

    @Post()
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Yangi user yaratish (Admin)' })
    @ApiResponse({ status: 201, description: 'User yaratildi' })
    create(@Body() dto: CreateUserDto) {
        return this.usersService.createUser(dto);
    }

    @Patch(':id')
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @Roles('ADMIN', 'ASSISTANT')
    @ApiOperation({ summary: 'User malumotlarini tahrirlash' })
    @ApiResponse({ status: 200, description: 'User yangilandi' })
    update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.usersService.updateUser(+id, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard, RoleGuard)
    @ApiBearerAuth()
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Userni ochirish' })
    @ApiResponse({ status: 200, description: 'User ochirildi' })
    delete(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}