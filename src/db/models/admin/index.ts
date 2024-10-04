import { Schema, model } from 'mongoose';
import { IAdmin } from '../intefraces';

const AdminSchema: Schema = new Schema({
	login: {
		type: String,
		min: 5,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	owner: {
		type: Boolean,
		default: false,
	},
});

export default model<IAdmin>('admin', AdminSchema);
