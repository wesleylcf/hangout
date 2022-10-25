import { Badge } from 'antd';
import React, { ReactNode, useContext } from 'react';
import { Card } from '../../../components/common';
import { Divider } from 'antd';
import { DbEventRes, EVENT_DATETIME_FORMAT } from '../../../types';
import moment from 'moment';
import { useRouter } from 'next/router';
import { GlobalContext } from '../../../contexts';

interface EventCardProps {
	icon?: ReactNode;
	event: DbEventRes;
}

export const EventCard = React.memo(function _EventCard({
	icon,
	event,
}: EventCardProps) {
	const { me } = useContext(GlobalContext);
	const router = useRouter();
	return (
		<Card
			className={`p-5 flex-grow basis-5/12 hover:bg-cyan-100 h-full`}
			onClick={() => router.push(`events/${event.uuid}`)}
		>
			<div className="flex flex-row justify-between items-center h-3/4">
				<div className="w-4/6 flex flex-row items-center justify-between">
					<div>
						{icon && <div className="flex flex-row items-center">{icon}</div>}
						<h1 className="font-bold text-base m-0">{event.name}</h1>
					</div>
				</div>
				{event.creatorId === me?.uuid && (
					<Badge status="success" text="creator" />
				)}
			</div>
			<Divider style={{ margin: '0.5rem auto' }} />
			<div className="h-1/2 flex flex-row divide-x-2 space-x-8">
				<div>
					<h3 className="flex-3 text-slate-400 text-sm">CREATED BY</h3>
					<div>{event.creatorId}</div>
				</div>
				<div className="pl-8">
					<h3 className="flex-1 text-slate-400 text-sm">CREATED AT</h3>
					<div>{moment(event.createdAt).format(EVENT_DATETIME_FORMAT)}</div>
				</div>
				<div className="pl-8">
					<h3 className="flex-1 text-slate-400 text-sm"># PARTICIPANTS</h3>
					<div>{event.participants.length}</div>
				</div>
			</div>
		</Card>
	);
});
