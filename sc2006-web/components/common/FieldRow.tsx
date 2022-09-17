/*eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, RefObject, useEffect } from 'react';
import { EyeOutlined } from '@ant-design/icons';

type FieldRowType = string | Record<string, any>;

type FieldRowProps<T extends FieldRowType> = {
	ref?: RefObject<any>;
	label?: string;
	value?: T;
	isValuePresentable?: boolean;
	onClick?: () => void;
	isClickDisabled?: boolean;
	highlight?: boolean;
	isSelected?: boolean;
	allowEdit?: boolean;
	onEdit?: (value?: T) => void;
	Editable?: React.ElementType;
	onEditFinish?: (value?: T) => void;
	AllowEditIcon?: React.ElementType;
	CancelEditIcon?: React.ElementType;
	Modal?: React.ElementType;
	modalProps?: Record<string, any>;
};

export function FieldRow<T extends FieldRowType>({
	ref,
	label,
	value,
	isValuePresentable,
	onClick,
	highlight,
	isClickDisabled,
	isSelected,
	allowEdit = false,
	onEdit,
	Editable,
	onEditFinish,
	AllowEditIcon,
	CancelEditIcon,
	Modal,
	modalProps,
}: FieldRowProps<T>) {
	const [isEditing, setIsEditing] = useState(false);
	const [internalValue, setInternalValue] = useState(value);

	const iconStyle = {
		fontSize: '1.25rem',
		paddingRight: '0.5rem',
	};

	const onChangeHandler = (e: any) => {
		if (allowEdit) {
			setInternalValue(e.target.value);
			onEdit && onEdit(e.target.value);
		}
	};

	const onClickHandler = () => {
		if (onClick) {
			onClick();
		}
	};

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	const getClassName = () => {
		if (isClickDisabled) return 'text-black bg-neutral-400';
		if (isSelected) return 'text-white bg-cyan-400';
		if (highlight) return 'bg-sky-100';
		return '';
	};

	const PresentableValue = isValuePresentable ? (
		replaceEmpty(internalValue)
	) : (
		<EyeOutlined
			style={{ fontSize: '1rem' }}
			onClick={() => setIsEditing(true)}
		/>
	);

	const FixedField = <div className="w-5/6">{internalValue as string}</div>;
	const EditableField = (
		<>
			<div className="w-5/6 flex flex-row justify-between items-center">
				<div className="w-5/6">
					{isEditing
						? Editable && (
								<Editable
									value={internalValue}
									onChange={onChangeHandler}
									onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
										if (event.code === 'Enter') {
											setIsEditing(false);
											onEditFinish && onEditFinish(internalValue);
										}
									}}
								/>
						  )
						: PresentableValue}
				</div>
				<div className="w-1/6 space-x-4 flex flex-row items-center justify-end">
					{isEditing
						? CancelEditIcon && (
								<CancelEditIcon
									onClick={() => {
										setIsEditing(false);
										// onEditFinish && onEditFinish(internalValue);
									}}
									style={iconStyle}
									className="hover:text-sky-400"
								/>
						  )
						: AllowEditIcon && (
								<AllowEditIcon
									onClick={() => {
										setIsEditing(true);
									}}
									className="hover:text-sky-400"
									style={iconStyle}
								/>
						  )}
				</div>
			</div>
			{Modal && (
				<Modal
					visible={isEditing}
					onOk={onEditFinish}
					onCancel={() => {
						setIsEditing(false);
						// onEditFinish && onEditFinish(internalValue);
					}}
					{...modalProps}
				/>
			)}
		</>
	);

	return (
		<div
			ref={ref}
			className={`p-2 flex flex-row ${getClassName()}`}
			onClick={isClickDisabled ? undefined : onClickHandler}
		>
			{label && <b className="w-1/6">{label} </b>}
			{allowEdit ? EditableField : FixedField}
		</div>
	);
}

function replaceEmpty(obj: any) {
	if (!obj || obj.length === undefined || obj.length === 0) {
		return '-';
	}
	return obj;
}