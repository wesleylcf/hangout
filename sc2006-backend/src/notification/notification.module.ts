import { Logger, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Module({
	providers: [NotificationService, Logger],
	exports: [NotificationService],
})
export class NotificationModule {}
