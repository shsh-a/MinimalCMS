import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/db/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashSync } from 'bcrypt'; // bcrypt

@Injectable()
export class UsersService {
  saltRounds = 10;
  select = {
    username: true,
    email: true,
    phone: true,
    role: true,
    createdAt: true,
    addedBy: true,
  };
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    const hash = hashSync(password, this.saltRounds);

    return await this.prisma.users.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        phone: createUserDto.phone,
        role: createUserDto.role,
        hash: hash,
      },
      select: this.select,
    });
  }

  async findAll() {
    return await this.prisma.users.findMany({
      select: this.select,
    });
  }

  async findOne(username: string) {
    return await this.prisma.users.findUnique({
      where: { username: username },
      select: this.select,
    });
  }

  async update(username: string, updateUserDto: UpdateUserDto, actor: string) {
    if (actor !== 'admin') delete updateUserDto['role'];

    return await this.prisma.users.update({
      where: { username: username },
      data: updateUserDto,
      select: this.select,
    });
  }

  async remove(username: string) {
    return await this.prisma.users.delete({
      where: { username: username },
      select: this.select,
    });
  }
}
