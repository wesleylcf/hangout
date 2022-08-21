import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { DbUser } from 'src/constants';
const bcrypt = require('bcrypt'); // eslint-disable-line

interface SeedUser extends Omit<DbUser, 'createdAt'> {
	username: string;
}

@Injectable()
export class SeedDataService {
	private readonly emails: string[];
	private users: SeedUser[];
	constructor(private authService: AuthService) {
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

	async getUsers() {
		const passwords = await this.authService.hashPasswords(this.users);
		const hashedUsers = passwords.map((hash, index) => ({
			...this.users[index],
			password: hash,
		}));
		return hashedUsers;
	}
}
