import { Injectable, Scope } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/index.js';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, AuthResponse } from './interfaces/index.js';
import { UsersRepository } from '../users/users.repository.js';
import { RegisterDto } from './dto/register.dto.js';
import { RedisService } from '../redis/redis.service.js';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
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
    const sessionId = randomUUID();

    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(
      { ...payload, sessionId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    await this.redisService.setRefreshToken(user.id, sessionId, refresh_token);

    return {
      access_token,
      refresh_token,
    };
  }

  async refresh(
    userId: string,
    sessionId: string,
    oldRefreshToken: string,
  ): Promise<AuthResponse> {
    const storedToken = await this.redisService.getRefreshToken(
      userId,
      sessionId,
    );

    if (!storedToken || storedToken !== oldRefreshToken) {
      throw new Error('Invalid refresh token');
    }

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await this.redisService.addToBlacklist(oldRefreshToken);
    await this.redisService.deleteRefreshToken(userId, sessionId);

    return await this.login(user);
  }

  async logout(
    userId: string,
    sessionId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.redisService.addToBlacklist(refreshToken);
    await this.redisService.deleteRefreshToken(userId, sessionId);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.redisService.deleteAllUserSessions(userId);
  }
}
