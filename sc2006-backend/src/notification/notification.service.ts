import { Injectable, Logger } from '@nestjs/common';
import { Notification } from '../../../sc2006-common/src';
import { db } from 'src/firebase.config';
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	Timestamp,
	writeBatch,
	collection,
} from 'firebase/firestore';

@Injectable()
export class NotificationService {
	constructor(private readonly logger: Logger) {}
	async createOne({
		title,
		description,
	}: Pick<Notification, 'title' | 'description'>): Promise<{ uuid: string }> {
		try {
			const notification: Omit<Notification, 'uuid'> = {
				createdAt: serverTimestamp() as Timestamp,
				seenAt: null,
				title,
				description,
			};
			const newNotificationDocRef = doc(collection(db, 'notifications'));
			await setDoc(newNotificationDocRef, notification);

			const uuid = newNotificationDocRef.id;
			this.logger.log(`Notification ${uuid} created`, 'NotificationService');
			return { uuid };
		} catch (e) {
			this.logger.warn(
				`Unable to create Notification: ${e.message}`,
				'NotificationService',
			);
			throw e;
		}
	}

	async findOne(uuid: string): Promise<Notification | undefined> {
		const docRef = doc(db, 'users', uuid);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists) {
			return undefined;
		}
		return {
			uuid: docSnap.id,
			...(docSnap.data() as Omit<Notification, 'uuid'>),
		};
	}

	async bulkCreate(
		notifications: Pick<Notification, 'title' | 'description'>[],
	) {
		// Get a new write batch
		const batch = writeBatch(db);
		const uuids = [];
		try {
			notifications.forEach(({ title, description }) => {
				const newNotificationDocRef = doc(collection(db, 'notifications'));
				uuids.push(newNotificationDocRef.id);

				batch.set(newNotificationDocRef, {
					createdAt: serverTimestamp() as unknown as Date,
					seenAt: null,
					title,
					description,
				});
			});

			// Commit the batch
			await batch.commit();
			return { uuids };
		} catch (e) {
			this.logger.warn(
				'Could not batch write notifications',
				'NotificationService',
			);
		}
	}
}
