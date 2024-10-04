interface IJwt {
	accessSecret: string;
	refreshSecret: string;
	accessTime: string;
	refreshTime: string;
	cookieRefreshTime: string;
	temporarySecret: string;
	temporaryTime: string;
	appSecret: string;
	appTime: string;
	recoverySecret: string;
	recoveryTime: string;
}

interface IApp {
	port: number | string;
}

interface IMailer {
	service: string;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	};
}
interface IGoogle {
	cliendId: string;
}

interface IApple {
	appleId: string;
}

interface IFacebook {
	clientId: string;
	clientSecret: string;
}

export interface IConfig {
	readonly mode: string;
	readonly app: IApp;
	readonly jwt: IJwt;
	readonly google: IGoogle;
	readonly apple: IApple;
	readonly mongoDb: { uri: string };
	readonly nodemailer: IMailer;
}
