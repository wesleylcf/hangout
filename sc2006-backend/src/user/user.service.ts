import { Injectable, Logger } from '@nestjs/common';
import { db } from 'src/firebase.config';
import {
	doc,
	getDoc,
	query,
	serverTimestamp,
	setDoc,
	Timestamp,
	WriteBatch,
	writeBatch,
	collection,
	where,
	getDocs,
	documentId,
} from 'firebase/firestore';
import { AuthUserDto } from 'src/auth/auth-user.dto';
import { DbUser, DbUserRes } from '../../../sc2006-common/';
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
	async findOne(
		_username: string,
	): Promise<(DbUserRes & { uuid: string }) | undefined> {
		const docRef = doc(db, 'users', _username);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return undefined;
		}
		const { createdAt, ...rest } = docSnap.data() as DbUser;
		return {
			uuid: docSnap.id,
			...rest,
			createdAt: createdAt.toDate(),
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
				schedule: {},
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

	async bulkCreate(
		users: Array<Omit<DbUser, 'createdAt'> & { username: string }>,
		existingBatch?: WriteBatch,
	) {
		const batch = existingBatch ? existingBatch : writeBatch(db);
		try {
			users.forEach(({ username, ...rest }) => {
				const user: DbUser = {
					...rest,
					createdAt: serverTimestamp() as Timestamp,
				};
				const newUserDocRef = doc(db, 'users', username);
				batch.set(newUserDocRef, user);
			});
			if (!existingBatch) {
				await batch.commit();
			}
			return { error: null };
		} catch (e) {
			this.logger.warn(
				`Could not batch write users: ${e.message}`,
				'UserService',
			);
		}
	}

	async bulkFindAllById(uuids: string[]): Promise<DbUserRes[]> {
		try {
			const usersRef = collection(db, 'users');
			const qry = query(usersRef, where(documentId(), 'in', uuids));
			const res = [];
			const querySnapshot = await getDocs(qry);
			querySnapshot.forEach((q) => res.push(q.data()));
			return res as unknown as DbUserRes[];
		} catch (e) {
			this.logger.warn(
				`Could not batch find users: ${e.message}`,
				'UserService',
			);
		}
	}

	// async seedUsers(
	// 	users: Array<Omit<DbUser, 'createdAt'> & { username: string }>,
	// ) {
	// 	try {
	// 		const batch = writeBatch(db);

	// 		const usersNotifications = users.map((user) => user.notifications);

	// 		const usersNotificationUuids = await Promise.all(
	// 			usersNotifications.map(
	// 				async (userNotification) =>
	// 					await this.notificationService.bulkCreate(userNotification),
	// 			),
	// 		);

	// 		users.forEach((user, index) => {
	// 			const { username, notifications, ...rest } = user;

	// 			const docRef = doc(db, 'users', username);
	// 			batch.set(docRef, {
	// 				createdAt: serverTimestamp(),
	// 				notificationIds: usersNotificationUuids[index].uuids,
	// 				...rest,
	// 			});
	// 		});

	// 		await batch.commit();
	// 	} catch (e) {
	// 		this.logger.warn('Could not batch write users', 'UserService');
	// 	}
	// }
}
