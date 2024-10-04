import { Schema, model } from 'mongoose';
import { IPodcastReport } from '../intefraces';


const PodcastReportModel: Schema = new Schema(
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
        suspectPodcast: {
            type: Schema.Types.ObjectId,
            ref: 'podcast',
            required: true
        },
    },
    {
		timestamps: true,
	},
);

export default model<IPodcastReport>('podcastReport', PodcastReportModel)