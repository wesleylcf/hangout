import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user/user.service';
import { users } from './seed-data';

@Injectable()
export class AppService {
  constructor(private userService: UserService, private logger: Logger) {}

  seedData() {
    try {
      this.userService.bulkCreate(users);
      this.logger.log('USER data seeded: SUCCESS', 'AppService');
    } catch (e) {
      this.logger.log('USER data seeded: FAILURE', 'AppService');
    }
  }
}
