/* eslint-disable no-mixed-spaces-and-tabs */
import { useState, RefObject, useEffect } from 'react';
import { StringUtil } from '../../lib';

type FieldRowType = 'text';

export interface FieldRowProps {
	ref?: RefObject<any>;
	label?: string;
	value: string;
	onClick?: () => void;
	isClickDisabled?: boolean;
	highlight?: boolean;
	isSelected?: boolean;
	allowEdit?: boolean;
	onEdit?: (value: string) => void;
	Editable?: React.ElementType;
	onEditFinish?: (value: string) => void;
	AllowEditIcon?: React.ElementType;
	CancelEditIcon?: React.ElementType;
}

export const FieldRow = ({
	ref,
	label,
	value,
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
}: FieldRowProps) => {
	const [isEditing, setIsEditing] = useState(false);
	const [internalValue, setInternalValue] = useState(value || '');

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

	const FixedField = <div className="w-5/6">{internalValue}</div>;
	const EditableField = (
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
					: StringUtil.replaceEmpty(internalValue)}
			</div>
			<div className="w-1/6 space-x-4 flex flex-row items-center justify-end">
				{isEditing
					? CancelEditIcon && (
							<CancelEditIcon
								onClick={() => {
									setIsEditing(false);
									onEditFinish && onEditFinish(internalValue);
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
};
