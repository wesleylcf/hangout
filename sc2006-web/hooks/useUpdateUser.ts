import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect } from 'react';
import { GlobalContextProps } from '../contexts';
import { db } from '../services';
import { DbUser } from '../types';

type useUpdateUserProps = Pick<GlobalContextProps, 'me' | 'setMe'>;

/* 
	Sets up a snapshot listener on the user document, and updates notificationIds, eventIds, and friendIds of Me if the lengths differ.
	Only the above specific properties are updated since they can be updated by other users. The rest of the properties should require
	a backend call by the current user and will be set by calling setMe(<Result of making backend call>)
*/
export const useUpdateUser = ({ me, setMe }: useUpdateUserProps) => {
	useEffect(() => {
		if (!me) return;

		const unsub = onSnapshot(
			doc(db, 'users', me.uuid),
			(snapshot) => {
				const data = snapshot.data() as DbUser;
				console.log('snapshot recevied', snapshot, snapshot.data());

				if (!snapshot.metadata.hasPendingWrites) {
					const { notificationIds, eventIds, friendIds } = data;
					setMe((prevMe) => {
						if (
							prevMe!.notificationIds.length === notificationIds.length &&
							prevMe!.eventIds.length === eventIds.length &&
							prevMe!.friendIds.length === friendIds.length
						)
							return prevMe;
						return {
							...prevMe!,
							notificationIds,
							eventIds,
							friendIds,
						};
					});
				}
			},
			(error) => {
				console.log('error listening to user doc', error.message);
			},
		);

		return () => {
			unsub && unsub();
		};
	}, [me]);
};
