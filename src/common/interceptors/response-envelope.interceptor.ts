import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * Wraps every successful response in { success: true, data: ... }.
 *
 * WHY: One shape for all successes. Errors are already enveloped by the
 * exception filters. Clients can rely on the same structure everywhere.
 *
 * Skips wrapping when the handler already returned an envelope (has `success`).
 */
@Injectable()
export class ResponseEnvelopeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        if (data === undefined || data === null) {
          return { success: true, data: null };
        }
        if (typeof data === 'object' && 'success' in data) {
          return data; // already enveloped
        }
        return { success: true, data };
      }),
    );
  }
}