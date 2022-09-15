/* eslint-disable @typescript-eslint/ban-types*/
import React, { useState } from 'react';
import { Badge, Calendar, Collapse, Modal, ModalProps, BadgeProps } from 'antd';
import moment from 'moment';
import { CollapseItemHeader } from '../../components/common';

type ScheduleModalProps = ModalProps & {};

export const ScheduleModal = (props: ScheduleModalProps) => {
	const DATE_FORMAT = 'ddd (DD MMM)';
	const [selectedDate, setSelectedDate] = useState<any>();
	const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
	const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());
	const [freeTimeRanges, setFreeTimeRanges] =
		useState<Record<string, [startTime: number, endTime: number][]>>();

	const startDate = moment();
	const endDate = moment()
		.day(startDate.get('day') + 7)
		.hour(24)
		.second(59);
	return (
		<Modal {...props}>
			<div className="flex flex-row">
				<Calendar
					validRange={[startDate, endDate]}
					onSelect={(moment) => {
						const presentableDate = moment.format(DATE_FORMAT);
						setSelectedDates((selected) => {
							const selectedCopy = new Set(selected);
							setFreeTimeRanges((timeRanges) => {
								return { ...timeRanges, presentableDate: [] };
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
							></Collapse.Panel>
						))}
					</Collapse>
				</div>
			</div>
		</Modal>
	);
};

const getBadge = (freeTimeRanges: [startTime: number, endTime: number][]) => {
	const totalFreeTime =
		freeTimeRanges?.reduce((accm, timeRange) => {
			const [startTime, endTime] = timeRange;
			return accm + endTime - startTime;
		}, 0) ?? 12;

	let text = 'Quite free';
	if (totalFreeTime < 9) {
		text = 'Not too busy';
	}
	if (totalFreeTime < 6) {
		text = 'Quite busy';
	}

	return (
		<Badge
			status={
				totalFreeTime > 8 ? 'success' : totalFreeTime > 5 ? 'warning' : 'error'
			}
			text={text}
		/>
	);
};
