import { NextFunction, Request, Response } from 'express';
import ApiError from '../../errors/ApiError';
import db from '../../db';
import { ID } from '../../types/mongo';

export default (required: boolean = true) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const id = req.query.id as unknown as ID;
			if (!id && required === true) {
				if (!req.query.id) {
					throw ApiError.BadRequest('id not input in query');
				}
			} else if (!id && required === false) {
				next();
			}
			const podcast = await db.PodcastModel.findById(id).catch(err =>
				console.log('podcast by id not found'),
			);
			if (!podcast) {
				throw ApiError.NotFound('Podcast not found by id');
			}
			next();
		} catch (err) {
			next(err);
		}
	};
