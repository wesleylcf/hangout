/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect, useMemo } from 'react';
import {
	EventParticipant,
	PublicEventParticipant,
	Regex,
} from '../../../types';
import { TextInput } from '../../../components/common';
import { CheckOutlined, EditOutlined } from '@ant-design/icons';
import { FieldRow } from '../../../components/common/FieldRow';
import {
	Collapse,
	CollapsePanelProps,
	FormRule,
	Form,
	FormInstance,
} from 'antd';
import { ScheduleModal } from '../ScheduleModal';
import { PreferencesModal } from '../PreferencesModal';

type FieldName = 'name' | 'preferences' | 'schedule' | 'address';
type PublicParticipantCardProps = CollapsePanelProps & {
	setFormInstances: React.Dispatch<
		React.SetStateAction<Array<FormInstance<PublicEventParticipant>>>
	>;
	participant: PublicEventParticipant;
	onUpdateParticipant: (participant: EventParticipant, index: number) => void;
	index: number;
};

interface ParticipantItem {
	key: FieldName;
	label: string;
}

export const PublicParticipantCard = React.memo(function ({
	participant,
	onUpdateParticipant,
	index,
	setFormInstances,
	...panelProps
}: PublicParticipantCardProps) {
	const [form] = Form.useForm<PublicEventParticipant>();
	const { getFieldValue, setFieldsValue } = form;

	useEffect(() => {
		setFormInstances((prevFormInstances) => [...prevFormInstances, form]);
	}, []);

	useEffect(() => {
		setFieldsValue(participant);
	}, [participant]);

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

	const getFormRule = (name: FieldName): FormRule[] => {
		if (name === 'name') {
			return [
				{ required: true, message: "Participant's name is required" },
				{
					min: 3,
					message: "Participant's name must be at least 3 characters",
				},
			];
		}
		if (name === 'preferences') {
			return [
				{
					type: 'array', // This is important otherwise AntD validates wrongly.
					min: 1,
					message: 'Participant must have at least 1 preferred type of place',
				},
			];
		}
		if (name === 'address') {
			return [
				{
					required: true,
					message: "Participant's address is required",
				},
				{
					pattern: Regex.POSTAL_CODE,
					message: 'Invalid postal code',
				},
			];
		}
		return [];
	};

	const onEditFinish = (key: FieldName, value?: string) => {
		const newParticipant = { ...participant, [key]: value };
		onUpdateParticipant(newParticipant, index);
	};
	return (
		<Collapse.Panel forceRender showArrow={false} {...panelProps}>
			<Form form={form} initialValues={participant}>
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
							value={getFieldValue(key)}
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
							formFieldName={key}
							fieldFormRules={getFormRule(key)}
						/>
					);
				})}
			</Form>
		</Collapse.Panel>
	);
});
