import { ID } from '../../types/mongo';

export interface ITimeStamp {
	time: string;
	name: string;
}

export interface IBaseReview {
	user: ID;
	rating: number;
	message: string;
	podcast: ID;
}

export interface ILocation {
	latitude: number;
	longitude: number;
}

export interface IBasePodcast {
	name: string;
	creator: ID;
	author: string;
	location: ILocation;
	priority: number;
	timeStamps: ITimeStamp[];
	categories: ID[];
	reviews?: ID[];
	listens: number;
	description: string;
	type: string;
	recordTime: number;
	url: string;
	photo: string;
	isAuthor: boolean;
	explicit: boolean;
	averageRating: number;
	reviews_enable: boolean;
}

export interface IDefaultFilter {
	latitude: number;
	longitude: number;
	minLength: number;
	maxLength: number;
	fullLength?: boolean;
	categories: ID[];
	averageRating: number;
	sortBy: number;
	minRecordTime: number;
	maxRecordTime: number;
}

export interface IEditPodcast {
	name?: string;
	author?: string;
	location?: ILocation;
	categories?: ID[];
	description?: string;
	url?: string;
	photo?: string;
	priority?: number;
	explicit?: boolean;
}
