import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from '../common/guards/local-auth.guard.js';
import type { RequestWithUser } from './interfaces/index.js';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: RequestWithUser) {
    return await this.authService.login(req.user);
  }

  @Get('me')
  getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user.id);

    return user;
  }
}
