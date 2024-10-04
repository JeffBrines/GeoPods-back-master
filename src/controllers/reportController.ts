/*--------------------libraries--------------------*/
import { Response, NextFunction } from 'express';
/*--------------------libraries--------------------*/

/*--------------------services--------------------*/
import reportService from '../services/reportService';
/*--------------------services--------------------*/

/*--------------------interfaces--------------------*/
import { IDefaultRequest, IDefaultAdminRequest } from './interfaces';
/*--------------------interfaces--------------------*/

/*--------------------constants--------------------*/
import constants from '../constants/index';
/*--------------------constants--------------------*/

/*--------------------types--------------------*/
import {ID} from '../types/mongo';
/*--------------------types--------------------*/


export default {
    async sendUserReport(
        req: IDefaultRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { user } = req;
            const { message, suspectUser } = req.body;

            const success = await reportService.sendUserReport(
                user._id,
                message,
                suspectUser
            );
            res.json({ success, message, suspectUser });
        } catch (err) {
            next(err);
        }
    },
    
    async sendPodcastReport(
        req: IDefaultRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void>{
        try{
            const { user } = req;
            const { message, suspectPodcast } = req.body;

            const success = await reportService.sendPodcastReport(
                user._id,
                message,
                suspectPodcast
            );
            res.json({ success, message, suspectPodcast });
        }catch(err) {
            next(err);
        }
    },
    
    async sendReviewReport(
        req: IDefaultRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { user } = req;
            const { message, suspectReview } = req.body;

            const success = await reportService.sendReviewReport(
                user._id, message, suspectReview
            );
            res.json({ success, message, suspectReview });
        } catch (err) {
            next(err);
        }
    },

    async getUserReports(
        req: IDefaultAdminRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = req.query.id as unknown as ID;
            const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

            const reports = await reportService.getUserReports(id, page, size);
            res.json({ reports, page, size });
        } catch (err) {
            next(err);
        }
    },

    async getPodcastReports(
        req: IDefaultAdminRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const id = req.query.id as unknown as ID;
            const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

            const reports = await reportService.getPodcastReports(id, page, size);
            res.json({ reports, page, size });
        } catch(err) {
            next(err);
        }
    },

    async getReviewReports(
        req: IDefaultAdminRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const id = req.query.id as unknown as ID;
            const page = Number(req.query.page) || constants.defaultPagination.PAGE;
			const size = Number(req.query.size) || constants.defaultPagination.SIZE;

            const reports = await reportService.getReviewReports(id, page, size);
            res.json({ reports, page, size });
        } catch (err) {
            next(err);
        }
    },

    async deleteUserReport(
        req: IDefaultAdminRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const reportId = req.query.id as unknown as string;
            
            const successDelete = await reportService.deleteUserReport(reportId);
            res.json({ successDelete });
        } catch (err) {
            next(err);
        }
    },

    async deletePodcastReport(
        req: IDefaultAdminRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const reportId = req.query.id as unknown as string;

            const successDelete = await reportService.deletePodcastReport(reportId);
            res.json({ successDelete });
        } catch (err) {
            next(err);
        }
    },

    async deleteReviewReport(
        req: IDefaultAdminRequest,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const reportId = req.query.id as unknown as string;

            const successDelete = await reportService.deleteReviewReport(reportId);
            res.json({ successDelete });
        } catch (err) {
            next(err);
        }
    }


}

