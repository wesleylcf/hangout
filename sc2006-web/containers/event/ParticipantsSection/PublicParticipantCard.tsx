import React, { useMemo } from 'react';
import {
	Participant,
	PublicEventParticipant,
} from '../../../pages/events/create';
import { TextInput } from '../../../components/common';
import {
	CheckOutlined,
	EditOutlined,
	CrownFilled,
	UserOutlined,
} from '@ant-design/icons';
import { FieldRow } from '../../../components/common/FieldRow';
import { Collapse, Form } from 'antd';
import { ScheduleModal } from '../ScheduleModal';
import { CollapseItemHeader } from '../../../components/common';

type FieldName = 'name' | 'preferences' | 'schedule' | 'address';
interface PublicParticipantCardProps {
	participant: PublicEventParticipant;
	isExpanded: boolean;
	onUpdateParticipant: (participant: Participant, index: number) => void;
	index: number;
}

interface ParticipantItem {
	name: FieldName;
	label: string;
}

export const PublicParticipantCard = ({
	participant,
	isExpanded,
	onUpdateParticipant,
	index,
	...props
}: PublicParticipantCardProps) => {
	const ParticipantCardHeader = ({ title }: { title: string }) => {
		const icon = participant.isCreator ? (
			<CrownFilled
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
		);
		return (
			<CollapseItemHeader icon={icon} title={title} isExpanded={isExpanded} />
		);
	};

	const getEditable = (name: FieldName) => {
		switch (name) {
			case 'schedule':
				return undefined;
			default:
				return TextInput;
		}
	};

	const participantItems: ParticipantItem[] = useMemo(
		() => [
			{
				name: 'name',
				label: 'Name:',
			},
			{
				name: 'preferences',
				label: 'Preferences:',
			},
			{
				name: 'schedule',
				label: 'Schedule:',
			},
			{
				name: 'address',
				label: 'Address:',
			},
		],
		[],
	);

	const onEditFinish = (key: string, value?: string) => {
		const newParticipant = { ...participant, [key]: value };
		onUpdateParticipant(newParticipant, index);
	};

	return (
		<Collapse.Panel
			key={participant.name}
			header={<ParticipantCardHeader title={participant.name} />}
			forceRender
			showArrow={false}
			{...props}
		>
			{participantItems.map(({ label, name }, index) => {
				return (
					<FieldRow
						key={name}
						label={label}
						value={participant[name]}
						highlight={index % 2 == 0}
						allowEdit={true}
						CancelEditIcon={CheckOutlined}
						AllowEditIcon={EditOutlined}
						Editable={getEditable(name)}
						onEditFinish={(value?: string) => onEditFinish(name, value)}
						Modal={name === 'schedule' ? ScheduleModal : undefined}
						modalProps={{
							width: '90%',
							freeTimeRanges: participant[name],
							destroyOnClose: true,
						}}
						isValuePresentable={!['schedule', 'preferences'].includes(name)}
					/>
				);
			})}
		</Collapse.Panel>
	);
};
