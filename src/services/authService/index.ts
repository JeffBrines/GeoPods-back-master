/*--------------------libraries--------------------*/
import { OAuth2Client } from 'google-auth-library';
import * as bCrypt from 'bcrypt';
import * as jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import * as uuid from 'uuid'
/*--------------------libraries--------------------*/

/*--------------------types--------------------*/
import { ID } from '../../types/mongo';
/*--------------------types--------------------*/

/*--------------------services--------------------*/
import tokenService from '../tokenService';
import verifyUserService from '../verifyUserService';
/*--------------------services--------------------*/

/*--------------------configuration--------------------*/
import config from '../../config';
/*--------------------configuration--------------------*/

/*--------------------error--------------------*/
import ApiError from '../../errors/ApiError';
/*--------------------error--------------------*/

/*--------------------database--------------------*/
import db from '../../db';
/*--------------------database--------------------*/

/*--------------------interfaces--------------------*/
import { IBaseUser, IGoogleAuth, IRegisterLogin } from '../userService/intefraces';
/*--------------------interfaces--------------------*/

/*--------------------enums--------------------*/
import { ETypeUser, ETypeAuth } from '../../enums/userEnums';
/*--------------------enums--------------------*/

/*--------------------tools--------------------*/
import mailer from '../../tools/mail/mailer';
/*--------------------tools--------------------*/

/*--------------------generators--------------------*/
import TemporaryTokenGenerator from '../../generators/temporaryToken';
import RecoveryTokenGenerator from '../../generators/recoveryToken';
/*--------------------generators--------------------*/

export default {
	async register(data: IBaseUser): Promise<string> {
		const userCandidate = await db.UserModel.findOne({ email: data.email });
		if (userCandidate) {
			if (userCandidate.verify === false) {
				await userCandidate.remove();
			} else {
				throw ApiError.BadRequest('User by email already exist', {
					emailExist: true,
				});
			}
		}
		const userNameCandidate = await db.UserModel.findOne({
			userName: data.userName,
		});
		if (userNameCandidate) {
			throw ApiError.BadRequest('User by userName already exist', {
				userNameExist: true,
			});
		}
		if (data.instagram) {
			const isInclude = data.instagram.includes('instagram.com');
			if (!isInclude) {
				throw ApiError.BadRequest('Invalid instagram url');
			}
		}
		if (data.tiktok) {
			const isInclude = data.tiktok.includes('tiktok.com');
			if (!isInclude) {
				throw ApiError.BadRequest('Invalid tiktok url');
			}
		}
		if (data.twitter) {
			const isInclude = data.twitter.includes('twitter.com');
			if (!isInclude) {
				throw ApiError.BadRequest('Invalid twitter url');
			}
		}
		data.password = await bCrypt.hash(data.password, 10);
		Object.assign(data, { type: ETypeUser.default });
		const user = await db.UserModel.create(data);
		const code = await verifyUserService.generateCode(user._id);
		await mailer({
			to: data.email,
			subject: 'GeoPod: Verify code message from',
			html: `
			<div>
				<h2>Verify code:</h2>
				<h1>${code}</h1>
				<p>Don't tell anyone this code!</p>
			</div>
		`,
		});
		const temporaryToken = TemporaryTokenGenerator(user._id);
		return temporaryToken;
	},

	async google(idToken: string): Promise<IGoogleAuth> {
		const client = new OAuth2Client(config.google.cliendId);
		let ticket;
		try {
			ticket = await client.verifyIdToken({
				idToken,
				audience: config.google.cliendId,
			});
		} catch (err) {
			throw ApiError.BadRequest('Invalid google token', err.message);
		}

		const payload = ticket.getPayload();
		if (
			!payload.sub ||
			!payload.name ||
			!payload.email ||
			!payload.email_verified
		) {
			throw ApiError.BadRequest('Invalid payload token');
		}
		const userCandidate = await db.UserModel.findOne({
			key: payload.sub,
			email: payload.email,
			verified: true,
		});
		if (userCandidate) {
			const appToken = await tokenService.appSave(userCandidate._id);
			return { register: false, appToken };
		}
		const option = {
			name: payload.name,
			userName: payload.name,
			key: payload.sub,
			email: payload.email,
			type: ETypeUser.google,
			verify: true,
		};
		if (payload.picture) {
			Object.assign(option, { photo: payload.picture });
		}
		const user = await db.UserModel.create(option);
		const appToken = await tokenService.appSave(user._id);
		return { register: true, appToken };
	},

	async verify(userId: ID, code: string): Promise<string> {
		const user = await db.UserModel.findById(userId).catch(err => {
			console.log(err);
		});
		if (!user) {
			throw ApiError.BadRequest('User by id not found');
		}
		const verified = await verifyUserService.VerifyCode(user._id, code);
		if (!verified) {
			throw ApiError.BadRequest('Invalid code');
		}
		if (user.verify === false) {
			user.verify = true;
			await user.save();
		}
		const appToken = await tokenService.appSave(user._id);
		return appToken;
	},

	async login(email: string, password: string): Promise<string> {
		const user = await db.UserModel.findOne({ email });
		if (!user) {
			throw ApiError.BadRequest('Invalid email or password');
		}
		const isEquals: boolean = await bCrypt.compare(password, user.password);
		if (!isEquals) {
			throw ApiError.BadRequest('Invalid email or password');
		}

		if (!user.verify) {
			throw ApiError.Forbidden('User not verified');
		}
		const appToken = await tokenService.appSave(user._id);
		return appToken;
	},

	async sendEmail(email: string): Promise<string> {
		const user = await db.UserModel.findOne({ email });
		if (!user) {
			throw ApiError.NotFound('User is not found by email');
		}
		if (!user.verify) {
			throw ApiError.Forbidden('User is not verified');
		}
		const code = await verifyUserService.generateCode(user._id);
		await mailer({
			to: email,
			subject: 'GeoPod: Verify code message from',
			html: `
			<div>
				<h2>Verify code:</h2>
				<h1>${code}</h1>
				<p>Don't tell anyone this code!</p>
			</div>
		`,
		});
		const token = TemporaryTokenGenerator(user._id);
		return token;
	},

	async forgotVerify(userId: ID, code: string): Promise<string> {
		const user = await db.UserModel.findById(userId).catch(err => {
			console.log(err);
		});
		if (!user) {
			throw ApiError.BadRequest('User by id not found');
		}
		if (!user.verify) {
			throw ApiError.Forbidden('User is not verified');
		}
		const verified = await verifyUserService.VerifyCode(user._id, code);
		if (!verified) {
			throw ApiError.BadRequest('Invalid code');
		}
		return RecoveryTokenGenerator(userId);
	},

	async newPassword(userId: ID, password: string): Promise<boolean> {
		const user = await db.UserModel.findById(userId).catch(err => {
			console.log(err);
		});
		if (!user) {
			throw ApiError.BadRequest('User by id not found');
		}
		if (!user.verify) {
			throw ApiError.Forbidden('User is not verified');
		}
		const hashPassword = await bCrypt.hash(password, 10);
		user.password = hashPassword;
		await user.save();
		return true;
	},

	async apple(
		tokenId: string,
	): Promise<IRegisterLogin> {
		const client = jwksClient({
			jwksUri: 'https://appleid.apple.com/auth/keys',
		});
		const json = jwt.decode(tokenId, { complete: true });
		if (!json) {
			throw ApiError.Unauthorized('invalid apple tokenId');
		}
		const {
			header: { kid },
		} = json;
		const key = await client.getSigningKey(kid);
		const singingKey = key.getPublicKey();
		const payload = jwt.verify(tokenId, singingKey, (err, pay: any) => {
			if (err) {
				return null;
			}
			return pay;
		}) as unknown as any;

		if (!payload) {
			throw ApiError.Unauthorized('Payload not found');
		}

		if (payload.aud !== config.apple.appleId) {
			throw ApiError.Forbidden('Invalid apple auth-client');
		}
		const userCandidate = await db.UserModel.findOne({
			key: payload.sub,
			email: payload.email,
			type: 'apple',
		});
		if (userCandidate) {
			if (userCandidate.verify) {
				return { id: userCandidate._id, type: ETypeAuth.Login };
			} else {
				await userCandidate.remove();
			}
		}

		let newName;
		if (payload.email) {
			newName = payload.email.split('@')[0]
		} else {
			newName = 'user_' + uuid.v4();
		}

		const user = await db.UserModel.create({
			name: newName,
			userName: newName,
			key: payload.sub,
			email: payload.email,
			type: ETypeUser.apple,
			verify: true,
		});

		return { id: user._id, type: ETypeAuth.Registration };
	}
};
