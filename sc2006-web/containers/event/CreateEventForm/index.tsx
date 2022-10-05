/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useContext, useState } from 'react';
import { Card, InputLabel, TextInput } from '../../../components/common';
import { Form, Input, FormInstance } from 'antd';
import { GlobalContext } from '../../../contexts';
import { AddUserToEventModal } from '../AddUserToEventModal';
import { ParticipantsSection } from '../ParticipantsSection';
import { CreateEventRes, EventParticipant } from '../../../types';

interface CreateEventForm {
	name: string;
	participants: Array<EventParticipant>;
}

interface CreateEventFormProps {
	form: FormInstance;
	initialValues: CreateEventForm;
	onSubmitHandler: (form: CreateEventForm) => Promise<CreateEventRes | void>;
	limitFeatures?: boolean;
}

export const CreateEventForm = ({
	form,
	initialValues,
	onSubmitHandler,
	limitFeatures = false,
}: CreateEventFormProps) => {
	const { me } = useContext(GlobalContext);

	const { setFieldValue, getFieldValue } = form;

	const [isInviteUserModal, setIsInviteUserModalOpen] = useState(false);
	const [addedParticipants, setAddedParticipants] = useState<Set<string>>(
		new Set(me ? [me.uuid] : []),
	);

	const onAddAuthUser = (userEmail: string) => {
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
					initialValues={initialValues}
					form={form}
					onFinish={onSubmitHandler}
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
						{limitFeatures ? (
							<TextInput
								onChange={() => {}}
								value={getFieldValue('name')}
								placeholder={getFieldValue('name')}
								disabled
							/>
						) : (
							<TextInput
								onChange={(e: any) => setFieldValue('name', e.target.value)}
								value={getFieldValue('name')}
							/>
						)}
					</Form.Item>
					<Form.Item name="participants" dependencies={['participants']}>
						<ParticipantsSection
							setIsInviteUserModalOpen={setIsInviteUserModalOpen}
							onRemoveParticipant={onRemoveParticipant}
							formInstance={form}
							limitFeatures={limitFeatures}
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
			{!limitFeatures && (
				<AddUserToEventModal
					me={me!}
					isOpen={isInviteUserModal}
					onOk={(uuid: string) => {
						onAddAuthUser(uuid);
						setIsInviteUserModalOpen(false);
					}}
					onCancel={() => {
						setIsInviteUserModalOpen(false);
					}}
					addedParticipants={addedParticipants}
				/>
			)}
		</>
	);
};
