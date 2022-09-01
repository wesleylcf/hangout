import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { NotificationService } from 'src/notification/notification.service';
const bcrypt = require('bcrypt'); // eslint-disable-line

@Injectable()
export class SeedDataService {
	private readonly emails: string[];
	constructor(
		private readonly authService: AuthService,
		private readonly notificationService: NotificationService,
	) {
		this.emails = [
			'wesleylim.work@gmail.com',
			'anais.lengoc@gmail.com',
			'gpalanca10@gmail.com',
			'jeda1998@gmail.com',
			'lerlianping@hotmail.com',
			'sufyanjais1@gmail.com',
		];
	}

	async getUsers() {
		const users = this.emails.map((email) => ({
			username: email,
			password: 'password',
			eventIds: [],
			schedule: [],
			notifications: this.emails.map((email) => ({
				title: `${email} has accepted your friend request`,
				description: `You can now add him to your events!`,
			})),
			address: null,
			friendIds: this.emails.filter((otherEmail) => otherEmail !== email),
		}));
		const passwords = await this.authService.hashPasswords(users);
		const hashedUsers = passwords.map((hash, index) => ({
			...users[index],
			password: hash as string,
		}));
		return hashedUsers;
	}
}
