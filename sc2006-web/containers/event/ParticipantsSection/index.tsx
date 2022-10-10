import React, { Dispatch } from 'react';
import { Collapse, FormInstance } from 'antd';
import {
	UserOutlined,
	DeleteOutlined,
	UserAddOutlined,
	PlusOutlined,
	CrownOutlined,
} from '@ant-design/icons';
import { Card, InputLabel } from '../../../components/common';
import { PublicParticipantCard } from './PublicParticipantCard';
import { EventParticipant, PublicEventParticipant } from '../../../types';
import { AUTH_USER_MAX_PARTICIPANTS } from '../../../constants';
import { ParticipantCardHeader } from './ParticipantCardHeader';
import { useNotification } from '../../../hooks';

interface BaseParticipantsSectionProps {
	formInstances: Array<FormInstance<PublicEventParticipant>>;
	setFormInstances: Dispatch<
		React.SetStateAction<Array<FormInstance<PublicEventParticipant>>>
	>;
	onRemoveParticipant: (id: string) => void;
	form: FormInstance;
	limitFeatures?: boolean;
	expanded: Set<string>;
	setExpanded: Dispatch<React.SetStateAction<Set<string>>>;
}

interface AuthParticipantsSectionProps extends BaseParticipantsSectionProps {
	setIsInviteUserModalOpen: Dispatch<boolean>;
}

interface PublicParticipantSectionProps extends BaseParticipantsSectionProps {
	setIsInviteUserModalOpen?: never;
}

type ParticipantsSectionProps =
	| AuthParticipantsSectionProps
	| PublicParticipantSectionProps;

export const ParticipantsSection = ({
	limitFeatures = false,
	setIsInviteUserModalOpen,
	onRemoveParticipant,
	form,
	setFormInstances,
	expanded,
	setExpanded,
}: ParticipantsSectionProps) => {
	const notification = useNotification();
	const { getFieldValue, setFieldValue } = form;
	const participants: PublicEventParticipant[] = getFieldValue('participants');

	const onUpdateParticipant = (
		participant: EventParticipant,
		index: number,
	) => {
		const currentParticipants: EventParticipant[] =
			getFieldValue('participants');
		const newParticipants = [
			...currentParticipants.slice(0, index),
			participant,
			...currentParticipants.slice(index + 1, currentParticipants.length),
		];
		setFieldValue('participants', newParticipants);
	};

	const onManualAddParticipant = () => {
		const currentParticipants = getFieldValue('participants');

		if (limitFeatures && currentParticipants.length >= 5) {
			notification.warning(
				'Please log in to remove restricted usage of the app',
				'Cannot add anymore participants',
			);
			return;
		}

		const newParticipant: EventParticipant = {
			name: `New Participant ${currentParticipants.length + 1}`,
			preferences: [],
			schedule: {},
			address: '',
			isCreator: false,
		};
		const newParticipants = [...currentParticipants, newParticipant];
		setFieldValue('participants', newParticipants);
	};
	console.log('p', participants);
	return (
		<>
			<div className="flex flew-row justify-between items-center">
				<InputLabel>Participants</InputLabel>
				<div className="flex flew-row items-center">
					<a
						onClick={() => {
							setExpanded(new Set());
						}}
						className="text-sky-400"
					>
						Minimize all
					</a>
				</div>
			</div>
			<Collapse
				bordered={false}
				ghost={true}
				onChange={(key) => setExpanded(new Set(key))}
				activeKey={Array.from(expanded)}
			>
				{participants &&
					participants.map((participant, index) => {
						return (
							<PublicParticipantCard
								key={index}
								participant={participant}
								header={
									<ParticipantCardHeader
										title={participant.name}
										isExpanded={expanded.has(index.toString())}
										isCreator={participant.isCreator}
									/>
								}
								onUpdateParticipant={onUpdateParticipant}
								index={index}
								setFormInstances={setFormInstances}
								isAuthParticipant={'uuid' in participant}
							/>
						);
					})}
				<div className="w-full p-4 flex flex-row justify-center items-center space-x-4">
					{!limitFeatures && (
						<>
							<Card
								className="flex flex-row items-center justify-center p-4 bg-sky-400 text-white"
								onClick={() =>
									setIsInviteUserModalOpen
										? setIsInviteUserModalOpen(true)
										: undefined
								}
							>
								<UserAddOutlined
									className="pr-2"
									style={{ fontSize: '1rem' }}
								/>
								Add Existing User
							</Card>
							<div>or</div>
						</>
					)}

					<Card
						className="flex flex-row items-center justify-center p-4 bg-sky-400 text-white"
						onClick={
							participants?.length > AUTH_USER_MAX_PARTICIPANTS
								? undefined
								: onManualAddParticipant
						}
					>
						<PlusOutlined className="pr-2" style={{ fontSize: '1rem' }} />
						Manually Add Participant
					</Card>
				</div>
			</Collapse>
		</>
	);
};
