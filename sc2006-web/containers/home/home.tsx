import React, { useContext, useLayoutEffect, useState } from 'react';
import { GreetingHeader, Card } from '../../components/common';
import { Me, PageContext } from '../../contexts';
import { ScheduleSection } from './ScheduleSection';
import { eventService } from '../../services';
import { useNotification } from '../../hooks';
import { ListBriefEventRes } from '../../types';
import { Badge } from 'antd';
import moment from 'moment';

interface HomePageProps {
	me: Me;
}

export const Home = ({ me }: HomePageProps) => {
	const now = new Date();
	const [events, setEvents] = useState<ListBriefEventRes>();
	const notification = useNotification();
	const { setLoading } = useContext(PageContext);

	useLayoutEffect(() => {
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
		if (me) {
			pullAndSetEvents();
		}

		setLoading(false);
	}, [me]);
	console.log(events);
	return (
		<div className="w-full h-full p-16">
			<GreetingHeader
				now={now}
				name={me.uuid}
				className="flex flex-row items-center text-3xl"
				nameClassName="text-cyan-400 pl-2"
			/>
			<Card className="flex flex-col items-center p-8 space-y-4">
				<h1 className="text-2xl">
					Here&apos;s your events for <i>{moment().format('MMMM')}</i>
				</h1>
				{events && <ScheduleSection events={events.active} me={me} />}
				<div className="flex flex-col">
					<Badge status="success" text=": You are the creator" />
					<Badge status="warning" text=": You are a participant" />
				</div>
			</Card>
		</div>
	);
};
