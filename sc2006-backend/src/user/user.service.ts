import { Injectable, Logger } from '@nestjs/common';
import { db } from 'src/firebase.config';
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	Timestamp,
	writeBatch,
} from 'firebase/firestore';
import { AuthUserDto } from 'src/auth/auth-user.dto';
import { DbUser, SeedUser } from '../../../sc2006-common/';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class UserService {
	constructor(
		private readonly logger: Logger,
		private readonly notificationService: NotificationService,
	) {}

	/*
    Returns User document if found, else undefined
  */
	async findOne(_username: string): Promise<DbUser | undefined> {
		const docRef = doc(db, 'users', _username);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists) {
			return undefined;
		}
		return {
			username: docSnap.id,
			...(docSnap.data() as Omit<DbUser, 'username'>),
		};
	}

	async create({ username, password }: AuthUserDto) {
		try {
			const docRef = doc(db, 'users', username);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				throw new Error('User already exists');
			}
			const dbUser: Omit<DbUser, 'username'> = {
				password,
				createdAt: serverTimestamp() as Timestamp,
				eventIds: [],
				schedule: [],
				notificationIds: [],
				address: null,
				friendIds: [],
			};
			await setDoc(doc(db, 'users', username), dbUser);
			this.logger.log(`User ${username} created`, 'UserService');
		} catch (e) {
			this.logger.warn(`Unable to create User: ${e.message}`, 'UserService');
			throw e;
		}
	}

	async seedUsers(users: SeedUser[]) {
		try {
			const batch = writeBatch(db);

			const usersNotifications = users.map((user) => user.notifications);

			const usersNotificationUuids = await Promise.all(
				usersNotifications.map(
					async (userNotification) =>
						await this.notificationService.bulkCreate(userNotification),
				),
			);

			users.forEach((user, index) => {
				const { username, notifications, ...rest } = user;

				const docRef = doc(db, 'users', username);
				batch.set(docRef, {
					createdAt: serverTimestamp(),
					notificationIds: usersNotificationUuids[index].uuids,
					...rest,
				});
			});

			await batch.commit();
		} catch (e) {
			this.logger.warn('Could not batch write users', 'UserService');
		}
	}
}
