import React, { useContext, useState } from 'react';
import { Form } from 'antd';
import { CreateEventForm } from '../event/CreateEventForm';
import { CreateEventReq, DbEventResultRes } from '../../types';
import { eventService } from '../../services';
import { useNotification } from '../../hooks';
import { EventResultCard } from '../event/EventResultCard';
import { PageContext } from '../../contexts';

export const DemoApp = () => {
	const notification = useNotification();
	const { setLoading } = useContext(PageContext);
	const [form] = Form.useForm<CreateEventReq>();
	const [eventResult, setEventResult] = useState<DbEventResultRes>();
	const initialFormValues: CreateEventReq = {
		name: 'This is a demo, some features may be limited.',
		participants: [],
	};
	const onSubmit = async (form: CreateEventReq) => {
		console.log(form);
		try {
			const result = await eventService.generateEventResult(form);
			setEventResult(result);
		} catch (e) {
			if ('title' in e) {
				notification.apiError(e);
			} else {
				notification.error(e.message, 'Could not generate a result');
			}
		}
	};

	return (
		<div className="w-10/12 space-y-16">
			<CreateEventForm
				limitFeatures
				form={form}
				onSubmitHandler={onSubmit}
				initialValues={initialFormValues}
			/>
			<h1 className="m-0 text-2xl">Event Result</h1>
			{eventResult && <EventResultCard eventResult={eventResult} />}
		</div>
	);
};
