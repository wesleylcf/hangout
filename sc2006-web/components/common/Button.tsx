import AntdButton, { ButtonProps as AntButtonProps } from 'antd/lib/button';
import { Spin } from '.';
import React from 'react';

export type ButtonProps = AntButtonProps & {
	loading?: boolean;
};

export const Button = ({
	className,
	style,
	size,
	loading,
	children,
	type,
	icon,
	disabled,
	...props
}: ButtonProps) => {
	if (!type) {
		type = 'primary';
	}

	if (!size) {
		size = 'middle';
	}

	if (loading) {
		icon = <Spin className={size === 'small' ? 'small' : ''} size="small" />;
		disabled = true;
	}

	let height = 48;
	if (size === 'large') {
		height = 56;
	} else if (size === 'small') {
		height = 36;
	}

	return (
		<AntdButton
			{...props}
			className={className}
			style={{ height, ...style }}
			disabled={disabled}
			type={type}
			size={size}
			icon={undefined}
			loading={false}
		>
			<div className="flex justify-center items-center h-full">
				<div
					className={`flex justify-center ${
						size === 'small' ? 'text-xs' : 'text-sm'
					}`}
				>
					{icon}
				</div>
				<div className={icon ? 'ml-2' : ''}>{children}</div>
			</div>
		</AntdButton>
	);
};

Button.defaultProps = {
	type: 'primary',
	size: 'middle',
};
