/*--------------------database--------------------*/
import db from '../../db';
/*--------------------database--------------------*/

/*--------------------error--------------------*/
import ApiError from '../../errors/ApiError';
/*--------------------error--------------------*/

/*--------------------types--------------------*/
import { ID } from '../../types/mongo';
/*--------------------types--------------------*/

/*--------------------interfaces--------------------*/
import { IPodcast, IReview } from '../../db/models/intefraces';
import { IBasePodcast, IDefaultFilter, IEditPodcast } from './interfaces';
/*--------------------interfaces--------------------*/

/*--------------------enums--------------------*/
import { ETypePodcast } from '../../enums/podcastEnums';
/*--------------------enums--------------------*/

/*--------------------helpers--------------------*/
import addSearchList from '../../helpers/userHelpers/addSearchList';
/*--------------------helpers--------------------*/

/*--------------------utils--------------------*/
import utils from './utils';
/*--------------------utils--------------------*/

export default {
	async createPodcast(userId: ID, data: IBasePodcast): Promise<IPodcast> {
		const user = await db.UserModel.findById(userId);

		for (let categoryId of data.categories) {
			const category = await db.CategoryModel.findById(categoryId).catch(
				err => {
					console.log('Error find category by input id');
				},
			);
			if (!category) {
				throw ApiError.NotFound(
					`Category by id: |${categoryId}| not found`,
				);
			}
		}

		const podcast = await db.PodcastModel.create({
			name: data.name,
			creator: userId,
			author: user.name,
			isAuthor: true,
			type: ETypePodcast.Create,
			explicit: data.explicit,
			url: data.url,
			photo: data.photo,
			location: data.location,
			description: data.description,
			categories: data.categories,
			timeStamps: data.timeStamps,
			priority: data.priority,
			recordTime: data.recordTime,
		});

		user.ownPodcasts.push(podcast._id);
		user.points += 3;
		await user.save();

		return podcast;
	},

	async submitPodcast(userId: ID, data: IBasePodcast): Promise<IPodcast> {
		for (let categoryId of data.categories) {
			const category = await db.CategoryModel.findById(categoryId);
			if (!category) {
				throw ApiError.NotFound(
					`Category |${category}| by id not found`,
				);
			}
		}

		return await db.PodcastModel.create({
			name: data.name,
			creator: userId,
			author: data.author,
			isAuthor: data.isAuthor,
			type: ETypePodcast.Submit,
			explicit: data.explicit,
			url: data.url,
			location: data.location,
			description: data.description,
			categories: data.categories,
			timeStamps: data.timeStamps,
			priority: data.priority,
		});
	},

	async deletePodcast(userId: ID, podcastId: ID): Promise<void> {
		const podcast = await db.PodcastModel.findOne({
			_id: podcastId,
			creator: userId,
		}).catch(err => {
			console.log('Podcast by id not found');
		});
		if (!podcast) {
			throw ApiError.NotFound(
				'Podcast by ID not found or you are not the author',
			);
		}
		await podcast.delete();
		const user = await db.UserModel.findById(userId);
		const podcastIndex = user.ownPodcasts.indexOf(podcastId);
		user.ownPodcasts.splice(podcastIndex, 1);
		await user.save();
		await db.ReviewModel.deleteMany({ podcast: podcast._id });
	},

	async editPodcast(
		userId: ID,
		podcastId: ID,
		data: IEditPodcast,
	): Promise<IPodcast> {
		const podcast = await db.PodcastModel.findOne({
			_id: podcastId,
			creator: userId,
		}).catch(err => {
			console.log('Podcast not found by id');
		});
		if (!podcast) {
			throw ApiError.NotFound(
				'Podcast not found by id or user is not author',
			);
		}
		await db.PodcastModel.findOneAndUpdate(
			{
				_id: podcastId,
				creator: userId,
			},
			data,
		);
		return db.PodcastModel.findById(podcastId)
			.populate({
				path: 'categories',
			})
			.populate({ path: 'creator', select: 'name userName' });
	},

	async getAllPodcasts(userId: ID): Promise<IPodcast[]> {
		const user = await db.UserModel.findById(userId);
		const { defaultSettings } = user;
		const option = {};
		if (defaultSettings.categories.length !== 0) {
			Object.assign(option, {
				categories: { $in: defaultSettings.categories },
			});
		}
		return await db.PodcastModel.find(option)
			.populate({
				path: 'categories',
			})
			.populate({ path: 'creator', select: 'name userName' });
	},

	async searchPodcast(
		userId: ID,
		data: IDefaultFilter,
		text: string,
		page: number,
		size: number,
	): Promise<IPodcast[]> {
		const startFrom = (page - 1) * size;
		const option = {};

		if (data.minRecordTime && data.maxRecordTime) {
			Object.assign(option, {
				recordTime: {
					$gte: data.minRecordTime,
					$lte: data.maxRecordTime,
				},
			});
		}

		if (data.averageRating) {
			Object.assign(option, {
				averageRating: { $gte: data.averageRating },
			});
		}

		if (data.categories) {
			Object.assign(option, { categories: { $in: data.categories } });
		}

		if (text) {
			Object.assign(option, {
				$or: [
					{ name: { $regex: text, $options: 'i' } },
					{ description: { $regex: text, $options: 'i' } },
				],
			});
			await addSearchList(userId, text);
		}

		const podcasts = await db.PodcastModel.find(option)
			.select('-__v -author -timeStamps')
			.sort({
				createdAt: -1,
			})
			.populate({
				path: 'creator',
				select: 'name',
			})
			.populate('categories');

		if (podcasts.length === 0) {
			return [];
		}
		let sortedByLength;
		if (data.fullLength === true) {
			sortedByLength = podcasts.sort((a, b) => {
				return (
					utils.calculateTheDistance(
						b.location.latitude,
						b.location.longitude,
						data.latitude,
						data.longitude,
					) -
					utils.calculateTheDistance(
						a.location.latitude,
						a.location.longitude,
						data.latitude,
						data.longitude,
					)
				);
			});
		} else {
			sortedByLength = podcasts
				.filter(item => {
					const podcastLength = utils.calculateTheDistance(
						item.location.latitude,
						item.location.longitude,
						data.latitude,
						data.longitude,
					);
					return (
						data.minLength <= podcastLength &&
						podcastLength <= data.maxLength
					);
				})
				.sort((a, b) => {
					return (
						utils.calculateTheDistance(
							b.location.latitude,
							b.location.longitude,
							data.latitude,
							data.longitude,
						) -
						utils.calculateTheDistance(
							a.location.latitude,
							a.location.longitude,
							data.latitude,
							data.longitude,
						)
					);
				});
		}

		if (data.sortBy === 1) {
			const sortedByPopularity = sortedByLength.sort(function (a, b) {
				return b.listens - a.listens;
			});

			return sortedByPopularity.splice(startFrom, size);
		}

		return sortedByLength.reverse().splice(startFrom, size);
	},

	async nearbyPodcasts(
		data: IDefaultFilter,
		page: number,
		size: number,
	): Promise<IPodcast[]> {
		const offset = page * size - size;
		const option = {};

		if (data.minRecordTime && data.maxRecordTime) {
			Object.assign(option, {
				recordTime: {
					$gte: data.minRecordTime,
					$lte: data.maxRecordTime,
				},
			});
		}

		if (data.averageRating) {
			Object.assign(option, {
				averageRating: { $gte: data.averageRating },
			});
		}

		if (data.categories) {
			Object.assign(option, { categories: { $in: data.categories } });
		}

		const podcasts = await db.PodcastModel.find(option)
			.select('-__v -author -timeStamps')
			.sort({
				createdAt: -1,
			})
			.populate({
				path: 'creator',
				select: 'name',
			})
			.populate('categories');

		if (podcasts.length === 0) {
			return [];
		}
		if (data.fullLength) {
		}

		let sortedByLength;
		if (data.fullLength === true) {
			sortedByLength = podcasts.sort((a, b) => {
				return (
					utils.calculateTheDistance(
						b.location.latitude,
						b.location.longitude,
						data.latitude,
						data.longitude,
					) -
					utils.calculateTheDistance(
						a.location.latitude,
						a.location.longitude,
						data.latitude,
						data.longitude,
					)
				);
			});
		} else {
			sortedByLength = podcasts
				.filter(item => {
					const podcastLength = utils.calculateTheDistance(
						item.location.latitude,
						item.location.longitude,
						data.latitude,
						data.longitude,
					);
					return (
						data.minLength <= podcastLength &&
						podcastLength <= data.maxLength
					);
				})
				.sort((a, b) => {
					return (
						utils.calculateTheDistance(
							b.location.latitude,
							b.location.longitude,
							data.latitude,
							data.longitude,
						) -
						utils.calculateTheDistance(
							a.location.latitude,
							a.location.longitude,
							data.latitude,
							data.longitude,
						)
					);
				});
		}

		if (data.sortBy === 1) {
			const sortedByPopularity = sortedByLength.sort(function (a, b) {
				return b.listens - a.listens;
			});

			return sortedByPopularity.splice(offset, size);
		}

		return sortedByLength.reverse().splice(offset, size);
	},

	async searchUser(
		userId: ID,
		data: IDefaultFilter,
		text: string,
		page: number,
		size: number,
	): Promise<IPodcast[]> {
		const startFrom = (page - 1) * size;
		const option = {};

		if (data.minRecordTime && data.maxRecordTime) {
			Object.assign(option, {
				recordTime: {
					$gte: data.minRecordTime,
					$lte: data.maxRecordTime,
				},
			});
		}

		if (data.averageRating) {
			Object.assign(option, {
				averageRating: { $gte: data.averageRating },
			});
		}

		if (data.categories) {
			Object.assign(option, { categories: { $in: data.categories } });
		}

		if (text) {
			Object.assign(option, { author: { $regex: text, $options: 'i' } });
			await addSearchList(userId, text);
		}

		const podcasts = await db.PodcastModel.find(option)
			.select('-__v')
			.sort({
				listens: -1,
			})
			.populate({
				path: 'creator',
				select: 'name',
			})
			.populate('categories');

		if (podcasts.length === 0) {
			return [];
		}

		if (data.minLength && data.maxLength) {
			const sortedByLength = podcasts
				.filter(item => {
					const podcastLength = utils.calculateTheDistance(
						item.location.latitude,
						item.location.longitude,
						data.latitude,
						data.longitude,
					);
					return (
						data.minLength <= podcastLength &&
						podcastLength <= data.maxLength
					);
				})
				.sort((a, b) => {
					return (
						utils.calculateTheDistance(
							b.location.latitude,
							b.location.longitude,
							data.latitude,
							data.longitude,
						) -
						utils.calculateTheDistance(
							a.location.latitude,
							a.location.longitude,
							data.latitude,
							data.longitude,
						)
					);
				});
			if (data.sortBy === 1) {
				const sortedByPopularity = sortedByLength.sort(function (a, b) {
					return b.listens - a.listens;
				});

				return sortedByPopularity.splice(startFrom, size);
			}
		}

		return podcasts.reverse().splice(startFrom, size);
	},

	async getMyPodcasts(
		userId: ID,
		page: number,
		size: number,
	): Promise<{podcasts: IPodcast[], totalCount: number}> {
		const offset = page * size - size;
		const podcastsFromDB = await db.PodcastModel.find({ creator: userId })
			.populate({
				path: 'creator',
				select: 'name userName',
			})
			.populate('categories');
		
		const totalCount = podcastsFromDB.length;
		const podcasts = podcastsFromDB.splice(offset, size)
		return {podcasts, totalCount};
	},

	async ownAverageRating(userId: ID): Promise<number> {
		const podcasts = await db.PodcastModel.find({ creator: userId });

		let countPodcasts = podcasts.length;
		let sumAverageRating = 0;

		for (const item of podcasts) {
			sumAverageRating += item.averageRating;
		}

		return Math.round(sumAverageRating / countPodcasts);
	},

	async getPodcast(podcastId: ID, userId: ID): Promise<IPodcast> {
		const podcast = await db.PodcastModel.findById(podcastId)
			.select('-__v')
			.populate({
				path: 'creator',
				select: 'name userName',
			})
			.populate('categories');
		/* @ts-ignore */
		if (podcast.creator?._id.toString() !== userId.toString()) {
			podcast.listens += 1;
		}
		/* @ts-ignore */
		await podcast.save();
		return podcast;
	},

	async setReviewPodcast(
		userId: ID,
		rating: number,
		message: string,
		podcastId: any,
	): Promise<IReview> {
		const candidateReview = await db.ReviewModel.findOne({
			user: userId,
			podcast: podcastId,
		}).select('-__v');
		let totalRating = 0;
		const podcast = await db.PodcastModel.findById(podcastId, { reviews_enable: 1}).lean();
		if (!podcast.reviews_enable) throw ApiError.Forbidden('Comments are turned off');

		if (candidateReview) {
			candidateReview.rating = rating;
			if (message !== undefined) candidateReview.message = message;
			await candidateReview.save();

			//Count averageRating of podcast
			const reviews = await db.ReviewModel.aggregate([
				{ $match: { podcast: podcastId } },
				{
					$group: {
						_id: '$_id',
						rating: { $sum: '$rating' },
					},
				},
			]);

			let countReviews = reviews.length;
			for (const item of reviews) {
				totalRating += item.rating;
			}
			await db.PodcastModel.findByIdAndUpdate(podcastId, {
				averageRating: Math.round(totalRating / countReviews),
			});
			return candidateReview.populate({
				path: 'user',
				select: 'name photo',
			});
		}

		const review = await db.ReviewModel.create({
			user: userId,
			rating,
			message,
			podcast: podcastId,
		});
		const user = await db.UserModel.findById(userId);
		user.points += 1;
		await user.save();

		//Count averageRating of podcast
		const reviews = await db.ReviewModel.aggregate([
			{ $match: { podcast: podcastId } },
			{
				$group: {
					_id: '$_id',
					rating: { $sum: '$rating' },
				},
			},
		]);

		let countReviews = reviews.length;
		for (const item of reviews) {
			totalRating += item.rating;
		}
		await db.PodcastModel.findByIdAndUpdate(podcastId, {
			averageRating: Math.round(totalRating / countReviews),
			$push: { reviews: review._id },
		});
		return review.populate({
			path: 'user',
			select: 'name photo',
		});
	},

	async getReviews(
		userId: ID,
		podcastId: ID,
		page: number,
		size: number,
	): Promise<IReview[]> {
		const offset: number = page * size - size;
		const user = await db.UserModel.findById(userId);
		const reviews = await db.ReviewModel.find({
			podcast: podcastId,
			_id: { $nin: user.unwantedReviews },
		})
			.populate({
				path: 'user',
				select: 'name photo',
			})
			.select('-__v')
			.sort({ rating: -1, createdAt: -1 })
			.skip(offset)
			.limit(size);

		return reviews;
	},

	async deleteReview(userId: ID, reviewId: ID): Promise<IReview> {
		const review = await db.ReviewModel.findOne({
			_id: reviewId,
			user: userId,
		}).select('-__v');
		if (!review) {
			throw ApiError.BadRequest('Review by id not found');
		}

		const deletedReview = await review.remove();

		const podcast = await db.PodcastModel.findById(review.podcast);
		const reviewIndex = podcast.reviews.indexOf(review._id);
		podcast.reviews.splice(reviewIndex, 1);
		await podcast.save();

		return deletedReview;
	},

	async getSearchList(userId: ID): Promise<String[]> {
		const user = await db.UserModel.findById(userId);

		if (!user) {
			throw ApiError.BadRequest('User by id not found.');
		}

		return user.searchList;
	},
};
