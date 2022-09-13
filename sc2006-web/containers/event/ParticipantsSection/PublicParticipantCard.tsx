import React, { useEffect, useMemo, useState } from 'react';
import {
	Participant,
	PublicEventParticipant,
} from '../../../pages/events/create';
import { Card, TextInput } from '../../../components/common';
import {
	CaretUpFilled,
	CaretDownFilled,
	CheckOutlined,
	EditOutlined,
	CrownFilled,
	UserOutlined,
} from '@ant-design/icons';
import { FieldRow } from '../../../components/common/FieldRow';
import { Collapse, Form } from 'antd';

interface PublicParticipantCardProps {
	participant: PublicEventParticipant;
	isExpanded: boolean;
	onUpdateParticipant: (participant: Participant, index: number) => void;
	index: number;
}

export const PublicParticipantCard = ({
	participant,
	isExpanded,
	onUpdateParticipant,
	index,
	...props
}: PublicParticipantCardProps) => {
	const ParticipantCardHeader = ({ title }: { title: string }) => {
		const caretStyle = {
			fontSize: '1.25rem',
		};
		const className = isExpanded
			? 'bg-cyan-400 text-white'
			: 'hover:bg-cyan-400 hover:text-white';
		return (
			<Card
				className={`p-5 w-full ${className} flex flex-row justify-between items-center`}
			>
				<div className="w-5/6 flex flex-row items-center">
					<div className="flex flex-row items-center">
						{participant.isCreator ? (
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
						)}
					</div>
					{title}
				</div>
				{isExpanded ? (
					<CaretUpFilled style={caretStyle} />
				) : (
					<CaretDownFilled style={caretStyle} />
				)}
			</Card>
		);
	};

	const [form] = Form.useForm();
	const { getFieldValue, setFieldValue, setFieldsValue } = form;

	const participantItems = useMemo(
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
				name: 'preferences',
				label: 'Schedule:',
			},
			{
				name: 'address',
				label: 'Address:',
			},
		],
		[],
	);

	useEffect(() => {
		setFieldsValue(participant);
	}, [participant]);

	const onEditFinish = (key: string, value: string) => {
		const newParticipant = { ...participant, [key]: value };
		onUpdateParticipant(newParticipant, index);
	};

	return (
		<Collapse.Panel
			key={form.getFieldValue('name')}
			header={<ParticipantCardHeader title={participant.name} />}
			forceRender
			showArrow={false}
			{...props}
		>
			<Form className="pl-4" form={form} initialValues={participant}>
				{participantItems.map(({ label, name }, index) => {
					const textLabels = ['Name:', 'Address:'];
					return (
						<Form.Item
							key={name + label}
							name={name}
							rules={[
								{
									required: true,
									message: `${name} cannot be empty`,
								},
								{
									min: 6,
									message: `${name} must be at least 6 characters`,
								},
							]}
						>
							<FieldRow
								label={label}
								value={getFieldValue(name)}
								highlight={index % 2 == 0}
								allowEdit={true}
								CancelEditIcon={CheckOutlined}
								AllowEditIcon={EditOutlined}
								Editable={
									textLabels.includes(label as string) ? TextInput : undefined
								}
								onEditFinish={(value: string) => onEditFinish(name, value)}
							/>
						</Form.Item>
					);
				})}
			</Form>
		</Collapse.Panel>
	);
};
