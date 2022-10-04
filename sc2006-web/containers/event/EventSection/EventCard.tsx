import { Badge } from 'antd';
import React, { ReactNode } from 'react';
import { Card } from '../../../components/common';
import { Divider } from 'antd';
import { DbEventRes, EVENT_DATETIME_FORMAT } from '../../../types';
import moment from 'moment';
import { useRouter } from 'next/router';

interface EventCardProps {
	icon?: ReactNode;
	event: DbEventRes;
}

export const EventCard = ({ icon, event }: EventCardProps) => {
	const now = moment();
	const router = useRouter();
	return (
		<Card
			className={`p-5 w-full hover:bg-cyan-400 hover:text-white`}
			onClick={() => router.push(`events/${event.uuid}`)}
		>
			<div className="flex flex-row justify-between items-center h-3/4">
				<div className="w-5/6 flex flex-row items-center justify-between">
					<div>
						{icon && <div className="flex flex-row items-center">{icon}</div>}
						<h1 className="font-bold text-base m-0">{event.name}</h1>
					</div>
				</div>
				<Badge
					status={now.isSameOrBefore(event.expiresAt) ? 'success' : 'error'}
					text={now.isSameOrBefore(event.expiresAt) ? 'active' : 'expired'}
				/>
			</div>
			<Divider style={{ margin: '0.5rem auto' }} />
			<div className="h-1/2 flex flex-row space-x-8 divide-x-2">
				<div>
					<h3 className="text-slate-400 text-sm">CREATED BY</h3>
					<div>{event.creatorId}</div>
				</div>
				<div className="pl-8">
					<h3 className="text-slate-400 text-sm">CREATED AT</h3>
					<div>{moment(event.createdAt).format(EVENT_DATETIME_FORMAT)}</div>
				</div>
				<div className="pl-8">
					<h3 className="text-slate-400 text-sm"># PARTICIPANTS</h3>
					<div>
						{event.authParticipantIds.length +
							event.manualParticipants.length +
							1}
					</div>
				</div>
			</div>
		</Card>
	);
};
