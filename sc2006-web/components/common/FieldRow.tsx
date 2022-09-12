/* eslint-disable no-mixed-spaces-and-tabs */
import { useState, RefObject } from 'react';

type FieldRowType = 'text';

export interface FieldRowProps {
	ref?: RefObject<any>;
	label?: string;
	value: string | string[];
	onClick?: () => void;
	isClickDisabled?: boolean;
	highlight?: boolean;
	isSelected?: boolean;
	allowEdit?: boolean;
	Editable?: React.ElementType;
	onEdit?: (value: string) => void;
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
	Editable,
	onEdit,
	AllowEditIcon,
	CancelEditIcon,
}: FieldRowProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const iconStyle = {
		fontSize: '1.25rem',
		paddingRight: '0.5rem',
	};

	const onChangeHandler = (e: any) => {
		if (allowEdit && !onEdit) {
			throw new Error(
				`FieldRow component was not passed onEdit prop but allowEdit was set to true`,
			);
		}
		if (onEdit) {
			onEdit(e.target.value);
		}
	};

	const onClickHandler = () => {
		if (onClick) {
			onClick();
		}
	};

	const getClassName = () => {
		if (isClickDisabled) return 'text-black bg-neutral-400';
		if (isSelected) return 'text-white bg-cyan-400';
		if (highlight) return 'bg-sky-100';
		return '';
	};

	const FixedField = <div className="w-5/6">{value}</div>;
	const EditableField = (
		<div className="w-5/6 flex flex-row justify-between items-center">
			<div className="w-5/6">
				{isEditing
					? Editable && <Editable value={value} onChange={onChangeHandler} />
					: value}
			</div>
			<div className="w-1/6 space-x-4 flex flex-row items-center justify-end">
				{isEditing
					? CancelEditIcon && (
							<CancelEditIcon
								onClick={() => {
									setIsEditing(false);
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
