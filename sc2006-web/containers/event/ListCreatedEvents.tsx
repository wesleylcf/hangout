import React, { ReactNode, RefObject } from 'react';
import { Card } from '../../components/common';
import { DbEventRes } from '../../types';
import { EventSection } from './EventSection/EventSection';

interface ListCreatedEventsProps {
	headerRef: RefObject<HTMLHeadingElement>;
	events: Array<DbEventRes>;
}

export const ListCreatedEvents = ({
	headerRef,
	events,
}: ListCreatedEventsProps) => {
	return (
		<div className="flex flex-col p-12">
			<h1 className="text-2xl mb-4" ref={headerRef}>
				Created Events
			</h1>
			<EventSection events={events} />
		</div>
	);
};
