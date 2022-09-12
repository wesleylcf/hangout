import React, { useMemo } from 'react';
import { PublicEventParticipant } from '../../../pages/events/create';
import { Card, TextInput } from '../../../components/common';
import {
	CaretUpFilled,
	CaretDownFilled,
	CheckOutlined,
	EditOutlined,
	CrownFilled,
	UserOutlined,
} from '@ant-design/icons';
import { FieldRow, FieldRowProps } from '../../../components/common/FieldRow';
import { Collapse } from 'antd';
import { ArrayUtil, StringUtil } from '../../../lib';

interface PublicParticipantCardProps {
	participant: PublicEventParticipant;
	isExpanded: boolean;
}

export const PublicParticipantCard = ({
	participant,
	isExpanded,
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

	const { name, preferences, schedule, address } = participant;

	const participantItems: FieldRowProps[] = useMemo(
		() => [
			{
				label: 'Name:',
				value: name,
			},
			{
				label: 'Preferences:',
				value: ArrayUtil.replaceEmpty(preferences),
			},
			{
				label: 'Schedule:',
				value: ArrayUtil.replaceEmpty(schedule),
			},
			{
				label: 'Address:',
				value: StringUtil.replaceEmpty(address?.toString()),
			},
		],
		[participant],
	);

	return (
		<Collapse.Panel
			key={name}
			header={<ParticipantCardHeader title={name} />}
			forceRender
			showArrow={false}
			{...props}
		>
			<div className="pl-4">
				{participantItems.map(({ label, value }, index) => {
					const textLabels = ['Name:', 'Address:'];
					return (
						<FieldRow
							key={name + label}
							label={label}
							value={value}
							highlight={index % 2 == 0}
							allowEdit={true}
							CancelEditIcon={CheckOutlined}
							AllowEditIcon={EditOutlined}
							Editable={
								textLabels.includes(label as string) ? TextInput : undefined
							}
						/>
					);
				})}
			</div>
		</Collapse.Panel>
	);
};
