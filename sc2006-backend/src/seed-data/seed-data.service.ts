import { Injectable } from '@nestjs/common';
import { DbUser } from 'src/constants';

interface SeedUser extends Omit<DbUser, 'createdAt'> {
  username: string;
}

@Injectable()
export class SeedDataService {
  private readonly emails: string[];
  private readonly users: SeedUser[];
  constructor() {
    this.emails = [
      'wesleylim.work@gmail.com',
      'anais.lengoc@gmail.com',
      'gpalanca10@gmail.com',
      'jeda1998@gmail.com',
      'lerlianping@hotmail.com',
      'sufyanjais1@gmail.com',
    ];
    this.users = this.emails.map((email) => ({
      username: email,
      password: 'password',
      eventIds: [],
      schedule: [],
      notifications: [],
      address: null,
      friendIds: this.emails.filter((otherEmail) => otherEmail !== email),
    }));
  }

  getUsers() {
    return this.users;
  }
}
