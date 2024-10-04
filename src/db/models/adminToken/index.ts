import { Schema, model } from 'mongoose';

import { IAdminToken } from '../intefraces';

const AdminTokenModel: Schema = new Schema(
	{
		refreshToken: {
			type: String,
			required: true,
		},
		admin: {
			type: Schema.Types.ObjectId,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default model<IAdminToken>('adminToken', AdminTokenModel);
