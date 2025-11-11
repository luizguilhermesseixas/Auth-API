import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersModule } from 'src/users/users.module.js';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
