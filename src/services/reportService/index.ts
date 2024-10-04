/*--------------------interfaces--------------------*/
import { IPodcastReport, IUserReport, IReviewReport } from "../../db/models/intefraces";
/*--------------------interfaces--------------------*/

/*--------------------types--------------------*/
import { ID } from '../../types/mongo';
/*--------------------types--------------------*/

/*--------------------database--------------------*/
import db from '../../db';
/*--------------------database--------------------*/

/*--------------------error--------------------*/
import ApiError from '../../errors/ApiError';
/*--------------------error--------------------*/

export default {
    async sendUserReport(
        userId: ID,
        message: string,
        suspectUser: ID,
    ): Promise<boolean> {
        const userCandidate = await db.UserReportModel.findOne({
            from: userId, 
            suspectUser 
        }).exec();

        if (userCandidate) {
            throw ApiError.BadRequest('This user already reported the intruder');
        }

        await db.UserReportModel.create({from: userId, message, suspectUser});
        return true;
    },

    async sendPodcastReport(
        userId: ID,
        message: string,
        suspectPodcast: ID,
    ): Promise<boolean> {
        const podcastCandidate = await db.PodcastReportModel.findOne({
            from: userId,
            suspectPodcast
        }).exec();
        
        if (podcastCandidate) {
            throw ApiError.BadRequest('This user already reported the podcast');
        }

        await db.PodcastReportModel.create({from: userId, message, suspectPodcast});
        return true;
    },

    async sendReviewReport(
        userId: ID,
        message: string,
        reviewId: ID,
    ): Promise<boolean> {
        const reviewReport = await db.ReviewReportModel.findOne({
            from: userId, 
            suspectReview: reviewId 
        });
        if (reviewReport) {
            throw ApiError.BadRequest('User already reported this review');
        }

        await db.ReviewReportModel.create({
            from: userId, 
            message, 
            suspectReview: reviewId
        });

        const user = await db.UserModel.findById(userId);
        user.unwantedReviews.push(reviewId); 
        await user.save();

        return true;
    },

    async getUserReports(
        id: ID,
        page: number,
        size: number,
    ): Promise<IUserReport[]> {
        const offset: number = page * size - size;
        const option = {};

        if (id) {
            Object.assign(option, { suspectUser: id});
        }

        const reports = db.UserReportModel.find(option)
            .select('-__v')
            .populate({
                path: 'from',
                select: 'name email'
            })
            .populate({
                path: 'suspectUser',
                select: 'name email photo createdAt'
            })
            .skip(offset)
            .limit(size);
        
        
        return reports;
    },

    async getPodcastReports(
        id: ID,
        page: number,
        size: number,
    ): Promise<IPodcastReport[]> {
        const offset: number = page * size - size;
        const option = {};

        if (id) {
            Object.assign(option, { suspectPodcast: id});
        }

        const reports = db.PodcastReportModel.find(option)
            .select('-__v')
            .populate({
                path: 'from',
                select: 'name email'
            })
            .populate({
                path: 'suspectPodcast',
                select: '-__v -timeStamps',
                populate: {
                    path: 'creator',
                    select: 'name, email'
                },
            })
            .skip(offset)
            .limit(size);
        
        return reports;
    },

    async getReviewReports(
        id: ID,
        page: number,
        size: number,
    ): Promise<IReviewReport[]> {
        const offset: number = page * size - size;
        const option = {};

        if (id) {
            Object.assign(option, { suspectReview: id});
        }

        const reports = db.ReviewReportModel.find(option)
            .select('-__v')
            .populate({
                path: 'from',
                select: 'name email'
            })
            .populate({
                path: 'suspectReview',
                select: 'user message podcast',
                populate: [{
                    path: 'user',
                    select: 'name email'
                },
                {
                    path: 'podcast',
                    select: 'name author'
                }]
            })
            .skip(offset)
            .limit(size);
        
        
        return reports;
    },

    async deleteUserReport(
        reportId: string,
    ): Promise<boolean> {
        const report = await db.UserReportModel.findById(reportId);

        if (!report) {
            throw ApiError.BadRequest('This report doesn\'t exist');
        }

        await report.remove();
        return true;
    },

    async deletePodcastReport(
        reportId: string,
    ): Promise<boolean> {
        const report = await db.PodcastReportModel.findById(reportId);

        if (!report) {
            throw ApiError.BadRequest('This report doesn\'t exist');
        }
        
        await report.remove();
        return true;
    },

    async deleteReviewReport(
        reportId: string,
    ): Promise<boolean> {
        const report = await db.ReviewReportModel.findById(reportId);

        if (!report) {
            throw ApiError.BadRequest('This report doesn\'t exist');
        }
        
        await report.remove();
        return true;
    },

}