import React, { Dispatch, useMemo, useState } from 'react';
import { Collapse, FormInstance, Form } from 'antd';
import { DbEventRes } from '../../../types';
import { EventCard } from './EventCard';
import moment from 'moment';

interface EventSectionProps {
	events: DbEventRes[];
}

export const EventSection = ({ events }: EventSectionProps) => {
	const activeEvents = useMemo(() => {
		const now = moment();
		return events.filter((e) => now.isSameOrBefore(e.expiresAt));
	}, [events.length]);

	const expiredEvents = useMemo(() => {
		const now = moment();
		return events.filter((e) => now.isAfter(e.expiresAt));
	}, [events.length]);
	return (
		<div className="space-y-4">
			{activeEvents.length &&
				activeEvents.map((event) => (
					<EventCard key={event.uuid} event={event} />
				))}
			{expiredEvents.length &&
				expiredEvents.map((event) => (
					<EventCard key={event.uuid} event={event} />
				))}
		</div>
	);
};
