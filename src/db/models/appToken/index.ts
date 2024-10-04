import { Schema, model } from 'mongoose';

import { IAppToken } from '../intefraces';

const AppTokenModel: Schema = new Schema(
	{
		appToken: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default model<IAppToken>('appToken', AppTokenModel);
