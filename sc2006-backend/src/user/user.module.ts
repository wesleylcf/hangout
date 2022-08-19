import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerMiddleware } from 'src/logger.middleware';

@Module({
  providers: [UserService, Logger],
  exports: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
  }
}
