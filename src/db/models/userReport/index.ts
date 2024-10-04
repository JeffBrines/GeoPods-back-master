import { Schema, model } from 'mongoose';
import { IUserReport } from '../intefraces';


const UserReportModel: Schema = new Schema(
    {
        from: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        suspectUser: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
    },
    {
		timestamps: true,
	},
);

export default model<IUserReport>('userReport', UserReportModel);