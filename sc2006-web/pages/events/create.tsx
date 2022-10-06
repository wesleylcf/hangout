/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useContext } from 'react';
import { Form, PageHeader } from 'antd';
import { GlobalContext } from '../../contexts';
import { EventParticipant } from '../../types';
import { useNotification } from '../../hooks';
import { useRouter } from 'next/router';
import { CreateEventForm } from '../../containers/event/CreateEventForm';
import { eventService } from '../../services';

interface CreateEventForm {
	name: string;
	participants: Array<EventParticipant>;
}

const CreateEventPage = () => {
	const { me, setMe } = useContext(GlobalContext);
	const notification = useNotification();
	const router = useRouter();
	const [form] = Form.useForm<CreateEventForm>();
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

	return (
		<div className="flex flex-col w-full h-full items-center">
			<PageHeader
				onBack={() => router.back()}
				title="Create Event"
				className="self-start"
			/>
			<CreateEventForm
				form={form}
				initialValues={initialFormValues}
				onSubmitHandler={onSubmit}
			/>
		</div>
	);
};

export default CreateEventPage;
