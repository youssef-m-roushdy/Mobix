import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  ConflictException,
  NotFoundException,
  ValidationException,
} from '../../modules/shared/domain/exceptions';

/**
 * Maps typed domain exceptions to HTTP responses.
 *
 * WHY: The domain throws ValidationException, ConflictException, etc.
 * This filter translates them once, in one place, so no controller
 * needs try/catch for domain errors.
 */
@Catch(ValidationException, ConflictException, NotFoundException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let details: Record<string, unknown> = {};

    if (exception instanceof ValidationException) {
      status = HttpStatus.BAD_REQUEST;
      code = 'VALIDATION_ERROR';
      details = { field: exception.field };
    } else if (exception instanceof ConflictException) {
      status = HttpStatus.CONFLICT;
      code = 'CONFLICT';
      details = exception.details ?? {};
    } else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
      code = 'NOT_FOUND';
      details = { resource: exception.resource, id: exception.id };
    }

    response.status(status).json({
      error: code,
      message: exception.message,
      ...details,
    });
  }
}