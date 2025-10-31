import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto.js';
import { User } from 'generated/prisma/index.js';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data });
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
