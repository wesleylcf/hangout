import React, { useContext } from 'react';
import { Form } from 'antd';
import { meService } from '../services';
import { GlobalContext } from '../contexts/GlobalContext';
import { useRouter } from 'next/router';
import { AuthForm, AuthFormType } from '../components/auth';

interface LoginForm {
	email: string;
	password: string;
}

const Login = () => {
	const [form] = Form.useForm<LoginForm>();
	const { setMe } = useContext(GlobalContext);
	const router = useRouter();

	const onSubmit = async (form: LoginForm) => {
		const { email, password } = form;
		try {
			const user = await meService.login({ username: email, password });
			setMe(user);
			router.push('/');
		} catch (e) {
			// toast notification
		}
	};

	return <AuthForm type={AuthFormType.LOGIN} onSubmit={onSubmit} form={form} />;
};

export default Login;
