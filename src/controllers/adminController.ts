import { Response, NextFunction, Request } from 'express';

import { IDefaultAdminRequest, ILoginRequest } from './interfaces';

import adminService from '../services/adminService';
import getRefreshToken from '../helpers/tokenHelpers/getRefreshToken';
import categoryService from '../services/categoryService';

/*--------------------constants--------------------*/
import constants from '../constants/index';
/*--------------------constants--------------------*/

/*--------------------types--------------------*/
import { ID } from '../types/mongo';
/*--------------------types--------------------*/


export default {
	async createAdmin(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { login, password } = req.body;
			const created = await adminService.createAdmin(login, password);
			res.json({ created });
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
			const { login, password } = req.body;
			const { accessToken, refreshToken } = await adminService.login(
				login,
				password,
			);
			res.cookie('refreshToken', refreshToken).json({ accessToken });
		} catch (err) {
			next(err);
		}
	},
	async refreshToken(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const refreshToken = getRefreshToken(req);
		} catch (err) {
			next(err);
		}
	},



	async getAdmins(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

			const admins = await adminService.getAdmins(page, size);
			res.json({ admins });
		} catch (err) {
			next(err);
		}
	},

	async deleteAdmin(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.query.id as unknown as string;
			const successDelete = await adminService.deleteAdmin(id);
			res.json({ successDelete });
		} catch (err) {
			next(err);
		}
	},

	async getPodcasts(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const text = req.query.text as unknown as string;
			const sortBy = Number(req.query.sortBy);
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

			const { podcasts, podcastsAmount } = await adminService.getPodcasts(text, page, size, sortBy);
			res.json({ podcasts, podcastsAmount, page, size });
		} catch (err) {
			next(err);
		}
	},

	async editPodcast(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const id = req.query.id as unknown as ID;

			const podcast = await adminService.editPodcast(id, req.body);
			res.json({ podcast });
		} catch (err) {
			next(err);
		}
	},

	async getUsers(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const text = req.query.text as unknown as string;
			const sortBy = Number(req.query.sortBy);
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

			const { users, usersAmount } = await adminService.getUsers(text, page, size, sortBy);
			res.json({ users, usersAmount, page, size });
		} catch (err) {
			next(err);
		}
	},

	async deleteUser(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.query.id as unknown as ID;

			const user = await adminService.deleteUser(id);
			res.json({ successDelete: true, user });
		} catch (err) {
			next(err);
		}
	},

	async sendMail(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { userId, message } = req.body;

			const success = await adminService.sendMail(userId, message);
			res.json({ success, message });
		} catch (err) {
			next(err);
		}
	},

	async blockUser(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { userId } = req.body;
		
			const user = await adminService.blockUser(userId);
			res.json({ success: true, user });
		} catch (err) {
			next(err);
		}
	},

	async unblockUser(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { userId } = req.body;
		
			const user = await adminService.unblockUser(userId);
			res.json({ success: true, user });
		} catch (err) {
			next(err);
		}
	},

	async getUserAnalytics(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const statistic = await adminService.getUserAnalytics();
			res.json({ statistic });			
		} catch (err) {
			next(err);
		}
	},

	async getCountryAnalytics(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const country = req.query.country as string;
			
			const analytic = await adminService.getCoutryAnalytics(country);
			res.json({ analytic });
		} catch (err) {
			next(err);
		}
	},

	async getTopUsers(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const users = await adminService.getTopUsers();
			res.json({ users });
		} catch (err) {
			next(err);
		}
	},

	async deleteReview(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const reviewId = req.query.id as unknown as ID;

			const review = await adminService.deleteReview(reviewId);
			res.json({ successDelete: true, review});
		} catch (err) {
			next(err);
		}
	},

	async deletePodcast(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const podcastId = req.query.id as unknown as ID;

			const podcast = await adminService.deletePodcast(podcastId);
			res.json({ success: true, podcast});
		} catch (err) {
			next(err);
		}
	},

	async enableReviews(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			await adminService.enableReviews(req.body.podcastId);

			res.json({ success: true });
		} catch (err) {
			next(err);
		}
	},

	async editUser(
		req: IDefaultAdminRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { userId, data } = req.body;

			const user = await adminService.editUser(userId, data);
			res.json({ success: true, user });
		} catch (err) {
			next(err);
		}
	},
  	
};
