import { Request, Response, NextFunction } from 'express';
import constants from '../constants';
import config from '../config';
export default (err: any, req: Request, res: Response, next: NextFunction) => {
	if (config.mode === 'PROD') {
		if (
			err.statusCode === constants.statusCode.SERVER_ERROR ||
			!err.statusCode
		) {
			console.log(`Time error:  ${new Date()}\n\nError:\n${err.message}`);
		}
		res.status(err.statusCode || constants.statusCode.SERVER_ERROR).json({
			success: false,
			message: err.message || err || 'Something was happened :_(',
		});
	} else {
		console.log(
			`Time error:  ${new Date()}\nError --->\t${err.message || err}`,
		);
		res.status(err.statusCode || constants.statusCode.SERVER_ERROR).json({
			success: false,
			message: err.message || err,
		});
	}
};
