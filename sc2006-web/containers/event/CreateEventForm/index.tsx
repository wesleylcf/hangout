/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useContext, useState } from 'react';
import { Card, InputLabel, TextInput } from '../../../components/common';
import { Form, Input, FormInstance } from 'antd';
import { GlobalContext } from '../../../contexts';
import { AddUserToEventModal } from '../AddUserToEventModal';
import { ParticipantsSection } from '../ParticipantsSection';
import {
	CreateEventRes,
	EventParticipant,
	PublicEventParticipant,
} from '../../../types';
import { useNotification } from '../../../hooks';

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
	const notification = useNotification();
	const { setFieldValue, getFieldValue, validateFields } = form;

	const [isInviteUserModal, setIsInviteUserModalOpen] = useState(false);
	const [addedParticipants, setAddedParticipants] = useState<Set<string>>(
		new Set(me ? [me.uuid] : []),
	);
	const [publicParticipantFormInstances, setPublicParticipantFormInstances] =
		useState<FormInstance<PublicEventParticipant>[]>([]);
	const [expandedParticipants, setExpandedParticipants] = useState<Set<string>>(
		new Set(),
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

	const validateAndSubmit = async (form: CreateEventForm) => {
		publicParticipantFormInstances.forEach((formInstance) => {
			formInstance.submit();
		});

		const participants: Array<EventParticipant> = getFieldValue('participants');

		let hasError = false;
		await Promise.all(
			publicParticipantFormInstances
				.map(async (formInstance) => {
					return await formInstance.validateFields();
				})
				.concat(await validateFields()),
		).catch((e) => {
			hasError = true;
			notification.error(
				'One or more inputs have errors. Please check them carefully',
				'Input Error',
			);
			const indexes = participants.map((p, index) => index.toString());
			setExpandedParticipants(new Set(indexes));
		});

		if (participants.length < 2) {
			notification.error(
				'There should be at least two participants in an event',
				'Input Error',
			);
			hasError = true;
		}
		if (!hasError) {
			onSubmitHandler(form);
		}
	};

	return (
		<>
			<Card className="p-8 space-y-2 w-full h-full overflow-auto">
				<Form
					className="w-full h-full flex flex-col"
					initialValues={initialValues}
					form={form}
					onFinish={validateAndSubmit}
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
								onChange={() => null}
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
							form={form}
							limitFeatures={limitFeatures}
							setFormInstances={setPublicParticipantFormInstances}
							formInstances={publicParticipantFormInstances}
							expanded={expandedParticipants}
							setExpanded={setExpandedParticipants}
						/>
					</Form.Item>

					<div className="pt-2 w-2/5 flex flex-row justify-self-end self-center space-x-4">
						<Input
							type="submit"
							value="Create Event"
							size="small"
							className="h-8 sky-400"
						/>
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
