// src/users/dto/find-users-query.dto.ts
import { Transform } from 'class-transformer';
import { IsOptional, IsBooleanString, IsEmail } from 'class-validator';
// import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindUsersQueryDto {
  //   @ApiPropertyOptional({ type: Boolean, description: 'Incluir usuários soft deleted' })
  @IsOptional()
  @IsBooleanString({ message: 'include deleted deve ser true ou false' })
  @Transform(({ value }) => value === 'true')
  includedeleted?: boolean;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;
}
