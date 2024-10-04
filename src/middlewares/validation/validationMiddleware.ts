import { NextFunction, Request, Response } from 'express';
import { BaseSchema } from 'yup';
import constants from '../../constants';

export default (schema: BaseSchema) =>
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const { body } = req;
		try {
			await schema.validate(body);
			next();
		} catch (err) {
			res.status(constants.statusCode.BAD_REQUEST).json({
				success: false,
				message: err.message,
			});
		}
	};
