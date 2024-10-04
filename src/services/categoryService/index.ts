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
import { ICategory } from '../../db/models/intefraces';
/*--------------------interfaces--------------------*/



export default {
	async createCategory(name: string): Promise<ICategory> {
		return await db.CategoryModel.create({ name });
	},

	async deleteCategory(id: ID): Promise<void> {
		const category = await db.CategoryModel.findById(id);
		const podcasts = await db.PodcastModel.find({
			categories: category._id,
		});
		for (let i = 0; i < podcasts.length; i++) {
			if (podcasts[i].categories.length === 1) {
				throw ApiError.Forbidden(
					'Access denied! Posts with only this one category have already been created, deleting can damage the stability of the application',
				);
			}
		}
		for (let j = 0; j < podcasts.length; j++) {
			podcasts[j].categories.splice(
				podcasts[j].categories.indexOf(category._id),
				1,
			);
			await podcasts[j].save();
		}
	},

	async editCategory(id: ID, name: string): Promise<ICategory> {
		return await db.CategoryModel.findByIdAndUpdate(id, { name });
	},

	async getCategories(): Promise<ICategory[]> {
		return await db.CategoryModel.find();
	},
};
