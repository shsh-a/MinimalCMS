import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/db/prisma/prisma.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashSync } from 'bcrypt'; // bcrypt

const saltRounds = 10;
const select = {
  username: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  addedBy: true,
};
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const password = createUserDto.password;
    const hash = hashSync(password, saltRounds);

    return await this.prisma.users.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        phone: createUserDto.phone,
        role: createUserDto.role,
        hash: hash,
      },
      select: select,
    });
  }

  async findAll() {
    return await this.prisma.users.findMany({
      select: select,
    });
  }

  async findOne(username: string) {
    return await this.prisma.users.findUnique({
      where: { username: username },
      select: select,
    });
  }

  async update(username: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.users.update({
      where: { username: username },
      data: updateUserDto,
      select: select,
    });
  }

  async remove(username: string) {
    return await this.prisma.users.delete({
      where: { username: username },
      select: select,
    });
  }
}
