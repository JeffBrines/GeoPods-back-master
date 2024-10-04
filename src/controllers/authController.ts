import { Request, Response, NextFunction } from 'express';

import {
	IDefaultRequest,
	IEmailRequest,
	ILoginRequest,
	INewPasswordRequest,
	IRegisterRequest,
} from './interfaces';

import userService from '../services/userService';
import authService from '../services/authService';
import { ETypeAuth } from '../enums/userEnums';
import ApiError from '../errors/ApiError';
import generateRecoveryToken from '../generators/recoveryToken';
import generateAppToken from '../generators/appToken';

export default {
	async register(
		req: IRegisterRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const temporaryToken = await authService.register(req.body);
			res.json({
				successRegistration: true,
				message: 'Code send on email',
				temporaryToken,
			});
		} catch (err) {
			next(err);
		}
	},

	async verify(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const { code } = req.params;
			const appToken = await authService.verify(user._id, code);
			res.json({
				successVerified: true,
				appToken,
				message: 'User success verified',
			});
		} catch (err) {
			next(err);
		}
	},

	async login(
		req: ILoginRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { email, password } = req.body;
			const appToken: string = await authService.login(email, password);
			res.json({
				successLogin: true,
				message: 'User login success',
				appToken,
			});
		} catch (err) {
			next(err);
		}
	},

	async google(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { tokenId } = req.body;
			const processAuth = await authService.google(tokenId);
			res.json(processAuth);
		} catch (err) {
			next(err);
		}
	},
	async sendEmail(
		req: IEmailRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { email } = req.body;
			const temporaryToken = await authService.sendEmail(email);
			res.json({ temporaryToken });
		} catch (err) {
			next(err);
		}
	},

	async forgotVerify(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const { code } = req.params;
			const recoveryToken = await authService.forgotVerify(
				user._id,
				code,
			);
			res.json({ recoveryToken });
		} catch (err) {
			next(err);
		}
	},

	async forgotNewPassword(
		req: INewPasswordRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const { newPassword } = req.body;
			const editedPassword = await authService.newPassword(
				user._id,
				newPassword,
			);
			res.json({ editedPassword });
		} catch (err) {
			next(err);
		}
	},

	async apple(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { tokenId } = req.body;
			const { id, type } = await authService.apple(tokenId);
			const appToken = generateAppToken(id);
			if (type === ETypeAuth.Login) {
				res.json({ appToken, registration: false });
			} else if (type === ETypeAuth.Registration) {
				res.json({ appToken, registration: true });
			} else {
				throw ApiError.ServerError('Apple auth error');
			}
		} catch (err) {
			next(err);
		}
	},
};
