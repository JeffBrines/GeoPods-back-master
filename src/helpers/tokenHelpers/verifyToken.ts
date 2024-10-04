import * as jwt from 'jsonwebtoken';
import config from '../../config';
import ApiError from '../../errors/ApiError';
import { ETokenType } from '../../enums/tokenEnums';

export default (token: string, type: keyof typeof ETokenType): any => {
	try {
		let secret: string;
		switch (type) {
			case 'access':
				secret = config.jwt.accessSecret;
				break;
			case 'refresh':
				secret = config.jwt.refreshSecret;
				break;
			case 'app':
				secret = config.jwt.appSecret;
				break;
			case 'temporary':
				secret = config.jwt.temporarySecret;
				break;
			case 'recovery':
				secret = config.jwt.recoverySecret;
			default:
				break;
		}
		return jwt.verify(token, secret); //payload from token
	} catch (err) {
		throw ApiError.Unauthorized('Invalid token', err);
	}
};
