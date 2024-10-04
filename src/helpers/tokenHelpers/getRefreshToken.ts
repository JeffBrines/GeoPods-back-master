import { Request } from 'express';
import ApiError from '../../errors/ApiError';

export default (req: Request) => {
	const { refreshToken } = req.cookies;
	if (!refreshToken) {
		throw ApiError.Unauthorized('Refresh token in cookies not found');
	}
	return refreshToken;
};
