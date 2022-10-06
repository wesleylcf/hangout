import React, { Dispatch, useMemo, useState } from 'react';
import { Collapse, FormInstance, Form } from 'antd';
import { DbEventRes } from '../../../types';
import { EventCard } from './EventCard';
import moment from 'moment';

interface EventSectionProps {
	events: DbEventRes[];
}

export const EventSection = React.memo(({ events }: EventSectionProps) => {
	return (
		<div className="space-y-4">
			{events &&
				events.map((event) => <EventCard key={event.uuid} event={event} />)}
		</div>
	);
});
