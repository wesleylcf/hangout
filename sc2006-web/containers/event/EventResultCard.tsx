import React, { useState } from 'react';
import { DbEventResultRes, EVENT_DATETIME_FORMAT } from '../../types';
import { Card, FieldRow, CollapseItemHeader } from '../../components/common';
import moment from 'moment';
import { Collapse } from 'antd';
import { PresentablePlaceTypeMap } from '.././../constants';

interface EventResultCardProps {
	eventResult: DbEventResultRes;
}

type PresentablePlaceProps = 'name' | 'address' | 'postal';

export const EventResultCard = ({ eventResult }: EventResultCardProps) => {
	const [expandedPlaceTypes, setExpandedPlaceTypes] = useState<Set<string>>(
		new Set(),
	);

	const presentablePlaceProps: PresentablePlaceProps[] = ['name', 'address'];
	return (
		<Card className="p-8 mb-16 w-full">
			<h2 className="text-xl">Suggested Dates and Timings</h2>
			<div className="flex flex-col space-y-4">
				{eventResult.suggestedDates &&
					Object.keys(eventResult.suggestedDates).map((date) => {
						const suggestedTimings = eventResult.suggestedDates[date];
						return (
							<div key={date} className="flex flex-row items-center">
								<h3 className="w-1/6 m-0 pr-4 text-center">{date}</h3>
								<div className="w-5/6 flex flex-row space-x-2">
									{suggestedTimings.map((timing, index) => {
										const { start, end } = timing;
										return (
											<Card
												key={index}
												className="p-2 hover:bg-cyan-400 hover:text-white flex flex-row w-fit"
												style={{ marginRight: '0' }}
											>
												{moment(start, EVENT_DATETIME_FORMAT).format('HH:mm')}{' '}
												-&gt;{' '}
												{moment(end, EVENT_DATETIME_FORMAT).format('HH:mm')}
											</Card>
										);
									})}
								</div>
							</div>
						);
					})}
			</div>
			<h2 className="text-xl mt-12">Suggested Places Per Type</h2>
			<Collapse
				bordered={false}
				ghost
				onChange={(key) => setExpandedPlaceTypes(new Set(key))}
				activeKey={Array.from(expandedPlaceTypes)}
			>
				{eventResult.suggestions &&
					Object.keys(eventResult.suggestions).map((placeType) => {
						return (
							<Collapse.Panel
								showArrow={false}
								key={placeType}
								header={
									<CollapseItemHeader
										title={PresentablePlaceTypeMap[placeType]}
										isExpanded={expandedPlaceTypes.has(placeType)}
									/>
								}
							>
								{eventResult.suggestions[placeType].map((place, index) => {
									return (
										<div key={index}>
											{presentablePlaceProps.map(
												(propName: PresentablePlaceProps) => {
													return (
														<FieldRow
															key={propName}
															label={propName}
															value={
																propName === 'postal'
																	? place[propName].toString()
																	: place[propName]
															}
															highlight={index % 2 === 0}
															isValuePresentable
														/>
													);
												},
											)}
										</div>
									);
								})}
							</Collapse.Panel>
						);
					})}
			</Collapse>
		</Card>
	);
};
