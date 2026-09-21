import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';

/**
 * Maps Prisma errors to HTTP responses.
 *
 * WHY: Without this, a unique-constraint race shows the client a raw
 * Prisma error message. This filter turns it into a clean 409.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'DATABASE_ERROR';
    let message = 'A database error occurred';

    switch (exception.code) {
      case 'P2002': // Unique constraint failed
        status = HttpStatus.CONFLICT;
        code = 'UNIQUE_VIOLATION';
        message = 'A record with these values already exists';
        break;
      case 'P2003': // Foreign key constraint failed
        status = HttpStatus.CONFLICT;
        code = 'FOREIGN_KEY_VIOLATION';
        message = 'Related record does not exist';
        break;
      case 'P2025': // Record not found for update/delete
        status = HttpStatus.NOT_FOUND;
        code = 'NOT_FOUND';
        message = 'Record not found';
        break;
      default:
        this.logger.error(`Unhandled Prisma error: ${exception.code}`, exception.stack);
    }

    response.status(status).json({ error: code, message });
  }
}