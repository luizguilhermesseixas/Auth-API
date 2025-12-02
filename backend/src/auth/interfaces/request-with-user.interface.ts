import { User } from 'generated/prisma/index.js';
import { Role } from '../../common/enums/role.enum.js';

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithRefreshUser extends Request {
  user: {
    id: string;
    email: string;
    role: Role;
    sessionId: string;
    refreshToken: string;
  };
}
