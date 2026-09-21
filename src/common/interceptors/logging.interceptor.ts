import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logs every request with method, path, tenant, status, and duration.
 *
 * WHY: While developing, you want to see which requests hit which
 * tenant and which ones failed. This is a simple visibility layer,
 * not a transaction tracker — the transaction is Postgres's job.
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const orgId = req.user?.orgId ?? '-';
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          this.logger.log(
            `${method} ${url} ${res.statusCode} org=${orgId} ${Date.now() - start}ms`,
          );
        },
        error: (err) => {
          this.logger.warn(
            `${method} ${url} FAILED org=${orgId} ${Date.now() - start}ms - ${err.message}`,
          );
        },
      }),
    );
  }
}