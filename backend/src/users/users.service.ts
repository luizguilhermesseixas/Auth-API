import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { User } from 'generated/prisma/index.js';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.create(createUserDto);
  }

  async findAll(includeDeleted: boolean = false): Promise<User[]> {
    return await this.usersRepository.findAll(includeDeleted);
  }

  async findById(
    id: string,
    includeDeleted: boolean = false,
  ): Promise<User | null> {
    return await this.usersRepository.findById(id, includeDeleted);
  }

  async findByEmail(
    email: string,
    includeDeleted: boolean = false,
  ): Promise<User | null> {
    return await this.usersRepository.findByEmail(email, includeDeleted);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersRepository.update(id, updateUserDto);
  }

  async softDelete(id: string): Promise<User> {
    return await this.usersRepository.softDelete(id);
  }

  async restore(id: string): Promise<User> {
    return await this.usersRepository.restore(id);
  }

  async delete(id: string): Promise<User> {
    return await this.usersRepository.delete(id);
  }
}
