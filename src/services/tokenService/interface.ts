import { ID } from '../../types/mongo';

export interface IRefreshField {
	refreshToken: string;
}

export interface IAppTokenField {
	appToken: string;
}

export interface IAdminField {
	admin: ID;
}

export interface IUserField {
	user: ID;
}

export interface IBaseAppToken extends IAppTokenField, IUserField {}

export interface IBaseAdminToken extends IRefreshField, IAdminField {}
