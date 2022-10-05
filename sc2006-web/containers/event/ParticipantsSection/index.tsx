import React, { Dispatch, useState } from 'react';
import { Collapse, FormInstance, Form } from 'antd';
import {
	UserOutlined,
	DeleteOutlined,
	UserAddOutlined,
	PlusOutlined,
	CrownOutlined,
} from '@ant-design/icons';
import { Card, InputLabel } from '../../../components/common';
import { PublicParticipantCard } from './PublicParticipantCard';
import { EventParticipant } from '../../../types';
import { AUTH_USER_MAX_PARTICIPANTS } from '../../../constants';
import { ParticipantCardHeader } from './ParticipantCardHeader';
import { useNotification } from '../../../hooks';

interface BaseParticipantsSectionProps {
	onRemoveParticipant: (id: string) => void;
	formInstance: FormInstance;
	limitFeatures?: boolean;
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
	formInstance,
}: ParticipantsSectionProps) => {
	const notification = useNotification();
	const [form] = Form.useForm(formInstance);
	const { getFieldValue, setFieldValue } = form;
	const participants: EventParticipant[] = getFieldValue('participants');
	const [expandedParticipants, setExpandedParticipants] = useState<Set<string>>(
		new Set(),
	);

	const onUpdateParticipant = (
		participant: EventParticipant,
		index: number,
	) => {
		const currentParticipants: EventParticipant[] =
			form.getFieldValue('participants');
		const newParticipants = [
			...currentParticipants.slice(0, index),
			participant,
			...currentParticipants.slice(index + 1, currentParticipants.length),
		];
		form.setFieldValue('participants', newParticipants);
	};

	const onManualAddParticipant = () => {
		const currentParticipants = getFieldValue('participants');

		if (limitFeatures && currentParticipants.length >= 5) {
			notification.warning(
				'Please log in to remove restricted usage of the app',
				'Cannot add anymore participants',
			);
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

	return (
		<>
			<div className="flex flew-row justify-between items-center">
				<InputLabel>Participants</InputLabel>
				<div className="flex flew-row items-center">
					<a
						onClick={() => {
							setExpandedParticipants(new Set());
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
				onChange={(key) => setExpandedParticipants(new Set(key))}
				activeKey={Array.from(expandedParticipants)}
			>
				{participants &&
					participants.map((participant, index) => {
						if ('uuid' in participant) {
							return (
								<div className="p-4" key={participant.uuid! + index}>
									<Card className="p-5 flex flex-row justify-between">
										<div className="w-5/6 flex flex-row items-center">
											{participant.isCreator ? (
												<CrownOutlined
													className="pr-2 "
													style={{
														color: 'rgb(232 121 249)',
													}}
												/>
											) : (
												<UserOutlined
													className="pr-2 "
													style={{
														color: 'rgb(232 121 249)',
													}}
												/>
											)}

											{participant.uuid}
										</div>
										<div className="flex flex-row items-center hover:text-red-400">
											<DeleteOutlined
												onClick={() => onRemoveParticipant(participant.uuid!)}
												style={{ fontSize: '1.25rem' }}
											/>
										</div>
									</Card>
								</div>
							);
						} else {
							return (
								<PublicParticipantCard
									key={index}
									participant={participant}
									header={
										<ParticipantCardHeader
											title={participant.name}
											isExpanded={expandedParticipants.has(index.toString())}
											isCreator={participant.isCreator}
										/>
									}
									onUpdateParticipant={onUpdateParticipant}
									index={index}
								/>
							);
						}
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
