import { Injectable, Logger } from '@nestjs/common';
import {
	DbNotification,
	DbEvent,
	DbEventRes,
} from '../../../sc2006-common/src';
import { db } from 'src/firebase.config';
import {
	doc,
	getDoc,
	serverTimestamp,
	Timestamp,
	writeBatch,
	collection,
	query,
	where,
	getDocs,
	documentId,
	arrayUnion,
	WriteBatch,
} from 'firebase/firestore';

@Injectable()
export class EventService {
	constructor(private readonly logger: Logger) {}

	async createOne(
		event: Omit<DbEvent, 'createdAt' | 'creatorId'>,
		creatorId: string,
	): Promise<{ uuid: string }> {
		try {
			const batch = writeBatch(db);
			const newEvent: DbEvent = {
				createdAt: serverTimestamp() as Timestamp,
				...event,
				creatorId,
			};
			const newEventDocRef = doc(collection(db, 'events'));
			const creatorDocRef = doc(db, 'users', creatorId);
			const uuid = newEventDocRef.id;

			batch.set(newEventDocRef, newEvent);
			batch.update(creatorDocRef, {
				eventIds: arrayUnion(uuid),
			});
			await batch.commit();

			this.logger.log(`Event ${uuid} created by ${creatorId}`, 'EventService');
			return { uuid };
		} catch (e) {
			this.logger.warn(`Unable to create event: ${e.message}`, 'EventService');
			throw e;
		}
	}

	async findOne(uuid: string): Promise<DbEventRes | undefined> {
		const docRef = doc(db, 'events', uuid);
		const docSnap = await getDoc(docRef);
		if (!docSnap.exists()) {
			return undefined;
		}

		const { createdAt, ...rest } = docSnap.data() as Omit<DbEvent, 'uuid'>;
		return {
			uuid: docSnap.id,
			...rest,
			createdAt: createdAt.toDate(),
		};
	}

	async findMany(uuids: string[]) {
		const eventsRef = collection(db, 'events');
		const docRefs = uuids.map((uuid) => doc(db, 'events', uuid));
		const qry = query(eventsRef, where(documentId(), 'in', docRefs));
		const querySnapshot = await getDocs(qry);
		const result: DbEventRes[] = [];
		querySnapshot.forEach((doc) => {
			const { createdAt, ...rest } = doc.data() as Omit<DbEvent, 'uuid'>;
			result.push({
				uuid: doc.id,
				...rest,
				createdAt: createdAt.toDate(),
			});
		});
		return result;
	}

	async bulkCreate(
		notifications: Pick<DbNotification, 'title' | 'description'>[],
		existingBatch?: WriteBatch,
	) {
		// Get a new write batch
		const batch = existingBatch ? existingBatch : writeBatch(db);
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

			if (!existingBatch) {
				await batch.commit();
			}

			return { uuids };
		} catch (e) {
			this.logger.warn(
				`Could not batch write notifications: ${e.message}`,
				'NotificationService',
			);
		}
	}

	async bulkUpdate(
		notifications: {
			uuid: string;
			updatedNotification: Partial<DbNotification>;
		}[],
		existingBatch?: WriteBatch,
	) {
		const batch = existingBatch ? existingBatch : writeBatch(db);
		try {
			notifications.forEach(({ uuid, updatedNotification }) => {
				const ref = doc(db, 'notifications', uuid);

				batch.set(ref, updatedNotification, { merge: true });
			});

			if (!existingBatch) {
				await batch.commit();
			}
			return { error: null };
		} catch (e) {
			this.logger.warn(
				`Could not batch update notifications: ${e.message}`,
				'NotificationService',
			);
		}
	}
}
