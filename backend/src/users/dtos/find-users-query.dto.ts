// src/users/dto/find-users-query.dto.ts
import { IsOptional, IsBooleanString, IsEmail } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindUsersQueryDto {
  //   @ApiPropertyOptional({ type: Boolean, description: 'Incluir usuários soft deleted' })
  @IsOptional()
  @IsBooleanString({ message: 'includedeleted deve ser true ou false' })
  includedeleted?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;
}
