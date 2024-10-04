import { NextFunction, Response, Request } from 'express';
import ApiError from '../../errors/ApiError';
import { ITimeStamp } from '../../services/podcastService/interfaces';

export default async (
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const timeStamps = req.body.timeStamps as unknown as ITimeStamp[];
		if (!timeStamps) {
			return next();
		}
		if (timeStamps?.length === 0) {
			return next();
		}
		for (let i = 0; i < timeStamps.length; i++) {
			if (!timeStamps[i].name || !timeStamps[i].time) {
				throw ApiError.BadRequest(
					'In time stamps, name and time are required fields',
				);
			}
		}
		next();
	} catch (err) {
		next(err);
	}
};
