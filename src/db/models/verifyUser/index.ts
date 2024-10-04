import { Schema, model } from 'mongoose';
import { IVerifyUser } from '../intefraces';

const VerifySchema: Schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'user',
		required: true,
	},
	code: {
		type: String,
		min: 4,
		max: 4,
		required: false,
	},
	verifyEmail: {
		type: Boolean,
		default: false,
	},
	counterVerify: {
		type: Number,
		min: 0,
		max: 6,
		default: 0,
	},
	blockedVerify: {
		type: Boolean,
		default: false,
	},
	blockedTime: {
		type: Date,
	},
});

export default model<IVerifyUser>('verify', VerifySchema);
