/*--------------------libraries--------------------*/
import { Response, NextFunction } from 'express';
import { Types } from 'mongoose'
/*--------------------libraries--------------------*/

/*--------------------services--------------------*/
import podcastService from '../services/podcastService';
/*--------------------services--------------------*/

/*--------------------interfaces--------------------*/
import { ICreatePodcastRequest, IDefaultRequest } from './interfaces';
/*--------------------interfaces--------------------*/

/*--------------------types--------------------*/
import { ID } from '../types/mongo';
/*--------------------types--------------------*/

/*--------------------error--------------------*/
import ApiError from '../errors/ApiError';
/*--------------------error--------------------*/

/*--------------------constants--------------------*/
import constants from '../constants/index';
/*--------------------constants--------------------*/

export default {
	async createPodcast(
		req: ICreatePodcastRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const podcast = await podcastService.createPodcast(
				user._id,
				req.body,
			);
			res.json({ podcast });
		} catch (err) {
			next(err);
		}
	},

	async submitPodcast(
		req: ICreatePodcastRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const submitPodcast = await podcastService.submitPodcast(
				user._id,
				req.body,
			);
			res.json({ submitPodcast });
		} catch (err) {
			next(err);
		}
	},

	async deletePodcast(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const id = req.query.id as unknown as ID;
			await podcastService.deletePodcast(user._id, id);
			res.json({ deleted: true });
		} catch (err) {
			next(err);
		}
	},

	async editPodcast(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const id = req.query.id as unknown as ID;
			const podcast = await podcastService.editPodcast(
				user._id,
				id,
				req.body,
			);
			res.json({ podcast });
		} catch (err) {
			next(err);
		}
	},

	async getAllPodcasts(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const podcasts = await podcastService.getAllPodcasts(user._id);
			res.json({ podcasts });
		} catch (err) {
			next(err);
		}
	},

	async searchPodcast(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const text = req.query.text as unknown as string;
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;
			
			const podcasts = await podcastService.searchPodcast(
				user._id,
				req.body,
				text,
				page,
				size,
			);
			res.json({ podcasts, page, size });
		} catch (err) {
			next(err);
		}
	},

	async searchUser(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const text = req.query.text as unknown as string;
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

			const podcasts = await podcastService.searchUser(
				user._id,
				req.body,
				text,
				page,
				size,
			);
			res.json({ podcasts, page, size });
		} catch (err) {
			next(err);
		}
	},

	async nearbyPodcasts(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

			const podcasts = await podcastService.nearbyPodcasts(req.body, page, size);
			res.json({ podcasts, page, size });
		} catch (err) {
			next(err);
		}
	},

	async getUserRating(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const rating = await podcastService.ownAverageRating(user._id);
			res.json({ rating });
		} catch (err) {
			next(err);
		}
	},

	async getPodcast(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const id = req.query.id as unknown as ID;
			const podcast = await podcastService.getPodcast(id, user._id);
			res.json({ podcast });
		} catch (err) {
			next(err);
		}
	},

	async getMyPodcasts(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

			const { podcasts, totalCount } = await podcastService.getMyPodcasts(user._id, page, size);
			res.json({ podcasts, totalCount, page, size });
		} catch (err) {
			next(err);
		}
	},

	async setReviewPodcast(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { user } = req;
			const id = req.query.id as unknown as string;
			const podcastId = new Types.ObjectId(id);
			const { rating, message } = req.body;

			const review = await podcastService.setReviewPodcast(
				user._id,
				rating,
				message,
				podcastId
			);
			res.json({ setted: true, review });
		} catch (err) {
			next(err);
		}
	},

	async getReviews(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.query.id as unknown as ID;
			const { user } = req;
			const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;
			
			const reviews = await podcastService.getReviews(user._id, id, page, size);
			res.json({ reviews, page, size });
		} catch (err) {
			next(err);
		}
	},

	async deleteReview(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { user } = req;
			const reviewId = req.query.id as unknown as ID;

			const review = await podcastService.deleteReview(user._id, reviewId);
			res.json({ successDelete: true, review });
		} catch (err) {
			next(err);
		}
	},

	async getSearchList(
		req: IDefaultRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { user } = req;
			
			const searchList = await podcastService.getSearchList(user._id);
			res.json({ searchList });
		} catch (err) {
			next(err);
		}
	},


};
