import React, { useState, useContext } from 'react';
import { TextInput, InputLabel, Card, Button } from '../components/common';

import { Form, Input } from 'antd';
import { meService } from '../services';
import { GlobalContext, Me } from '../contexts/GlobalContext';
import { Regex } from '../../sc2006-common/';
import { PasswordInput } from '../components/common/PasswordInput';
import { useRouter } from 'next/router';

interface Form {
	email: string;
	password: string;
}

const login = () => {
	const [form] = Form.useForm<Form>();
	const { setFieldValue, getFieldValue } = form;
	const { setMe } = useContext(GlobalContext);
	const router = useRouter();

	const onSubmit = async (form: Form) => {
		const { email, password } = form;
		try {
			const user = await meService.login({ username: email, password });
			setMe(user);
			router.push('/');
		} catch (e) {
			// toast notification
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
							value="Login"
							size="small"
							className="h-8 sky-400"
						/>
					</div>

					<div className="flex flex-row items-center w-3/5">
						Need an account? <a className="pl-2">Sign up</a>
					</div>
				</div>
			</Form>
		</Card>
	);
};

export default login;
