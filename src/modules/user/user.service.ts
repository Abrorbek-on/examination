import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';
import { UserRole } from '@prisma/client';
import { UsersQueryDto } from './dto/user.query.dto';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(options: UsersQueryDto) {
    const { offset = '0', limit = '10', search = '', role } = options;

    return this.prisma.user.findMany({
      skip: parseInt(offset),
      take: parseInt(limit),
      where: {
        fullName: {
          contains: search,
          mode: 'insensitive',
        },
        ...(role ? { role } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
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

  async findAllMentors(options: {
    offset?: number;
    limit?: number;
    search?: string;
  }) {
    const { offset = 0, limit = 10, search = '' } = options;

    return this.prisma.user.findMany({
      skip: offset,
      take: limit,
      where: {
        role: 'MENTOR',
        fullName: {
          contains: search,
          mode: 'insensitive',
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findMentorById(id: number) {
    const mentor = await this.prisma.user.findUnique({
      where: { id, role: 'MENTOR' },
    });
    if (!mentor) throw new NotFoundException('Mentor not found');
    return mentor;
  }

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new ConflictException('Bu telefon raqami bilan foydalanuvchi allaqachon mavjud');
    }

    return this.prisma.user.create({
      data: {
        ...dto,
        image: 'https://default-image.url/no-image.jpg',
      },
    });
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

    await this.prisma.question.deleteMany({
      where: { userId: id },
    });

    return this.prisma.user.delete({
      where: { id },
    });
  }

}