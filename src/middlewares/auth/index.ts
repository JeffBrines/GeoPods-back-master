import { NextFunction, Response } from 'express';

import {
	IDefaultRequest,
	IDefaultAdminRequest,
} from '../../controllers/interfaces';
import db from '../../db';
import ApiError from '../../errors/ApiError';

import getToken from '../../helpers/tokenHelpers/getToken';
import verifyToken from '../../helpers/tokenHelpers/verifyToken';

export default {
	async temporaryAuth(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const token: string = getToken(req);
			const payload = verifyToken(token, 'temporary');
			let user;
			if (payload.id) {
				user = await db.UserModel.findById(payload.id)
					.select('email')
					.catch(err => {
						console.log(err);
					});
				if (!user) {
					throw ApiError.Unauthorized('User by id not found');
				}
			} else {
				throw ApiError.Unauthorized('Id in token`s payload not found');
			}
			req.user = user;
			next();
		} catch (err) {
			next(err);
		}
	},

	async appAuth(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const token: string = getToken(req);
			const payload = verifyToken(token, 'app');
			let user;
			if (payload.id) {
				user = await db.UserModel.findById(payload.id)
					.select('email blocked')
					.catch(err => {
						console.log(err);
					});

				if (!user) {
					throw ApiError.Unauthorized('User by id not found');
				}

				if (user.blocked === true) {
					throw ApiError.Forbidden('You are blocked');
				}
			}
			req.user = user;
			next();
		} catch (err) {
			next(ApiError.Unauthorized(err.message, 'Verify app token'));
		}
	},

	async recoveryAuth(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const token: string = getToken(req);
			const payload = verifyToken(token, 'recovery');
			let user;
			if (payload.id) {
				user = await db.UserModel.findById(payload.id)
					.select('email')
					.catch(err => {
						console.log(err);
					});
				if (!user) {
					throw ApiError.Unauthorized('User by id not found');
				}
			}
			req.user = user;
			next();
		} catch (err) {
			next(ApiError.Unauthorized(err.message, 'Verify app token'));
		}
	},

	async adminAuth(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const token: string = getToken(req);
			const payload = verifyToken(token, 'access');
			let admin;
			if (payload.id) {
				admin = await db.AdminModel.findById(payload.id)
					.select('owner')
					.catch(err => {
						console.log(err);
					});
			}
			req.admin = admin;
			next();
		} catch (err) {
			next(ApiError.Unauthorized(err.message, 'Verify admin token'));
		}
	},

	async adminOwnerAuth(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const token: string = getToken(req);
			const payload = verifyToken(token, 'access');
			let admin;
			if (payload.id) {
				admin = await db.AdminModel.findById(payload.id)
					.select('owner')
					.catch(err => {
						console.log(err);
					});
			}
			if (!admin.owner) {
				next(ApiError.Forbidden('Admin is not owner'));
			}
			req.admin = admin;
			next();
		} catch (err) {
			next(ApiError.Unauthorized(err.message, 'Verify admin token'));
		}
	},
};
