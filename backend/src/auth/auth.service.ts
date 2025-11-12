import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service.js';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/index.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user.id, roles: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
