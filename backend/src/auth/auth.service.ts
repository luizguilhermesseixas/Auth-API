import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service.js';
import * as bcrypt from 'bcrypt';
import { User } from 'generated/prisma/index.js';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
