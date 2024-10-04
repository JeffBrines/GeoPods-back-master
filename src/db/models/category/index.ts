import { Schema, model } from 'mongoose';
import { ICategory } from '../intefraces';

const CategoryModel: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

export default model<ICategory>('category', CategoryModel);
