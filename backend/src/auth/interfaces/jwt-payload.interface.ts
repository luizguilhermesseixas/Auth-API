import { Role } from 'generated/prisma/index.js';

export interface JwtPayload {
  email: string;
  sub: string;
  roles: Role;
}
