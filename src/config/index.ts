import { IConfig } from './interfaces';
require('dotenv').config();

const config: IConfig = {
	mode: process.env.MODE || 'DEV',
	app: {
		port: process.env.PORT || 5000,
	},
	mongoDb: {
		uri: process.env.DB_CONN,
	},
	nodemailer: {
		service: 'gmail',
		secure: true,
		auth: {
			user: process.env.LOGIN_MAILER,
			pass: process.env.PASS_MAILER,
		},
	},
	google: {
		cliendId: process.env.CLIENT_ID,
	},
	apple: {
		appleId: process.env.APPLE_ID
	},
	jwt: {
		accessSecret: process.env.ACCESS_SECRET,
		refreshSecret: process.env.REFRESH_SECRET,
		temporarySecret: process.env.TEMPORARY_SECRET,
		appSecret: process.env.APP_SECRET,
		recoverySecret: process.env.RECOVERY_SECRET,
		accessTime: process.env.ACCESS_TOKEN_TIME,
		refreshTime: process.env.REFRESH_TOKEN_TIME,
		temporaryTime: process.env.TEMPORARY_TOKEN_TIME,
		appTime: process.env.APP_TOKEN_TIME,
		recoveryTime: process.env.RECOVERY_TIME,
		cookieRefreshTime: process.env.COOKIE_REFRESH_TIME,
	},
};

export default config;
