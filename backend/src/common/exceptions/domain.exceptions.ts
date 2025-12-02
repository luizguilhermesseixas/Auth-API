import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(userId?: string) {
    super(
      userId ? `User with id ${userId} not found` : 'User not found',
      HttpStatus.NOT_FOUND,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}

export class InvalidRefreshTokenException extends HttpException {
  constructor() {
    super('Invalid refresh token', HttpStatus.UNAUTHORIZED);
  }
}

export class RefreshTokenNotFoundException extends HttpException {
  constructor() {
    super('Refresh token not found', HttpStatus.UNAUTHORIZED);
  }
}

export class BlacklistedTokenException extends HttpException {
  constructor() {
    super('Token is blacklisted', HttpStatus.UNAUTHORIZED);
  }
}

export class EmailAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(`Email ${email} already exists`, HttpStatus.CONFLICT);
  }
}

export class CacheOperationException extends HttpException {
  constructor(operation: string) {
    super(
      `Cache operation failed: ${operation}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class DatabaseOperationException extends HttpException {
  constructor(operation: string) {
    super(
      `Database operation failed: ${operation}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
