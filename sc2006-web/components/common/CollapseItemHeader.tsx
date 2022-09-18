import React, { ReactNode } from 'react';
import { Card } from '.';
import { CaretUpFilled, CaretDownFilled } from '@ant-design/icons';

interface CollapseItemHeaderProps {
	icon?: ReactNode;
	title: string | number;
	isExpanded: boolean;
}

export const CollapseItemHeader = ({
	icon,
	title,
	isExpanded,
	...props
}: CollapseItemHeaderProps) => {
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
				{icon && <div className="flex flex-row items-center">{icon}</div>}
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
