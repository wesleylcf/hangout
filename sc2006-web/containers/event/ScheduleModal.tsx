/* eslint-disable @typescript-eslint/ban-types*/
import React, { useState } from 'react';
import { Badge, Calendar, Collapse, Modal, ModalProps, BadgeProps } from 'antd';
import moment, { Moment } from 'moment';
import { CollapseItemHeader } from '../../components/common';
import { TimeRangesCard } from './TimeRangesCard';

export type ScheduleModalProps = Omit<ModalProps, 'onOk'> & {
	onOk: (value: any) => void;
	busyTimeRanges: Record<string, Array<[Moment, Moment]>>;
};

export const ScheduleModal = ({
	onOk,
	busyTimeRanges,
	...props
}: ScheduleModalProps) => {
	const DATE_FORMAT = 'ddd (DD MMM)';
	const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
	const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
	const [internalBusyTimeRanges, setInternalBusyTimeRanges] = useState<
		Record<string, Array<[any, any]>>
	>(busyTimeRanges || {});

	const now = moment();
	const startDate = moment()
		.day(now.get('day') + 1)
		.hour(0)
		.second(0);
	const endDate = moment()
		.day(startDate.get('day') + 7)
		.hour(24)
		.second(59);

	const onSelectDate = (moment: Moment) => {
		const presentableDate = moment.format(DATE_FORMAT);
		if (!moment.isBetween(startDate, endDate, undefined, '[]')) return;
		setSelectedDates((selected) => {
			const selectedCopy = new Set(selected);
			setInternalBusyTimeRanges((timeRanges) => {
				return { ...timeRanges, [presentableDate]: [] };
			});
			if (selected.has(presentableDate)) {
				selectedCopy.delete(presentableDate);
				return selectedCopy;
			} else {
				return selectedCopy.add(presentableDate);
			}
		});
	};

	const renderDateCellOverride = (moment: Moment) => {
		const presentableDate = moment.format(DATE_FORMAT);
		const date = moment.date();
		let bgColorClassName = '';

		const isInRange = moment.isBetween(startDate, endDate, undefined, '[]');
		if (!isInRange) {
			bgColorClassName = 'bg-gray-50';
		}
		if (selectedDates.has(presentableDate)) {
			bgColorClassName = 'bg-cyan-50';
		}

		return (
			<div
				className={'h-20 w-full flex flex-col text-black '.concat(
					bgColorClassName,
				)}
				style={{
					paddingRight: '12px',
					margin: 0,
					border: '0.5px solid lightgray',
				}}
				key={date}
			>
				{date}
				{isInRange && internalBusyTimeRanges
					? getBadge(internalBusyTimeRanges[presentableDate])
					: null}
			</div>
		);
	};

	const onAddTimeRange = (range: [any, any], date: string) =>
		setInternalBusyTimeRanges((internalBusyTimeRanges) => {
			if (!internalBusyTimeRanges) return internalBusyTimeRanges;
			const oldTimeRange = internalBusyTimeRanges[date];
			const newTimeRange = oldTimeRange.length
				? [...oldTimeRange, range]
				: [range];

			return {
				...internalBusyTimeRanges,
				[date]: newTimeRange,
			};
		});

	const onRemoveTimeRange = (index: number, date: string) => {
		setInternalBusyTimeRanges((internalBusyTimeRanges) => {
			if (internalBusyTimeRanges.length) return internalBusyTimeRanges;
			const oldTimeRange = internalBusyTimeRanges[date];
			const newTimeRange = [
				...oldTimeRange.slice(0, index),
				...oldTimeRange.slice(index + 1),
			];
			return {
				...internalBusyTimeRanges,
				[date]: newTimeRange,
			};
		});
	};
	return (
		<Modal
			{...props}
			onOk={() => onOk(internalBusyTimeRanges)}
			style={{ maxHeight: '80vh' }}
		>
			<div className="flex flex-row" style={{ height: '70vh' }}>
				<Calendar
					validRange={[startDate, endDate]}
					onSelect={onSelectDate}
					className="w-4/6"
					dateCellRender={(moment) => {
						if (moment.isBetween(startDate, endDate, undefined, '[]')) {
							const presentableDate = moment.format(DATE_FORMAT);
							return busyTimeRanges
								? getBadge(busyTimeRanges[presentableDate])
								: null;
						}
					}}
					dateFullCellRender={renderDateCellOverride}
				/>
				<div className="w-2/6 pl-4 overflow-y-auto scroll-m-4">
					<Collapse
						bordered={false}
						ghost={true}
						onChange={(key) => setExpandedDates(new Set(key))}
						activeKey={Array.from(expandedDates)}
					>
						{Array.from(selectedDates).map((date) => (
							<Collapse.Panel
								key={date}
								header={
									<CollapseItemHeader
										title={date}
										isExpanded={expandedDates.has(date.toString())}
									/>
								}
								forceRender
								showArrow={false}
								{...props}
							>
								<TimeRangesCard
									addedTimeRanges={
										internalBusyTimeRanges[date]
											? internalBusyTimeRanges[date]
											: []
									}
									addTimeRange={(range) => onAddTimeRange(range, date)}
									removeTimeRange={(index) => onRemoveTimeRange(index, date)}
								/>
							</Collapse.Panel>
						))}
					</Collapse>
				</div>
			</div>
		</Modal>
	);
};

const getBadge = (timeRanges: [startTime: any, endTime: any][]) => {
	let totalBusyTime = 0;
	if (timeRanges && timeRanges.length) {
		totalBusyTime = timeRanges.reduce((accm, timeRange) => {
			const [startTime, endTime] = timeRange;
			return accm + endTime.hours() - startTime.hours();
		}, 0);
	}

	let text = 'Quite free';
	if (totalBusyTime > 3) {
		text = 'A little busy';
	}
	if (totalBusyTime > 5) {
		text = 'Quite busy';
	}

	return (
		<Badge
			status={
				totalBusyTime > 5
					? 'warning'
					: totalBusyTime > 3
					? 'warning'
					: 'success'
			}
			text={text}
		/>
	);
};
