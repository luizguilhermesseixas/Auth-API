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
import { UserEntity } from './entities/user.entity.js';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MODERATOR)
  async find(
    @Query() query: FindUsersQueryDto,
  ): Promise<UserEntity | UserEntity[]> {
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

  @Get(':id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  findOne(
    @Param('id') id: string,
    @Query() query: FindUsersQueryDto,
  ): Promise<UserEntity> {
    const includeDeleted = query.includedeleted ?? false;
    return this.usersService.findById(id, includeDeleted);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.delete(id);
  }

  @Patch(':id/soft-delete')
  @Roles(Role.ADMIN)
  softDelete(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.softDelete(id);
  }

  @Patch(':id/restore')
  @Roles(Role.ADMIN)
  async restore(@Param('id') id: string): Promise<UserEntity> {
    return this.usersService.restore(id);
  }
}
