import { HttpException, HttpStatus } from '@nestjs/common';

export class ForeignKeyViolationException extends HttpException {
  constructor() {
    super(
      'This operation violates a foreign key constraint',
      HttpStatus.CONFLICT,
    );
  }
}
