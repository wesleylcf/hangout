import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user/user.service';
import { SeedDataService } from './seed-data/seed-data.service';

@Injectable()
export class AppService {
	constructor(
		private logger: Logger,
		private userService: UserService,
		private seedDataService: SeedDataService,
	) {}

	seedData() {
		const users = this.seedDataService.getUsers();
		try {
			this.userService.bulkCreate(users);
			this.logger.log('USER data seeded: SUCCESS', 'AppService');
		} catch (e) {
			this.logger.log('USER data seeded: FAILURE', 'AppService');
		}
	}
}
