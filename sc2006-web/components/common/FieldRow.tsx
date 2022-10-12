/*eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, RefObject, useEffect } from 'react';
import { EyeOutlined } from '@ant-design/icons';
import { ScheduleModalProps } from '../../containers/event/ScheduleModal';
import Form, { Rule } from 'antd/lib/form';
import { PreferencesModalProps } from '../../containers/event/PreferencesModal';

type FieldRowType = string | string[] | Record<string, [string, string]>;

// Ideally isValuePresentable should be true or false, but false is not assignable to true so use undefined or true instead
interface FieldValuePresentableProps<T> extends FieldRowBaseProps<T> {
	value?: T;
	isValuePresentable: true;
	Presentable?: never;
	presentableProps?: never;
}

interface FieldValueNotPresentableProps<T> extends FieldRowBaseProps<T> {
	value?: T;
	isValuePresentable: undefined;
	Presentable?: React.ElementType;
	presentableProps?:
		| Partial<ScheduleModalProps>
		| Partial<PreferencesModalProps>;
}

type FieldRowBaseProps<T> = {
	ref?: RefObject<any>;
	label?: string;
	onClick?: () => void;
	isClickDisabled?: boolean;
	highlight?: boolean;
	isSelected?: boolean;
	allowEdit?: boolean;
	Editable?: React.ElementType;
	onEditFinish?: (value?: T) => void;
	AllowEditIcon?: React.ElementType;
	CancelEditIcon?: React.ElementType;
	formFieldName?: string;
	fieldFormRules?: Rule[];
};

type FieldRowProps<T extends FieldRowType> =
	| FieldValuePresentableProps<T>
	| FieldValueNotPresentableProps<T>;

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
	Editable,
	onEditFinish,
	AllowEditIcon,
	CancelEditIcon,
	Presentable,
	presentableProps,
	formFieldName,
	fieldFormRules,
	...formItemProps
}: FieldRowProps<T>) {
	const [isEditing, setIsEditing] = useState(false);
	const [internalValue, setInternalValue] = useState(value);
	const [modalViewOnly, setModalViewOnly] = useState(false);

	const iconStyle = {
		fontSize: '1.25rem',
		paddingRight: '0.5rem',
	};

	const onChangeHandler = (e: any) => {
		if (allowEdit) {
			setInternalValue(e.target.value);
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
			onClick={() => {
				setModalViewOnly(true);
				// setIsEditing(true);
			}}
		/>
	);

	const FixedField = <div className="w-5/6">{PresentableValue}</div>;
	const EditableField = (
		<>
			<div className="w-5/6 flex flex-row justify-between items-center">
				{isEditing
					? Editable && (
							<Editable
								value={internalValue}
								onChange={onChangeHandler}
								onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
									event.stopPropagation();
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
		</>
	);

	return (
		<>
			<Form.Item
				name={formFieldName}
				rules={fieldFormRules ? fieldFormRules : undefined}
				style={{ margin: 0 }}
				className={`p-2 w-full h-full ${getClassName()}`}
				{...formItemProps}
			>
				<div
					ref={ref}
					onClick={isClickDisabled ? undefined : onClickHandler}
					className="w-full h-full flex flex-row p-2"
				>
					{label && <b className="w-1/6">{label} </b>}
					{allowEdit ? EditableField : FixedField}
				</div>
			</Form.Item>
			{Presentable && (
				<Presentable
					open={isEditing || modalViewOnly}
					onOk={(value: T) => {
						onEditFinish && onEditFinish(value);
						setIsEditing(false);
					}}
					onCancel={() => {
						setIsEditing(false);
						setInternalValue(value);
						setModalViewOnly(false);
						// onEditFinish && onEditFinish(internalValue);
					}}
					viewOnly={modalViewOnly}
					{...presentableProps}
				/>
			)}
		</>
	);
}

function replaceEmpty(obj: any) {
	if (!obj || obj.length === undefined || obj.length === 0) {
		return '-';
	}
	return obj;
}
