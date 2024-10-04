import { IConstants } from './interfaces';

const constants: IConstants = {
	statusCode: {
		OK: 200,
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		FORBIDDEN: 403,
		CONFLICT: 409,
		SERVER_ERROR: 500,
		NOT_FOUND: 404,
	},

	defaultPagination: {
		PAGE: 1,
		SIZE: 9,
	},
	
};

export default constants;
