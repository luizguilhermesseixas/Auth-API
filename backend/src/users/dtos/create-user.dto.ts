import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OmitType, PartialType } from '@nestjs/mapped-types';

class CreateAddressDto {
  @IsString()
  @MaxLength(255)
  street!: string;

  @IsString()
  @MaxLength(100)
  city!: string;

  @IsString()
  @MaxLength(100)
  state!: string;

  @IsString()
  @MaxLength(20)
  zipCode!: string;

  @IsString()
  @MaxLength(100)
  country!: string;
}

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['email', 'password'] as const),
) {}
