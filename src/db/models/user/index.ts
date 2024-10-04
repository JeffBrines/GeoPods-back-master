import { Schema, model } from 'mongoose';

import { ETypeUser } from '../../../enums/userEnums';
import { IUser } from '../intefraces';

const UserModel: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		dateBorn: {
			type: Date,
			required: false,
		},
		country: {
			type: String,
			required: false,
		},
		state: {
			type: String,
			required: false,
		},
		city: {
			type: String,
			required: false,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: false,
		},
		description: {
			type: String,
		},
		photo: {
			type: String,
			default: '',
		},
		type: {
			type: String,
			enum: Object.keys(ETypeUser),
			required: true,
		},
		key: {
			type: String,
		},
		verify: {
			type: Boolean,
			default: false,
		},
		verifyCode: {
			type: String,
		},
		defaultSettings: {
			categories: {
				type: [
					{
						type: Schema.Types.ObjectId,
						ref: 'category',
					},
				],
				default: [],
			},
			minRadius: {
				type: Number,
				min: 0,
				max: 149,
				default: 0,
			},
			maxRadius: {
				type: Number,
				min: 1,
				max: 150,
				default: 150,
			},
			notification: {
				type: Boolean,
				default: true,
			},
			public: {
				type: Boolean,
				default: true,
			},
			rating: {
				type: Number,
				default: 5,
			},
		},
		webUrl: {
			type: String,
		},
		instagram: {
			type: String,
		},
		twitter: {
			type: String,
		},
		tiktok: {
			type: String,
		},
		searchList: {
			type: [String],
			default: [],
			max: 3,
		},
		listeningQueue: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'podcast',
				},
			],
			default: [],
		},
		ownPodcasts: {
			type: [
				{
					type: Schema.Types.ObjectId,
					ref: 'podcast',
				},
			],
			default: [],
		},
		blocked: {
			type: Boolean,
			default: false,
		},
		points: {
			type: Number,
			default: 0,
		},
		unwantedReviews: {
			type: [Schema.Types.ObjectId],
			default: []
		},
	},
	{
		timestamps: true,
	},
);

export default model<IUser>('user', UserModel);
