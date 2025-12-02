import { IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindUsersQueryDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includedeleted?: boolean;
}
