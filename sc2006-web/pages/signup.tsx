import React from 'react';
import { Form } from 'antd';
import { meService } from '../services';
import { useRouter } from 'next/router';
import { AuthForm, AuthFormType } from '../components/auth/';

interface SignupForm {
	email: string;
	password: string;
}

const Login = () => {
	const [form] = Form.useForm<SignupForm>();

	const router = useRouter();

	const onSubmit = async (form: SignupForm) => {
		const { email, password } = form;
		try {
			await meService.signup({ username: email, password });
			// toast notification you have signed up
			router.push('/login');
		} catch (e) {
			// toast notification
		}
	};
	return (
		<AuthForm form={form} onSubmit={onSubmit} type={AuthFormType.SIGNUP} />
	);
};

export default Login;
