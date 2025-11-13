import { User } from 'generated/prisma/index.js';

export interface RequestWithUser extends Request {
  user: User;
}
