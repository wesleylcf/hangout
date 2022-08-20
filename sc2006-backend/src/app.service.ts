import { Injectable, Logger } from '@nestjs/common';
import { UserService } from './user/user.service';

const users = [
  {
    username: 'wesleylim.work@gmail.com',
    password: 'password',
  },
  {
    username: 'anais.lengoc@gmail.com',
    password: 'password',
  },
  {
    username: 'gpalanca10@gmail.com',
    password: 'password',
  },
  {
    username: 'jeda1998@gmail.com',
    password: 'password',
  },
  {
    username: 'lerlianping@hotmail.com',
    password: 'password',
  },
  {
    username: 'sufyanjais1@gmail.com',
    password: 'password',
  },
];

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
