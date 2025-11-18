import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto.js';
import { User } from 'generated/prisma/index.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const { address, ...userData } = data;

    return await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        ...(address && {
          address: {
            create: address,
          },
        }),
      },
      include: { address: true },
    });
  }

  async findAll(includeDeleted = false): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: includeDeleted ? {} : { deletedAt: null },
      include: { address: true },
    });
  }

  async findById(id: string, includeDeleted = false): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id, ...(includeDeleted ? {} : { deletedAt: null }) },
      include: { address: true },
    });
  }

  async findByEmail(
    email: string,
    includeDeleted = false,
  ): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email, ...(includeDeleted ? {} : { deletedAt: null }) },
      include: { address: true },
    });
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data,
      include: { address: true },
    });
  }

  async softDelete(id: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async restore(id: string): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
    });
  }

  async delete(id: string): Promise<User> {
    return await this.prisma.user.delete({ where: { id } });
  }
}
