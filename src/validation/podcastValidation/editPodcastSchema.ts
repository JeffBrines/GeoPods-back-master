import * as yup from 'yup';

export default yup.object({
	name: yup.string(),
	explicit: yup.boolean(),
	location: yup.object({
		latitude: yup.number(),
		longitude: yup.number(),
	}),
	photo: yup.string().url(),
	url: yup.string(),
	description: yup.string(),
	priority: yup.number().oneOf([1, 2, 3]),
	categories: yup.array().of(yup.string()),
	timeStamps: yup.array().of(
		yup.object({
			time: yup.string(),
			name: yup.string(),
		}),
	),
});
