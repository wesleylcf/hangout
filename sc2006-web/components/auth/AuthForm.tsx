import { Card, InputLabel, TextInput, PasswordInput } from '../common';
import { Form, Input, FormInstance } from 'antd';
import { Regex } from '../../types/constants';

export enum AuthFormType {
	SIGNUP = 'signup',
	LOGIN = 'login',
}

interface AuthFormProps {
	form: FormInstance;
	onSubmit: (form: IForm) => Promise<void>;
	type: AuthFormType;
}

interface IForm {
	email: string;
	password: string;
}

export const AuthForm = ({ form, onSubmit, type }: AuthFormProps) => {
	const { setFieldValue, getFieldValue } = form;

	const renderAssistiveText = () => {
		if (type === AuthFormType.LOGIN) {
			return (
				<div className="flex flex-row items-center w-3/5">
					Need an account?
					<a className="pl-2">Sign up</a>
				</div>
			);
		}
		if (type === AuthFormType.SIGNUP) {
			return (
				<div className="flex flex-row items-center w-3/5">
					Already have an account?
					<a className="pl-2">Login</a>
				</div>
			);
		}
	};

	return (
		<Card className="p-5 w-3/6 flex flex-col justify-center items-start space-y-2">
			<Form
				className="w-full h-full"
				initialValues={{ email: '', password: '' }}
				form={form}
				onFinish={onSubmit}
			>
				<InputLabel>Email</InputLabel>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: 'Email cannot be empty',
						},
						{
							pattern: Regex.EMAIL,
							message: 'Invalid email entered',
						},
					]}
				>
					<TextInput
						onChange={(e: any) => setFieldValue('email', e.target.value)}
						value={getFieldValue('email')}
					/>
				</Form.Item>

				<InputLabel>Password</InputLabel>
				<Form.Item
					name="password"
					rules={[
						{
							required: true,
							message: 'Password cannot be empty',
						},
						{
							min: 8,
							message: 'Password must be at least 8 characters',
						},
					]}
				>
					<PasswordInput
						value={getFieldValue('password')}
						onChange={(e: any) => setFieldValue('password', e.target.value)}
					/>
				</Form.Item>
				<div className="pt-2 flex flex-row items-center space-x-4">
					<div className="w-2/5">
						<Input
							type="submit"
							value={type === AuthFormType.LOGIN ? 'Login' : 'Sign up'}
							size="small"
							className="h-8 sky-400"
						/>
					</div>
					{renderAssistiveText()}
				</div>
			</Form>
		</Card>
	);
};
