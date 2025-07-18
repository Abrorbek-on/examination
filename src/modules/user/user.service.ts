import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByPhone(phone: string) {
    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAllMentors() {
    return this.prisma.user.findMany({ where: { role: 'MENTOR' } });
  }

  async findMentorById(id: number) {
    const mentor = await this.prisma.user.findUnique({
      where: { id, role: 'MENTOR' },
    });
    if (!mentor) throw new NotFoundException('Mentor not found');
    return mentor;
  }

  async createUser(dto: CreateUserDto) {
    return this.prisma.user.create({ data: dto });
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
