import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { User } from 'generated/prisma/index.js';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request & { user: User }) {
    // return await this.authService.login(req.user);
  }
}
