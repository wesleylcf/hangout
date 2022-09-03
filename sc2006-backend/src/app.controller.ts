import {
	Controller,
	Post,
	Body,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { DbNotification } from '../../sc2006-common/src';
import { AppService } from './app.service';
import { NotificationService } from './notification/notification.service';
import { LoggingInterceptor } from './logging.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly notificationService: NotificationService,
	) {}

	/*
    This endpoint should never be called. Use seed-data.sh to seed your data
  */
	@UseGuards(JwtAuthGuard)
	@Post('seed-data')
	seedData(@Body() { secret }: { secret: string }) {
		if (secret !== process.env.SEED_DATA_SECRET) {
			throw new UnauthorizedException();
		}
		return this.appService.seedData();
	}

	@Post('create')
	async test(
		@Body()
		{
			notifications,
		}: {
			notifications: Pick<DbNotification, 'title' | 'description'>[];
		},
	) {
		return await this.notificationService.bulkCreate(notifications);
	}
}
