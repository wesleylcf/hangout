import {
	Controller,
	Post,
	Body,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from './logging.interceptor';
import { UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guards';
import { SeedDataService } from './seed-data/seed-data.service';

@UseInterceptors(LoggingInterceptor)
@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		private readonly seedDataService: SeedDataService,
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
		return this.seedDataService.seedData();
	}
}
