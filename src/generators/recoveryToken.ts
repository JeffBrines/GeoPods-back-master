import { Schema } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid';
import config from '../config';

export default (id: Schema.Types.ObjectId): string => {
	const rundomNumber = uuid.v4();
	const token = jwt.sign(
		{
			rundomNumber,
			id,
		},
		config.jwt.recoverySecret,
		{
			expiresIn: config.jwt.recoveryTime,
		},
	);
	return token;
};
