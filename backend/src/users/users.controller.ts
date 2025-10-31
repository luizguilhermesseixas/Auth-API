import { UsersService } from './users.service.js';

export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
