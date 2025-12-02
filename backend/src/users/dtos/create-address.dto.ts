import { PartialType } from '@nestjs/mapped-types';
import { IsString, MaxLength } from 'class-validator';

export class CreateAddressDto {
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

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
