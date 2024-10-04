import { Schema } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import config from '../config';

export default (): string => {
	const rundomNumber = uuid.v4();
	const token = jwt.sign(
		{
			rundomNumber,
		},
		config.jwt.refreshSecret,
		{
			expiresIn: config.jwt.refreshTime,
		},
	);
	return token;
};
