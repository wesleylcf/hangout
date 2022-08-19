import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Before Request reaches controller
    const req = context.switchToHttp().getRequest();
    this.logger.log(
      `Request: ${JSON.stringify(req.body)}`,
      `${req.method} ${req.path}`,
    );

    // Before Response sent to client
    return next.handle().pipe(
      tap((data) => {
        const { statusCode } = context.switchToHttp().getResponse();
        this.logger.log(
          `Response: ${JSON.stringify({ statusCode, data })}`,
          `${req.method} ${req.path}`,
        );
      }),
    );
  }
}
