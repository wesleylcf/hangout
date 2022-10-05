import { useRouter } from 'next/router';
import { Card, CollapseItemHeader } from '../../components/common';
import { Collapse, PageHeader } from 'antd';
import { useContext, useEffect, useState } from 'react';
import { eventService } from '../../services';
import { useNotification } from '../../hooks';
import {
	DbEventResultRes,
	DetailedEventRes,
	EVENT_DATETIME_FORMAT,
	EVENT_DATE_FORMAT,
} from '../../types';
import { PageContext } from '../../contexts';
import moment from 'moment';
import { FieldRow } from '../../components/common/FieldRow';
import { PresentablePlaceTypeMap } from '.././../constants';

type PresentablePlaceProps = 'name' | 'address' | 'postal';

const EventPage = () => {
	const router = useRouter();
	const notification = useNotification();
	const { setLoading } = useContext(PageContext);
	const { uuid } = router.query;

	const [eventResult, setEventResult] = useState<DbEventResultRes>();
	const [event, setEvent] = useState<Omit<DetailedEventRes, 'eventResult'>>();
	const [expandedPlaceTypes, setExpandedPlaceTypes] = useState<Set<string>>(
		new Set(),
	);

	useEffect(() => {
		setLoading(true);
		pullAndSetEvent();
		setLoading(false);
	}, []);

	async function pullAndSetEvent() {
		try {
			const event = await eventService.getDetailedEvent({
				uuid: uuid as string,
			});

			const { eventResult, ...eventRest } = event;
			const { suggestedDates, ...eventResultRest } = eventResult;
			const dates = Object.keys(suggestedDates);
			dates.sort((dateString1, dateString2) => {
				const date1 = moment(dateString1, EVENT_DATE_FORMAT).date();
				const date2 = moment(dateString2, EVENT_DATE_FORMAT).date();
				return date1 - date2;
			});
			const sortedSuggestDates: Record<
				string,
				Array<Record<'start' | 'end', string>>
			> = {};
			dates.forEach(
				(date) => (sortedSuggestDates[date] = suggestedDates[date]),
			);
			setEventResult({
				...eventResultRest,
				suggestedDates: sortedSuggestDates,
			});
			setEvent(eventRest);
		} catch (e) {
			notification.apiError(e);
		}
	}

	const presentablePlaceProps: PresentablePlaceProps[] = ['name', 'address'];

	return (
		<div className="w-full h-full flex flex-col">
			<PageHeader onBack={() => router.back()} title={`Event ${uuid}`} />
			<div className="px-16">
				<h1 className="text-2xl">Event Result</h1>
				<Card className="p-8 mb-16">
					<h2 className="text-xl">Suggested Dates and Timings</h2>
					<div className="flex flex-col space-y-4">
						{eventResult?.suggestedDates &&
							Object.keys(eventResult?.suggestedDates).map((date) => {
								const suggestedTimings = eventResult?.suggestedDates[date];
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
														{moment(start, EVENT_DATETIME_FORMAT).format(
															'HH:mm',
														)}{' '}
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
						{eventResult?.suggestions &&
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
				<h1 className="text-2xl">Adjust results</h1>
				<Card className="p-16 bg-slate-50">
					<div>Create Event Page</div>
				</Card>
			</div>
		</div>
	);
};

export default EventPage;
