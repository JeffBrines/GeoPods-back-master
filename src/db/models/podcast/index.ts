import { Schema, model } from 'mongoose';
import { ETypePodcast } from '../../../enums/podcastEnums';

import { IPodcast } from '../intefraces';

const locationSchema: Schema = new Schema(
	{
		latitude: {
			type: Number,
			required: true,
		},
		longitude: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: false,
		_id: false,
	},
);

const timeStampsSchema: Schema = new Schema(
	{
		time: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},
	{
		_id: false,
		timestamps: false,
	},
);

const ratingSchema: Schema = new Schema(
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
	},
	{
		timestamps: true,
	},
);

const PodcastModel: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			min: 5,
			max: 150,
		},
		creator: {
			type: Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		author: {
			type: String,
			required: true,
		},
		isAuthor: {
			type: Boolean,
			default: true,
		},
		explicit: {
			type: Boolean,
			default: true,
		},
		location: {
			type: locationSchema,
			required: true,
		},
		url: {
			type: String,
			requied: true,
		},
		description: {
			type: String,
			default: '',
		},
		priority: {
			type: Number,
			enum: [1, 2, 3],
			default: 1,
		},
		type: {
			type: String,
			enum: Object.keys(ETypePodcast),
			required: true,
		},
		categories: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'category',
				},
			],
			default: [],
		},
		timeStamps: {
			type: [timeStampsSchema],
			default: [],
		},
		reviews: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'review'
				}
			],
			default: [],
		},
		listens: {
			type: Number,
			default: 0,
		},
		recordTime: {
			type: Number,
			default: 0,
		},
		photo: {
			type: String,
			default: '',
		},
		averageRating: {
			type: Number,
			default: 0,
			enum: [0, 1, 2, 3, 4, 5],
		},
		reviews_enable: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true,
	},
);

export default model<IPodcast>('podcast', PodcastModel);
