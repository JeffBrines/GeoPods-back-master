/*--------------------libraries--------------------*/
import * as bCrypt from 'bcrypt';
/*--------------------libraries--------------------*/

/*--------------------services--------------------*/
import tokenService from '../tokenService';
import podcastService from '../podcastService/index'
/*--------------------services--------------------*/

/*--------------------error--------------------*/
import ApiError from '../../errors/ApiError';
/*--------------------error--------------------*/

/*--------------------database--------------------*/
import db from '../../db';
/*--------------------database--------------------*/

/*--------------------interfaces--------------------*/
import { IAdminTokens } from './interfaces';
import { IAdmin, IPodcast, IUser, IReview } from '../../db/models/intefraces';
import { IEditPodcast } from '../podcastService/interfaces';
import { IEditUser } from '../userService/intefraces';
/*--------------------interfaces--------------------*/

/*--------------------generators--------------------*/
import generateRefreshToken from '../../generators/refreshToken';
import generateAccessToken from '../../generators/accessToken';
/*--------------------generators--------------------*/

/*--------------------types--------------------*/
import { ID } from '../../types/mongo';
/*--------------------types--------------------*/

/*--------------------tools--------------------*/
import mailer from '../../tools/mail/mailer';
/*--------------------tools--------------------*/


export default {
	async login(login: string, password: string): Promise<IAdminTokens> {
		const admin = await db.AdminModel.findOne({ login });
		if (!admin) {
			throw ApiError.BadRequest('Login or password not correct');
		}
		const isEquals = await bCrypt.compare(password, admin.password);
		if (!isEquals) {
			throw ApiError.BadRequest('Login or password not correct');
		}
		const refreshToken = generateRefreshToken();
		await tokenService.adminSave(admin._id, refreshToken);
		const accessToken = generateAccessToken(admin._id);
		return { refreshToken, accessToken };
	},

	async getAdmins(page: number, size: number): Promise<IAdmin[]> {
		const offset: number = page * size - size;

		return await db.AdminModel.find({ owner: false })
			.skip(offset)
			.limit(size)
			.select('login');
	},

	async deleteAdmin(
		adminId: string,
		): Promise<boolean> {
		const admin = await db.AdminModel.findById(adminId);
		if (!admin) {
			throw ApiError.NotFound('Admin by id not found');
		}
		await admin.remove();
		await db.AdminTokenModel.findOneAndRemove({ admin: admin._id });
		return true;
	},

	async createAdmin(login: string, password: string): Promise<boolean> {
		const hashPassword = await bCrypt.hash(password, 10);
		const adminCandidate = await db.AdminModel.findOne({ login });
		if (adminCandidate) {
			throw ApiError.BadRequest('Admin already exist by login');
		}
		await db.AdminModel.create({
			login,
			password: hashPassword,
		});
		return true;
	},

	async getPodcasts(
		text: string,
		page: number,
		size: number,
		sortBy: number,
	): Promise <{ podcasts: IPodcast[], podcastsAmount: number }> {
		const offset = page * size - size;
		const option = {};
		const sortOption = {};

		if (text) {
			Object.assign(option, {name: { $regex: '^' + text, $options: 'im' }});
		};

		if (sortBy === 1) {
			Object.assign(sortOption, { createdAt: -1});
		}


		const podcasts = await db.PodcastModel.find(option)
			.select('-__v -ratings')
			.sort(sortOption)
			.populate({
				path: 'creator',
				select: 'name'
			})
			.populate({
				path: 'categories',
				select: 'name'
			})
			.skip(offset)
			.limit(size);
		
		const podcastsAmount = await db.PodcastModel.count(option);

		return { podcasts, podcastsAmount };
	},

	async editPodcast(
		podcastId: ID,
		data: IEditPodcast
	): Promise<IPodcast> {
		const candidate = await db.PodcastModel.findByIdAndUpdate(podcastId, data);

		if (!candidate) {
			throw ApiError.BadRequest('This podcast doesn\'t exist');
		}

		const podcast = await db.PodcastModel.findById(podcastId)
			.select('-__v -ratings')
			.populate({
				path: 'categories',
				select: 'name'
			});
		return podcast
	},

	async getUsers(
		text: string,
		page: number,
		size: number,
		sortBy: number,
	): Promise<{ users: IUser[], usersAmount: number }> {
		const offset = page * size - size;
		const option = {};
		const sortOption = {};

		if (text) {
			Object.assign(option, {
				$or: [
					{ name: { $regex: '^' + text, $options: 'im' }},
					{ email: { $regex: '^' + text, $options: 'im' }},
				]
			});
		};

		if (sortBy === 1) {
			Object.assign(sortOption, { createdAt: -1});
		}

		const users = await db.UserModel.find(option)
			.select('name userName email photo type country verify blocked createdAt')
			.sort(sortOption)
			.skip(offset)
			.limit(size);
		
		const usersAmount = await db.UserModel.count(option);
		return { users, usersAmount };
	},

	async deleteUser(
		userId: ID,
	): Promise<IUser> {
		const candidate = await db.UserModel.findById(userId)
			.select('name userName email photo type country verify createdAt ownPodcasts');

		if (!candidate) {
			throw ApiError.BadRequest('User with this id doesn\'t exist');
		}

		for (const podcast of candidate.ownPodcasts) {
			try {
				await podcastService.deletePodcast(userId, podcast);
			} catch (err) {
				throw ApiError.BadRequest('Podcat by id not found');
			}
		}

		const user = await candidate.remove();
		await db.ReviewModel.deleteMany({ user: candidate._id });
		return user;
	},

	async sendMail(
		userId: ID,
		message: string,
	): Promise<boolean> {
		const user = await db.UserModel.findById(userId);

		await mailer({
			to: user.email,
			subject: 'GeoPod: Admin message',
			html:`
			<div>
				<h2>${message}</h2>
			</div>
			`
		});
		return true;
	},

	async blockUser(
		userId: ID
	): Promise<IUser> {
		const candidate = await db.UserModel.findById(userId)
			.select('name userName photo email country verify blocked createdAt');

		if (!candidate) {
			throw ApiError.BadRequest('User by id not found');
		}

		if (candidate.blocked === true) {
			throw ApiError.BadRequest('User is already blocked');
		}

		candidate.blocked = true;
		await candidate.save();
		return candidate;
	},

	async unblockUser(
		userId: ID
	): Promise<IUser> {
		const candidate = await db.UserModel.findById(userId)
			.select('name userName photo email country blocked createdAt');

		if (!candidate) {
			throw ApiError.BadRequest('User by id not found');
		}

		if (candidate.blocked === false) {
			throw ApiError.BadRequest('User is already unblocked');
		}

		candidate.blocked = false;
		await candidate.save();
		return candidate;
	},

	async getUserAnalytics(): Promise<any> {
		const statistic = await db.UserModel.aggregate([
			{"$group": { 
				"_id": "$country",
				"count": {"$sum": 1},
			}}
		]);

		let totalCount = 0;
		statistic.forEach((item) => {
			totalCount += item.count;
		});

		statistic.sort((a, b) => {
			return b.count - a.count
		});

		return {statistic, totalCount};
	},

	async getCoutryAnalytics(
		country: string,
	): Promise<any[]> {
		const analytic = await db.UserModel.aggregate([
			{"$match": { "country": country}},
			{"$group": {
				"_id": "$state",
				"count": {"$sum": 1},
			}}
		])
		return analytic
				.sort((a, b) => {
					return b.count - a.count;
				});
	},

	async getTopUsers(): Promise<IUser[]> {
		const MAX_USERS = 10;

		const users = db.UserModel.find()
			.sort({ points: -1 })
			.limit(MAX_USERS)	
			.select('name userName photo email country createdAt points');
		
		return users;
	},

	async deleteReview(
		reviewId: ID
	): Promise<IReview> {
		const review = await db.ReviewModel.findByIdAndDelete({ _id: reviewId })
			.catch(err => {
				throw ApiError.BadRequest('Review by id not found.');
			});

		const podcast = await db.PodcastModel.findById(review.podcast);
		const reviewIndex = podcast.reviews.indexOf(review._id);
		podcast.reviews.splice(reviewIndex, 1);
		await podcast.save();

		return review;
	},

	async deletePodcast(
		podcastId: ID
	): Promise<IPodcast> {
		
		const podcast = await db.PodcastModel.findByIdAndDelete(podcastId);
		if (!podcast) throw ApiError.BadRequest('Podcast by id not found');

		const user = await db.UserModel.findById(podcast.creator);
		const podcastIndex = user.ownPodcasts.indexOf(podcastId);
		user.ownPodcasts.splice(podcastIndex, 1);
		await user.save();
		await db.ReviewModel.deleteMany({ podcast: podcast._id });
		return podcast;
	},

	async enableReviews(
		podcsatId: ID
	): Promise<void> {
		const podcast = await db.PodcastModel.findById(podcsatId);
		if (!podcast) throw ApiError.BadRequest('Podcast by id not found');

		podcast.reviews_enable = !podcast.reviews_enable;
		await podcast.save();
	},

	async editUser(
		userId: ID,
		data: IEditUser
	): Promise<IUser> {
		const candidate = await db.UserModel.findByIdAndUpdate(userId, data)
			.select('-__v -password');
		if (!candidate) throw ApiError.BadRequest('User by id not found');

		const user = await db.UserModel.findById(userId)
			.select('-__v -password -listeningQueue -searchList -ownPodcasts -unwantedReviews -defaultSettings');
		return user;
	}

};
