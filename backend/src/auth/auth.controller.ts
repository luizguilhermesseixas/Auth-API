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

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: RequestWithUser,
    @Body() body: { refresh_token: string },
  ) {
    const decoded = this.authService['jwtService'].decode(body.refresh_token);
    await this.authService.logout(
      req.user.id,
      decoded.sessionId,
      body.refresh_token,
    );
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(@Req() req: RequestWithUser) {
    await this.authService.logoutAll(req.user.id);
    return { message: 'Logged out from all devices' };
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
