import { Schema, model } from 'mongoose';
import { IReviewReport } from '../intefraces';

const ReviewReportModel: Schema = new Schema(
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
        suspectReview: {
            type: Schema.Types.ObjectId,
            ref: 'review',
            required: true,
        },
    },
    {
		timestamps: true,
	},
);

export default model<IReviewReport>('reviewReport', ReviewReportModel);