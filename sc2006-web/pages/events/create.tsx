/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useContext, useState } from 'react';
import { Card, InputLabel, TextInput } from '../../components/common';
import { Form, Input } from 'antd';
import { GlobalContext } from '../../contexts';
import { AddUserToEventModal } from '../../containers/event/AddUserToEventModal';
import { ParticipantsSection } from '../../containers/event/ParticipantsSection/ParticipantsSection';
import { EventParticipant, UserRes } from '../../types';
import { eventService } from '../../services';
import { useNotification } from '../../hooks';
import { useRouter } from 'next/router';

interface CreateEventForm {
	name: string;
	participants: Array<EventParticipant>;
}

const CreateEventPage = () => {
	const { me, setMe } = useContext(GlobalContext);
	const notification = useNotification();
	const router = useRouter();
	const [form] = Form.useForm<CreateEventForm>();
	const { setFieldValue, getFieldValue } = form;
	const onSubmit = async (form: CreateEventForm) => {
		try {
			console.log(form);
			const { eventUuid } = await eventService.create(form);
			setMe((prevMe) => {
				if (prevMe) {
					return {
						...prevMe,
						eventIds: [...prevMe.eventIds, eventUuid],
					};
				}
			});

			notification.success(
				<div>
					Successfully created event <b>{form.name}</b>
				</div>,
				'Event created!',
			);
			router.push('/events');
		} catch (e) {
			const error = e.title
				? e
				: {
						name: '',
						level: 'error',
						message: 'Please check your inputs or alert us.',
						title: 'Failed to create Event',
				  };
			notification.apiError(error);
		}
	};

	const [isInviteUserModal, setIsInviteUserModalOpen] = useState(false);
	const [addedParticipants, setAddedParticipants] = useState<Set<string>>(
		new Set(me ? [me.uuid] : []),
	);

	if (!me) {
		return null;
	}

	// Let current user be of type PublicEventParticipant to allow user to edit his info.
	const initialFormValues: CreateEventForm = {
		name: '',
		participants: [
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
		const currentParticipants = getFieldValue('participants');
		setFieldValue(
			'participants',
			currentParticipants.concat({ uuid: userEmail, isCreator: false }),
		);
	};

	const onRemoveParticipant = (name: string) => {
		const currentParticipants: EventParticipant[] =
			getFieldValue('participants');
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
						name="name"
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
							onChange={(e: any) => setFieldValue('name', e.target.value)}
							value={getFieldValue('name')}
						/>
					</Form.Item>
					<Form.Item name="participants" dependencies={['participants']}>
						<ParticipantsSection
							setIsInviteUserModalOpen={setIsInviteUserModalOpen}
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
				isOpen={isInviteUserModal}
				onOk={(uuid: string) => {
					onAddUser(uuid);
					setIsInviteUserModalOpen(false);
				}}
				onCancel={() => {
					setIsInviteUserModalOpen(false);
				}}
				addedParticipants={addedParticipants}
			/>
		</>
	);
};

export default CreateEventPage;
