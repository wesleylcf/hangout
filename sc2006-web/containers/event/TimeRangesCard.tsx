/* eslint-disable no-mixed-spaces-and-tabs */

import React, { useState } from 'react';
import { Button, TimePicker } from 'antd';
import moment from 'moment';
import { useNotification } from '../../hooks';

interface TimeRangesCardProps {
	addedTimeRanges: Array<[start: any, end: any] | []>;
	addTimeRange: (range: [any, any]) => void;
	removeTimeRange: (index: number) => void;
}

export const TimeRangesCard = ({
	addedTimeRanges,
	addTimeRange,
	removeTimeRange,
}: TimeRangesCardProps) => {
	const { RangePicker } = TimePicker;
	const TIME_FORMAT = 'HH:mm';
	const [selectedTimeRange, setSelectedTimeRange] = useState<
		[start: any, end: any]
	>([] as any);

	const notification = useNotification();

	const onAddTimeRange = (range: [any, any]) => {
		if (!range || range.length < 2) {
			return notification.error(
				'Please fill both start time and end time',
				'Invalid Time Range',
			);
		}
		const [start, end] = range;
		if (start.isAfter(end)) {
			return notification.error(
				'Please start time must be before end time',
				'Invalid Time Range',
			);
		}
		addTimeRange(range);
		// setAddedTimeRanges((timeRanges) => {
		// 	return [...timeRanges, range];
		// });
	};

	// const onRemoveTimeRange = (index: number) => {
	// 	setAddedTimeRanges((timeRanges) => [
	// 		...timeRanges.slice(0, index),
	// 		...timeRanges.slice(index + 1),
	// 	]);
	// };
	return (
		<div className="space-y-2">
			<b>Please pick the time ranges you are free</b>
			<div className="flex flex-row items-center space-x-4">
				<RangePicker
					minuteStep={15}
					format={TIME_FORMAT}
					onChange={(values) => {
						setSelectedTimeRange(values as any);
					}}
				/>
				<Button onClick={() => onAddTimeRange(selectedTimeRange)}>Add</Button>
			</div>
			<div className="flex flex-col">
				<b>Selected time ranges</b>
				{addedTimeRanges.length
					? addedTimeRanges.map((range, index) => {
							const [start, end] = range;
							return (
								<div
									key={index}
									className="flex flex-row items-center space-x-2"
								>
									<p className="my-auto">
										[{start.format(TIME_FORMAT)}, {end.format(TIME_FORMAT)}]
									</p>
									<Button onClick={() => removeTimeRange(index)}>Remove</Button>
								</div>
							);
					  })
					: '-'}
			</div>
		</div>
	);
};
