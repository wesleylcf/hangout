import React, { Dispatch, useEffect, useState } from 'react';
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
import { Participant } from '../../../pages/events/create';
import { AUTH_USER_MAX_PARTICIPANTS } from '../../../constants';

interface ParticipantsSectionProps {
	setIsFriendsModalOpen: Dispatch<boolean>;
	onRemoveParticipant: (id: string) => void;
	onManualAddParticipant: () => void;
	formInstance: FormInstance;
}

export const ParticipantsSection = ({
	setIsFriendsModalOpen,
	onRemoveParticipant,
	onManualAddParticipant,
	formInstance,
}: ParticipantsSectionProps) => {
	const [form] = Form.useForm(formInstance);
	const participants: Participant[] = form.getFieldValue('users');
	const [expandedPanels, setExpandedPanels] = useState<Set<string>>(new Set());
	return (
		<>
			<InputLabel>Participants</InputLabel>
			<Collapse
				bordered={false}
				ghost={true}
				onChange={(key) => setExpandedPanels(new Set(key))}
			>
				{participants &&
					participants.map((participant, index) => {
						if ('uuid' in participant) {
							return (
								<div className="p-4">
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
												onClick={() => onRemoveParticipant(participant.uuid)}
												style={{ fontSize: '1.25rem' }}
											/>
										</div>
									</Card>
								</div>
							);
						} else {
							return (
								<PublicParticipantCard
									participant={participant}
									isExpanded={expandedPanels.has(index.toString())}
								/>
							);
						}
					})}
				<div className="w-full p-4 flex flex-row justify-center items-center space-x-4">
					<Card
						className="flex flex-row items-center justify-center p-4 bg-sky-400 text-white"
						onClick={() => setIsFriendsModalOpen(true)}
					>
						<UserAddOutlined className="pr-2" style={{ fontSize: '1rem' }} />
						Add a friend
					</Card>
					<div>or</div>
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
