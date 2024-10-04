export interface IBaseAdmin {
	login: string;
	password: string;
	owner: boolean;
}

export interface IAdminTokens {
	accessToken: string;
	refreshToken: string;
}
