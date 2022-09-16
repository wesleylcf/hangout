/* eslint-disable @typescript-eslint/ban-types*/
import React, { useState } from 'react';
import { Badge, Calendar, Collapse, Modal, ModalProps, BadgeProps } from 'antd';
import moment from 'moment';
import { CollapseItemHeader } from '../../components/common';
import { TimeRangesCard } from './TimeRangesCard';

type ScheduleModalProps = Omit<ModalProps, 'onOk'> & {
	onOk: (value: any) => void;
};

export const ScheduleModal = ({ onOk, ...props }: ScheduleModalProps) => {
	const DATE_FORMAT = 'ddd (DD MMM)';
	const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
	const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
	const [freeTimeRanges, setFreeTimeRanges] = useState<
		Record<string, Array<[any, any]>>
	>({});

	const startDate = moment();
	const endDate = moment()
		.day(startDate.get('day') + 7)
		.hour(24)
		.second(59);
	return (
		<Modal {...props} onOk={() => onOk(freeTimeRanges)}>
			<div className="flex flex-row">
				<Calendar
					validRange={[startDate, endDate]}
					onSelect={(moment) => {
						const presentableDate = moment.format(DATE_FORMAT);
						setSelectedDates((selected) => {
							const selectedCopy = new Set(selected);
							setFreeTimeRanges((timeRanges) => {
								return { ...timeRanges, [presentableDate]: [] };
							});
							if (selected.has(presentableDate)) {
								selectedCopy.delete(presentableDate);
								return selectedCopy;
							} else {
								return selectedCopy.add(presentableDate);
							}
						});
					}}
					className="w-4/6"
					dateCellRender={(moment) => {
						if (moment.isBetween(startDate, endDate, undefined, '[]')) {
							const presentableDate = moment.format(DATE_FORMAT);
							return freeTimeRanges
								? getBadge(freeTimeRanges[presentableDate])
								: null;
						}
					}}
				/>
				<div className="w-2/6 pl-4 overflow-auto">
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
										freeTimeRanges[date] ? freeTimeRanges[date] : []
									}
									addTimeRange={(range: [any, any]) =>
										setFreeTimeRanges((freeTimeRanges) => {
											if (!freeTimeRanges) return freeTimeRanges;
											const oldTimeRange = freeTimeRanges[date];
											let newTimeRange: Array<[any, any]> = [range];
											if (oldTimeRange) {
												newTimeRange = [...oldTimeRange, range];
											}
											return { ...freeTimeRanges, [date]: newTimeRange };
										})
									}
									removeTimeRange={(index: number) => {
										setFreeTimeRanges((freeTimeRanges) => {
											if (!freeTimeRanges) return freeTimeRanges;
											const oldTimeRange = freeTimeRanges[date];
											const newTimeRange = [
												...oldTimeRange.slice(0, index),
												...oldTimeRange.slice(index + 1),
											];
											return { ...freeTimeRanges, [date]: newTimeRange };
										});
									}}
								/>
							</Collapse.Panel>
						))}
					</Collapse>
				</div>
			</div>
		</Modal>
	);
};

const getBadge = (freeTimeRanges: [startTime: any, endTime: any][]) => {
	let totalBusyTime = 0;
	if (freeTimeRanges && freeTimeRanges.length) {
		totalBusyTime = freeTimeRanges.reduce((accm, timeRange) => {
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
