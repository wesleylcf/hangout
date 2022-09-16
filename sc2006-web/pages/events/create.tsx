import React, { useContext, useState } from 'react';
import { Card, InputLabel, TextInput } from '../../components/common';
import { Form, Input } from 'antd';
import { GlobalContext } from '../../contexts';
import { AddUserToEventModal } from '../../containers/event/AddUserToEventModal';
import { ParticipantsSection } from '../../containers/event/ParticipantsSection/ParticipantsSection';

enum Preference {
	OUTDOOR = 'outdoor',
	INDOOR = 'indoor',
}

export interface PublicEventParticipant {
	name: string;
	preferences: Array<Preference>;
	schedule: any;
	address: string;
	isCreator: boolean;
}

interface AuthEventParticipant {
	uuid: string;
	isCreator: boolean;
}

export type Participant = PublicEventParticipant | AuthEventParticipant;

interface CreateEventForm {
	title: string;
	users: Array<Participant>;
}

const CreateEventPage = () => {
	const { me } = useContext(GlobalContext);

	const [form] = Form.useForm<CreateEventForm>();
	const { setFieldValue, getFieldValue } = form;
	const onSubmit = (form: CreateEventForm) => {
		console.log(form);
		// call eventService.createEvent(form)
	};

	const [isFriendsModalOpen, setIsFriendsModalOpen] = useState(false);
	const [addedParticipants, setAddedParticipants] = useState<Set<string>>(
		new Set(me ? [me.uuid] : []),
	);

	if (!me) {
		return null;
	}

	const initialFormValues: CreateEventForm = {
		title: '',
		users: [
			{
				name: me.uuid,
				preferences: [],
				schedule: me.schedule,
				address: me.address?.toString() || '',
				isCreator: true,
			},
		],
	};

	const onAddUser = (userEmail: string) => {
		const currentParticipants = getFieldValue('users');
		setFieldValue('users', currentParticipants.concat({ uuid: userEmail }));
	};

	const onRemoveParticipant = (name: string) => {
		const currentParticipants: Participant[] = getFieldValue('users');
		const newParticipants = currentParticipants.filter((participant) => {
			if ('name' in participant) {
				return participant.name !== name;
			}
			if ('uuid' in participant) {
				return participant.uuid !== name;
			}
		});
		setAddedParticipants((added) => {
			const newAdded = new Set(added);
			newAdded.delete(name);
			return newAdded;
		});
		setFieldValue('users', newParticipants);
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
							onChange={(e: any) => setFieldValue('title', e.target.value)}
							value={getFieldValue('title')}
						/>
					</Form.Item>
					<Form.Item name="users" dependencies={['users']}>
						<ParticipantsSection
							setIsFriendsModalOpen={setIsFriendsModalOpen}
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
			<AddUserToEventModal
				me={me}
				isOpen={isFriendsModalOpen}
				onOk={(user: string) => {
					onAddUser(user);
					setIsFriendsModalOpen(false);
				}}
				onCancel={() => {
					setIsFriendsModalOpen(false);
				}}
				addedParticipants={addedParticipants}
			/>
		</>
	);
};

export default CreateEventPage;
