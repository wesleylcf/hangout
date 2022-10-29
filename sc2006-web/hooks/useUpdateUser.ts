import { doc, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { GlobalContextProps } from '../contexts';
import { db } from '../services';
import { DbUser, EVENT_DATETIME_FORMAT, TimeRange } from '../types';

type useUpdateUserProps = Pick<GlobalContextProps, 'me' | 'setMe'>;

/* 
	Sets up a snapshot listener on the user document, and updates notificationIds, eventIds, and friendIds of Me if the lengths differ.
	Only the above specific properties are updated since they can be updated by other users. The rest of the properties should require
	a backend call by the current user and will be set by calling setMe(<Result of making backend call>)
*/
export const useUpdateUser = ({ me, setMe }: useUpdateUserProps) => {
	// const [internalUser, setInternalUser] = useState(me);

	useEffect(() => {
		if (!me) return;

		const unsub = onSnapshot(
			doc(db, 'users', me.uuid),
			(snapshot) => {
				const data = snapshot.data() as DbUser;
				console.log('snapshot received', snapshot, snapshot.data());

				if (!snapshot.metadata.hasPendingWrites) {
					setMe((prevMe) => {
						if (
							prevMe!.notificationIds.length === data.notificationIds.length &&
							prevMe!.eventIds.length === data.eventIds.length &&
							prevMe!.friendIds.length === data.friendIds.length &&
							isScheduleEqual(prevMe?.schedule, data.schedule)
						)
							return prevMe;

						return {
							...prevMe!,
							notificationIds: data.notificationIds,
							eventIds: data.eventIds,
							friendIds: data.friendIds,
							schedule: data.schedule,
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

function isScheduleEqual(
	current?: Record<string, TimeRange[]>,
	next?: Record<string, TimeRange[]>,
) {
	if (!current || !next) return false;
	if (Object.keys(current).length !== Object.keys(next).length) return false;
	Object.keys(next).forEach((date) => {
		if (!(date in current)) return false;
		if (current[date].length != next[date].length) return false;
		for (let i = 0; i < current[date].length; i++) {
			if (
				!moment(current[date][i].start, EVENT_DATETIME_FORMAT).isSame(
					moment(next[date][i].start),
				) ||
				!moment(current[date][i].end, EVENT_DATETIME_FORMAT).isSame(
					moment(next[date][i].end),
				)
			) {
				return false;
			}
		}
	});

	return true;
}
