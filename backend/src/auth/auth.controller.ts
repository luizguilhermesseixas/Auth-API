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
import type {
  RequestWithRefreshUser,
  RequestWithUser,
} from './interfaces/index.js';
import { UsersService } from '../users/users.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { Public } from '../common/decorators/public.decorator.js';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-refresh-auth.guard.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';

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

  @UseGuards(JwtRefreshAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: RequestWithRefreshUser) {
    await this.authService.logout(
      req.user.id,
      req.user.sessionId,
      req.user.refreshToken,
    );
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Req() req: RequestWithUser) {
    await this.authService.logoutAll(req.user.id);
    return { message: 'Logged out from all devices' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: RequestWithUser) {
    const user = await this.usersService.findById(req.user.id);

    return user;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: RequestWithRefreshUser) {
    return await this.authService.refresh(
      req.user.id,
      req.user.sessionId,
      req.user.refreshToken,
    );
  }
}
