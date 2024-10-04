import { Request } from 'express';
import { IEmail } from '../services/userService/intefraces';
import { IBasePodcast } from '../services/podcastService/interfaces';

import { ID } from '../types/mongo';

//auth
export interface IRegisterRequest extends Request {
	name: string;
	userName: string;
	dateBorn: Date;
	country: string;
	city: string;
	email: string;
	password: string;
	description?: string;
	webUrl?: string;
	instagram?: string;
	twitter?: string;
	tiktok?: string;
}
export interface IDefaultRequest extends Request {
	user: {
		_id: ID;
		email?: string;
	};
}

export interface IDefaultAdminRequest extends Request {
	admin: {
		_id: ID;
		owner?: boolean;
	};
}

export interface ILoginRequest extends Request {
	login: string;
	password: string;
}

export interface IEmailRequest extends IEmail, Request {}

//auth

//user
export interface IEditProfileRequest extends IDefaultRequest {
	name?: string;
	userName?: string;
	dateBorn?: Date;
	country?: string;
	city?: string;
	email?: string;
	description?: string;
	webUrl?: string;
	instagram?: string;
	twitter?: string;
	tiktok?: string;
}

export interface ISettingsProfileRequest extends IDefaultRequest {
	public?: boolean;
	notification?: boolean;
	minRadius: number;
	maxRadius: number;
	categories: ID[];
}

export interface INewPasswordRequest extends IDefaultRequest {
	newPassword: string;
}

export interface IOldNewPasswordRequest extends INewPasswordRequest {
	oldPassword: string;
}

export interface ICreateCategoryRequest extends IDefaultAdminRequest {
	name: string;
}

export interface ICreatePodcastRequest extends IDefaultRequest, IBasePodcast {}
