import { Schema, model } from 'mongoose';
import { IReview } from '../intefraces';

const ReviewModel: Schema = new Schema(
    {
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user',
		},
		rating: {
			type: Number,
			enum: [1, 2, 3, 4, 5],
		},
		message: {
			type: String,
		},
        podcast: {
            type: Schema.Types.ObjectId,
            ref: 'podcast'
        },
	},
	{
		timestamps: true,
	},
);

export default model<IReview>('review', ReviewModel);