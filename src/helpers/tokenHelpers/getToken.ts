import { Request } from 'express';
import ApiError from '../../errors/ApiError';
export default (req: Request): string => {
	const authHeader: string = req.headers.authorization;
	if (!authHeader) {
		throw ApiError.Unauthorized('Token not found in headers');
	}
	const [, token] = authHeader && authHeader.split(' ');
	return token;
};
