/*--------------------libraries--------------------*/
import { Response, NextFunction } from 'express';
/*--------------------libraries--------------------*/

/*--------------------services--------------------*/
import userService from '../services/userService';
/*--------------------services--------------------*/

/*--------------------interfaces--------------------*/
import {
	IDefaultRequest,
	IEditProfileRequest,
	IOldNewPasswordRequest,
	ISettingsProfileRequest,
} from './interfaces';
/*--------------------interfaces--------------------*/

/*--------------------constants--------------------*/
import constants from '../constants/index';
/*--------------------constants--------------------*/

export default {
	async profile(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const profile = await userService.profile(user._id);
			res.json({ profile, successGet: true });
		} catch (err) {
			next(err);
		}
	},

	async editProfile(
		req: IEditProfileRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const updatedProfile = await userService.editProfile(
				user._id,
				req.body,
			);
			res.json({ updatedProfile });
		} catch (err) {
			next(err);
		}
	},

	async getSearchList(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const list = await userService.getSearchList(user._id);
			res.json({ list });
		} catch (err) {
			next(err);
		}
	},

	async profileSettings(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const profileSettings = await userService.profileSettings(user._id);
			res.json({ profileSettings });
		} catch (err) {
			next(err);
		}
	},
	async editProfileSettings(
		req: ISettingsProfileRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const editedSettings = await userService.editProfileSettings(
				user._id,
				req.body,
			);
			res.json({ editedSettings });
		} catch (err) {
			next(err);
		}
	},

	async deleteProfile(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			await userService.deleteProfile(user._id);
		} catch (err) {
			next(err);
		}
	},

	async oldNewPassword(
		req: IOldNewPasswordRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const { oldPassword, newPassword } = req.body;
			const updatedPassword = await userService.oldNewPassword(
				user._id,
				oldPassword,
				newPassword,
			);
			res.json({ updatedPassword });
		} catch (err) {
			next(err);
		}
	},

	async addToListeningQueue(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const { podcastId } = req.body;

			const success = await userService.addToListeningQueue(user._id, podcastId);
			res.json({ success });
		} catch (err) {
			next(err);
		}
	},

	async getListeningQueue(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

			const listeningQueue = await userService.getListeningQueue(user._id, page, size);
			res.json({ listeningQueue, page, size });
		} catch (err) {
			next(err);
		}
	},

	async deleteFromListeningQueue(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const { podcastId } = req.body;

			const success = await userService.deleteFromListeningQueue(user._id, podcastId);
			res.json({ success });
		} catch (err) {
			next(err);
		}
	},

};
