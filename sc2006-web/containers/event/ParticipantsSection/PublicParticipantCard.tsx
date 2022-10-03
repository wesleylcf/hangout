/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useMemo } from 'react';
import { EventParticipant, PublicEventParticipant } from '../../../types';
import { TextInput } from '../../../components/common';
import {
	CheckOutlined,
	EditOutlined,
	CrownFilled,
	UserOutlined,
} from '@ant-design/icons';
import { FieldRow } from '../../../components/common/FieldRow';
import { Collapse, CollapsePanelProps } from 'antd';
import { ScheduleModal } from '../ScheduleModal';
import { CollapseItemHeader } from '../../../components/common';
import { PreferencesModal } from '../PreferencesModal';

type FieldName = 'name' | 'preferences' | 'schedule' | 'address';
type PublicParticipantCardProps = CollapsePanelProps & {
	participant: PublicEventParticipant;
	onUpdateParticipant: (participant: EventParticipant, index: number) => void;
	index: number;
};

interface ParticipantItem {
	key: FieldName;
	label: string;
}

export const PublicParticipantCard = ({
	participant,
	onUpdateParticipant,
	index,
	...props
}: PublicParticipantCardProps) => {
	const getEditable = (name: FieldName) => {
		switch (name) {
			case 'schedule':
			case 'preferences':
				return undefined;
			default:
				return TextInput;
		}
	};

	const participantItems: ParticipantItem[] = useMemo(
		() => [
			{
				key: 'name',
				label: 'Name:',
			},
			{
				key: 'preferences',
				label: 'Preferences:',
			},
			{
				key: 'schedule',
				label: 'Schedule:',
			},
			{
				key: 'address',
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
		<Collapse.Panel forceRender showArrow={false} {...props}>
			{participantItems.map(({ label, key }, index) => {
				let modal;
				if (key === 'schedule') {
					modal = ScheduleModal;
				}
				if (key === 'preferences') {
					modal = PreferencesModal;
				}
				return (
					<FieldRow
						key={key}
						label={label}
						value={participant[key] as any}
						highlight={index % 2 == 0}
						allowEdit={true}
						CancelEditIcon={CheckOutlined}
						AllowEditIcon={EditOutlined}
						Editable={getEditable(key)}
						onEditFinish={(value?: string) => onEditFinish(key, value)}
						Modal={modal}
						modalProps={
							['schedule', 'preferences'].includes(key)
								? {
										width: '90%',
										...(key === 'schedule' && {
											busyTimeRanges: participant[key],
										}),
										destroyOnClose: true,
								  }
								: undefined
						}
						isValuePresentable={!['schedule', 'preferences'].includes(key)}
					/>
				);
			})}
		</Collapse.Panel>
	);
};
