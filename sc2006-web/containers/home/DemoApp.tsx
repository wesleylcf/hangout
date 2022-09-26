import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { TextInput, Card, InputLabel } from '../../components/common';
import { ParticipantsSection } from '../event/ParticipantsSection/ParticipantsSection';

interface DemoAppForm {
	title: string;
	participants: Array<any>;
}

export const DemoApp = () => {
	const [form] = Form.useForm<DemoAppForm>();
	const { setFieldValue, getFieldValue } = form;
	const initialFormValues: DemoAppForm = {
		title: 'Some Event Name',
		participants: [],
	};
	const onSubmit = (form: DemoAppForm) => {
		console.log(form);
		// call eventService.createEvent(form)
	};
	const onAddUser = (userEmail: string) => {
		const currentParticipants = getFieldValue('participants');
		setFieldValue(
			'participants',
			currentParticipants.concat({ uuid: userEmail }),
		);
	};

	const onRemoveParticipant = (name: string) => {
		const currentParticipants: any[] = getFieldValue('participants');
		const newParticipants = currentParticipants.filter(
			(participant) => participant.name !== name,
		);
		setFieldValue('participants', newParticipants);
	};
	return (
		<>
			<Card className="p-8 w-5/6 h-5/6 flex flex-col justify-center items-start space-y-2 overflow-auto">
				<Form
					className="w-full h-full"
					initialValues={initialFormValues}
					form={form}
					onFinish={onSubmit}
				>
					<InputLabel>Name of Event</InputLabel>
					<Form.Item
						name="title"
						rules={[
							{
								required: true,
								message: 'Name of Event cannot be empty',
							},
							{
								min: 10,
								message: 'Name of Event must be at least 10 characters',
							},
							{
								max: 50,
								message: 'Name of Event cannot exceed 50 characters',
							},
						]}
					>
						<TextInput
							onChange={() => null}
							value="Some Event Name"
							disabled
							placeholder="Some Event Name"
						/>
					</Form.Item>
					<Form.Item name="participants" dependencies={['participants']}>
						<ParticipantsSection
							limitFeatures
							onRemoveParticipant={onRemoveParticipant}
							formInstance={form}
						/>
					</Form.Item>

					<div className="pt-2 flex flex-row items-center space-x-4">
						<div className="w-2/5">
							<Input
								type="submit"
								value="Create Event"
								size="small"
								className="h-8 sky-400"
							/>
						</div>
					</div>
				</Form>
			</Card>
		</>
	);
};
