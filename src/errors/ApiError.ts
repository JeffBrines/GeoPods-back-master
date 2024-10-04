import constants from '../constants';

class ApiError {
	statusCode: Number;
	message: String;
	error: any;
	constructor(StatusCode: Number, Message: String, Error?: any) {
		this.statusCode = StatusCode;
		this.message = Message;
		this.error = Error ? Error : 'Custom Error';
	}

	static Unauthorized(message?: String, error?: any) {
		message = message ? message : 'Unauthorized error';
		error = error ? error : true;
		return new ApiError(constants.statusCode.UNAUTHORIZED, message, error);
	}

	static BadRequest(message?: String, error?: any) {
		message = message ? message : 'Bad Request';
		error = error ? error : true;
		return new ApiError(constants.statusCode.BAD_REQUEST, message, error);
	}

	static NotFound(message?: String, error?: any) {
		message = message ? message : 'Not Found';
		error = error ? error : true;
		return new ApiError(constants.statusCode.NOT_FOUND, message, error);
	}

	static ServerError(message?: String, error?: any) {
		message = message ? message : 'Server error :_(';
		error = error ? error : true;
		return new ApiError(constants.statusCode.SERVER_ERROR, message, error);
	}

	static Forbidden(message: String, error?: any) {
		message = message ? message : 'Server error :_(';
		error = error ? error : true;
		return new ApiError(constants.statusCode.FORBIDDEN, message, error);
	}
}

export default ApiError;
