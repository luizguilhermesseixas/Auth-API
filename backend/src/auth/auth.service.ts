import { Injectable, Scope } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/index.js';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, AuthResponse } from './interfaces/index.js';
import { UsersRepository } from '../users/users.repository.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const user = await this.usersRepository.create(registerDto);
    return await this.login(user);
  }

  async login(user: User): Promise<AuthResponse> {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id,
      roles: user.role,
    };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
    };
  }
}
