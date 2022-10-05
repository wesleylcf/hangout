import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { TextInput, Card, InputLabel } from '../../components/common';
import { ParticipantsSection } from '../event/ParticipantsSection';
import { CreateEventForm } from '../event/CreateEventForm';

interface DemoAppForm {
	name: string;
	participants: Array<any>;
}

export const DemoApp = () => {
	const [form] = Form.useForm<DemoAppForm>();
	const initialFormValues: DemoAppForm = {
		name: 'This is a demo, some features may be limited.',
		participants: [],
	};
	const onSubmit = async (form: DemoAppForm) => {
		console.log(form);
		// call eventService.createEvent(form)
	};

	return (
		<CreateEventForm
			limitFeatures
			form={form}
			onSubmitHandler={onSubmit}
			initialValues={initialFormValues}
		/>
	);
};
