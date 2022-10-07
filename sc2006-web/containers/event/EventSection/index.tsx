import React from 'react';
import { DbEventRes } from '../../../types';
import { EventCard } from './EventCard';

interface EventSectionProps {
	events: DbEventRes[];
}

export const EventSection = React.memo(function _EventSection({
	events,
}: EventSectionProps) {
	return (
		<div className="space-y-4">
			{events &&
				events.map((event) => <EventCard key={event.uuid} event={event} />)}
		</div>
	);
});
