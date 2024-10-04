/*--------------------libraries--------------------*/
import * as bCrypt from 'bcrypt';
/*--------------------libraries--------------------*/

/*--------------------error--------------------*/
import ApiError from '../../errors/ApiError';
/*--------------------error--------------------*/

/*--------------------types--------------------*/
import { ID } from '../../types/mongo';
/*--------------------types--------------------*/

/*--------------------database--------------------*/
import db from '../../db';
/*--------------------database--------------------*/

/*--------------------interfaces--------------------*/
import { IFullUser, ISettingsProfile } from './intefraces';
import { IUser } from '../../db/models/intefraces';
/*--------------------interfaces--------------------*/

/*--------------------enums--------------------*/
import { ETypeUser } from '../../enums/userEnums';
/*--------------------enums--------------------*/

export default {
	async deleteProfile(userId: ID): Promise<void> {
		//
	},

	async profile(userId: ID): Promise<IUser> {
		return await db.UserModel.findById(userId).select(
			'name userName dateBorn country state city email description webUrl instagram twitter tiktok photo type',
		);
	},

	async editProfile(userId: ID, data: IFullUser): Promise<boolean> {
		const user = await db.UserModel.findById(userId);
		user.name = data.name ? data.name : user.name;
		user.userName = data.userName ? data.userName : user.userName;
		user.country = data.country ? data.country : user.country;
		user.city = data.city ? data.city : user.city;
		user.state = data.state ? data.state : user.state;
		user.description = data.description
			? data.description
			: user.description;
		user.photo = data.photo ? data.photo : user.photo;
		user.webUrl = data.webUrl ? data.webUrl : user.webUrl;
		if (data.instagram) {
			const isInclude = data.instagram.includes('instagram.com');
			if (!isInclude) {
				throw ApiError.BadRequest('Invalid instagram url');
			}
			user.instagram = data.instagram;
		}
		if (data.tiktok) {
			const isInclude = data.tiktok.includes('tiktok.com');
			if (!isInclude) {
				throw ApiError.BadRequest('Invalid tiktok url');
			}
			user.tiktok = data.tiktok;
		}
		if (data.twitter) {
			const isInclude = data.twitter.includes('twitter.com');
			if (!isInclude) {
				throw ApiError.BadRequest('Invalid twitter url');
			}
			user.twitter = data.twitter;
		}

		if (data.userName) {
			const userCandidate = await db.UserModel.findOne({
				userName: data.userName,
				_id: { $ne: user._id },
			});
			if (userCandidate) {
				throw ApiError.BadRequest('User already exist by user name');
			}
			user.userName = data.userName;
		}
		if (data.email) {
			if (user.type === ETypeUser.google) {
				throw ApiError.Forbidden("User can't edit ");
			} else {
				const userCandidate = await db.UserModel.findOne({
					email: data.email,
					_id: { $ne: user._id },
				});
				if (userCandidate && data.email !== user.email) {
					throw ApiError.BadRequest('User by email already exist');
				}
			}
		}
		await user.save();
		return true;
	},

	async getSearchList(userId: ID): Promise<string[]> {
		const { searchList } = await db.UserModel.findById(userId);
		return searchList;
	},

	async profileSettings(userId: ID): Promise<ISettingsProfile> {
		const user = await db.UserModel.findById(userId);
		return user.defaultSettings;
	},

	async editProfileSettings(
		userId: ID,
		data: ISettingsProfile,
	): Promise<ISettingsProfile> {
		for (let category of data.categories) {
			const categoryById = await db.CategoryModel.findById(category);
			if (!categoryById) {
				throw ApiError.BadRequest(
					`Category by id: ${category} not found `,
				);
			}
		}
		await db.UserModel.findByIdAndUpdate(userId, {
			defaultSettings: data,
		});
		const user = await db.UserModel.findById(userId);
		return user.defaultSettings;
	},

	async oldNewPassword(
		userId: ID,
		oldPassword: string,
		newPassword: string,
	): Promise<boolean> {
		const user = await db.UserModel.findById(userId);
		const isEquals = await bCrypt.compare(oldPassword, user.password);
		if (!isEquals) {
			throw ApiError.BadRequest('Old password not correct');
		}
		const hashPassword = await bCrypt.hash(newPassword, 10);
		user.password = hashPassword;
		await user.save();
		return true;
	},

	async addToListeningQueue(
		userId: ID,
		podcastId: ID,
	): Promise<boolean> {
		const candidate = await db.UserModel.findById(userId);

		if (candidate.listeningQueue.includes(podcastId)){
			throw ApiError.BadRequest('This podcast already added');
		}

		candidate.listeningQueue.push(podcastId);
		await candidate.save();
		return true;
	},

	async getListeningQueue(
		userId: ID,
		page: number,
		size: number,
	): Promise<ID[]> {
		const offset: number = page * size - size
		const user = await db.UserModel.findById(userId, 'listeningQueue')
			.populate({
				path: 'listeningQueue',
				select: 'creator name description averageRating location recordTime categories photo',
				populate: [{
					path: 'creator',
					select: 'name'
				},
				{
					path: 'categories',
					select: 'name'
				}]
			});
	
		return user.listeningQueue.reverse().slice(offset, offset + size);
	},

	async deleteFromListeningQueue(
		userId: ID,
		podcastId: ID,
	): Promise<boolean> {
		const candidate = await db.UserModel.findById(
			userId,
			'listeningQueue', 
		);
		const indexOfPodcast = candidate.listeningQueue.indexOf(podcastId);

		if(indexOfPodcast === -1) {
				throw ApiError.BadRequest('Podcast doesn\'t exist');
		}

		candidate.listeningQueue.splice(indexOfPodcast, 1);
		await candidate.save();
		return true;
	}
};
