import { JwtAuthGuard } from './../common/guards/jwt-auth.guard.js';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';
import { CreateUserDto, UpdateUserDto } from './dtos/create-user.dto.js';
import { FindUsersQueryDto } from './dtos/find-users-query.dto.js';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Apenas ADMIN pode criar usuários
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ADMIN e MODERATOR podem listar todos
  @Get()
  @Roles(Role.ADMIN, Role.MODERATOR)
  async find(@Query() query: FindUsersQueryDto) {
    const includeDeleted = query.includedeleted ?? false;

    if (query.email) {
      const user = await this.usersService.findByEmail(
        query.email,
        includeDeleted,
      );
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      return user;
    }
    return this.usersService.findAll(includeDeleted);
  }

  // ADMIN e MODERATOR podem ver qualquer usuário
  @Get(':id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  findOne(@Param('id') id: string, @Query() query: FindUsersQueryDto) {
    const includeDeleted = query.includedeleted ?? false;
    return this.usersService.findById(id, includeDeleted);
  }

  // ADMIN pode atualizar qualquer usuário
  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  // ADMIN pode deletar qualquer usuário
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }

  @Patch(':id/soft-delete')
  @Roles(Role.ADMIN)
  softDelete(@Param('id') id: string) {
    return this.usersService.softDelete(id);
  }

  @Patch(':id/restore')
  @Roles(Role.ADMIN)
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id);
  }
}
