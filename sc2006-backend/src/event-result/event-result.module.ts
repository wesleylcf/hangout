import { Logger, Module } from '@nestjs/common';
import { NotificationModule } from 'src/notification/notification.module';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { EventResultController } from './event-result.controller';
import { EventResultService } from './event-result.service';

@Module({
	imports: [UserModule, NotificationModule],
	controllers: [EventResultController],
	providers: [EventResultService, UserService, Logger],
})
export class EventResultModule {}
