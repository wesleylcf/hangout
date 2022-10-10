import React, {
	useState,
	ReactNode,
	useMemo,
	useRef,
	useEffect,
	useContext,
} from 'react';
import { Layout, Divider, Menu, Tabs } from 'antd';
import { useRouter } from 'next/router';
import { NAVIGATION_HEIGHT } from '../../constants';
import { PlusCircleFilled } from '@ant-design/icons';
import { DbEventRes, ListBriefEventRes } from '../../types';
import { GlobalContext, PageContext } from '../../contexts';
import { eventService } from '../../services';
import { useNotification } from '../../hooks';
import { ListCreatedEvents } from '../../containers/event/ListCreatedEvents';
import { EventSection } from '../../containers/event/EventSection';

enum EventMenuItemType {
	CREATED_EVENTS = '#created',
	PARTICIPATING_EVENTS = '#participating',
	ACTIVE_EVENTS = '#active',
	EXPIRED_EVENTS = '#past',
}

interface EventMenuItem {
	label?: ReactNode;
	key: EventMenuItemType;
	icon?: ReactNode;
	title?: string;
	children?: Array<ReactNode | EventMenuItem>;
}

function ListEventsPage() {
	const { me } = useContext(GlobalContext);
	const { setLoading } = useContext(PageContext);
	const notification = useNotification();
	const [events, setEvents] = useState<ListBriefEventRes>();

	const router = useRouter();

	useEffect(() => {
		const pullAndSetEvents = async () => {
			try {
				const events = await eventService.getBriefEvents({
					eventUuids: me!.eventIds,
					userUuid: me!.uuid,
				});
				setEvents(events);
			} catch (e) {
				notification.apiError(e);
			}
		};
		setLoading(true);
		pullAndSetEvents();
		setLoading(false);
	}, [me?.eventIds]);

	const onCreateEvent = () => {
		router.push('/events/create');
	};

	const tabs = [
		{
			label: 'Active',
			key: 'active',
			children: (
				<>
					<EventSection events={events?.active.creator || []} />
					<EventSection events={events?.active.participant || []} />
				</>
			),
		},
		{
			label: 'Expired',
			key: 'expired',
			children: (
				<>
					<EventSection events={events?.expired.creator || []} />
					<EventSection events={events?.expired.participant || []} />
				</>
			),
		},
	];
	return (
		<div className="w-full h-full p-12">
			<Tabs items={tabs} />
			{/* <ListCreatedEvents events={createdEvents} />
			<div className="flex flex-col p-12">
				<h1 className="text-2xl">Participating Events</h1>
				<h2 className="text-lg" ref={refs.active}>
					Current Events
				</h2>
				<h2 className="text-lg" ref={refs.expired}>
					Past Events
				</h2>
			</div> */}
			<PlusCircleFilled
				style={{
					color: 'rgb(34 211 238)',
					position: 'fixed',
					bottom: 45,
					right: 45,
					fontSize: '4rem',
				}}
				onClick={onCreateEvent}
			/>
		</div>
	);
}

export default ListEventsPage;
