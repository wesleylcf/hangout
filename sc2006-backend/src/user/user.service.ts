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
import { DbUser } from '../../../sc2006-common/';

@Injectable()
export class UserService {
	constructor(private readonly logger: Logger) {}

	/*
    Returns User document if found, else null
  */
	async findOne(_username: string): Promise<DbUser | undefined> {
		const docRef = doc(db, 'users', _username);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists) {
			return undefined;
		}
		// TODO destructure docSnap.data() and return new object
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
				notifications: [],
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

	async bulkCreate(users: Omit<DbUser, 'createdAt'>[]) {
		// Get a new write batch
		const batch = writeBatch(db);

		users.forEach((user) => {
			const { username, ...rest } = user;

			const docRef = doc(db, 'users', username);
			batch.set(docRef, {
				createdAt: serverTimestamp() as unknown as Date,
				...rest,
			});
		});

		// Commit the batch
		await batch.commit();
	}
}
