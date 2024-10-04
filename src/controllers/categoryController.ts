import { Request, Response, NextFunction } from 'express';

import categoryService from '../services/categoryService';

import { ID } from '../types/mongo';

export default {
	async createCategory(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { name } = req.body;
			const category = await categoryService.createCategory(name);
			res.json({ category });
		} catch (err) {
			next(err);
		}
	},

	async deleteCategory(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const id = req.query.id as unknown as ID;
			await categoryService.deleteCategory(id);
			res.json({ deleted: true });
		} catch (err) {
			next(err);
		}
	},

	async editCategory(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const { name } = req.body;
			const id = req.query.id as unknown as ID;
			const category = await categoryService.editCategory(id, name);
			res.json({ category });
		} catch (err) {
			next(err);
		}
	},

	async getCategories(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		try {
			const categories = await categoryService.getCategories();
			res.json({ categories });
		} catch (err) {
			next(err);
		}
	},
};
