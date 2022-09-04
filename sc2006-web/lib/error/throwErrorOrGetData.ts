import { ErrorUtil } from '.';

type ErrorResponse = Response & {
	message?: string;
};

interface ThrowErrorOrGetDataOptions {
	fallbackTitle?: string;
	fallbackMessage?: string;
	responseNotNeeded?: boolean;
}

/*
	If a response is successful, simply return it
	Otherwise, extract the error message and return an PresentableError
*/
export async function throwErrorOrGetData<T>(
	response: ErrorResponse,
	options: ThrowErrorOrGetDataOptions,
): Promise<T> {
	const { status } = response;
	const data = await response.json();
	const { fallbackTitle, fallbackMessage } = options;
	if (status < 205) {
		return data;
	}
	const error = data.error;
	const message = data.message;

	if (error) {
		throw ErrorUtil.apiError(error.message, error.title, error.level);
	} else {
		throw ErrorUtil.apiError(message || fallbackMessage, fallbackTitle);
	}
}
