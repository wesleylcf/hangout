/* eslint-disable no-mixed-spaces-and-tabs */

import React, { useState } from 'react';
import { Button, TimePicker } from 'antd';
import moment from 'moment';
import { useNotification } from '../../hooks';
import { EVENT_DATETIME_FORMAT } from '../../types';

interface TimeRangesCardProps {
	addedTimeRanges: Array<{ start: string; end: string }>;
	addTimeRange: (range: [string, string]) => void;
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
		[start: string, end: string]
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
		const formattedTimeRange = [
			start.format(EVENT_DATETIME_FORMAT),
			end.format(EVENT_DATETIME_FORMAT),
		] as [string, string];
		addTimeRange(formattedTimeRange);
	};

	return (
		<div className="space-y-2">
			<div>
				Please pick the time ranges you are{' '}
				<b className="text-cyan-500">busy</b>
			</div>
			<div className="flex flex-row items-center space-x-4">
				<RangePicker
					minuteStep={15}
					format={TIME_FORMAT}
					onChange={(values) => {
						console.log(values);
						setSelectedTimeRange(values as any);
					}}
					value={
						selectedTimeRange.length
							? [
									moment(selectedTimeRange[0], EVENT_DATETIME_FORMAT),
									moment(selectedTimeRange[1], EVENT_DATETIME_FORMAT),
							  ]
							: [moment().startOf('day'), moment().endOf('day').minutes(0)]
					}
				/>
				<Button
					onClick={() => {
						onAddTimeRange(selectedTimeRange);
						setSelectedTimeRange((prevTimeRange) => [
							prevTimeRange[1],
							moment().endOf('day').minutes(0).format(EVENT_DATETIME_FORMAT),
						]);
					}}
				>
					Add
				</Button>
			</div>
			<div className="flex flex-col">
				<b>Selected time ranges</b>
				<div className="space-y-2">
					{addedTimeRanges.length
						? addedTimeRanges.map((range, index) => {
								const { start, end } = range;
								return (
									<div
										key={index}
										className="flex flex-row items-center space-x-2"
									>
										<p className="my-auto">
											[{moment(start).format(TIME_FORMAT)},{' '}
											{moment(end).format(TIME_FORMAT)}]
										</p>
										<Button onClick={() => removeTimeRange(index)}>
											Remove
										</Button>
									</div>
								);
						  })
						: '-'}
				</div>
			</div>
		</div>
	);
};
