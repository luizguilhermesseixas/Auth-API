import { Exclude } from 'class-transformer';
import { Role } from 'generated/prisma/index.js';

export class UserEntity {
  id!: string;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: Role;
  createdAt!: Date;
  updatedAt!: Date;

  @Exclude()
  password!: string;

  @Exclude()
  deletedAt!: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
