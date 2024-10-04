import { ETypeUser, ETypeAuth } from 'src/enums/userEnums';
import { ID } from '../../types/mongo';

export interface IEmail {
	email: string;
}

export interface IFullUser extends IBaseUser {
	defaultSettings: ISettingsProfile;
}

export interface IBaseUser extends IEmail {
	name: string;
	userName: string;
	dateBorn: Date;
	country: string;
	state: string;
	city: string;
	password: string;
	verify: boolean;
	description: string;
	webUrl: string;
	instagram: string;
	twitter: string;
	tiktok: string;
	photo: string;
	type: keyof typeof ETypeUser;
	searchList: string[];
	listeningQueue: ID[];
	ownPodcasts: ID[];
	blocked: boolean;
	points: number;
	unwantedReviews: ID[];
}

export interface ISettingsProfile {
	public: boolean;
	notification: boolean;
	minRadius: number;
	maxRadius: number;
	categories: ID[];
	rating: number;
}

export interface IGoogleAuth {
	login?: boolean;
	register?: boolean;
	appToken: string;
}

export interface IRegisterLogin {
	type: keyof typeof ETypeAuth;
	id: ID;
}

export interface IEditUser {
	name: string;
	userName: string;
	dateBorn: Date;
	country: string;
	state: string;
	city: string;
	description: string;
	webUrl: string;
	instagram: string;
	twitter: string;
	tiktok: string;
	photo: string;
	email: string;
}