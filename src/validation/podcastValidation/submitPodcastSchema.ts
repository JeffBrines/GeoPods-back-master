import * as yup from 'yup';

export default yup.object({
	name: yup.string().required(),
	author: yup.string(),
	isAuthor: yup.boolean().default(false),
	explicit: yup.boolean().default(true),
	location: yup
		.object({
			latitude: yup.number().required('Location is required'),
			longitude: yup.number().required('Location is required'),
		})
		.required(),
	url: yup.string().required(),
	description: yup.string().default(''),
	priority: yup.number().oneOf([1, 2, 3]).default(1),
	categories: yup.array().of(yup.string()).required(),
	timeStamps: yup
		.array()
		.of(
			yup.object({
				time: yup.string(),
				name: yup.string(),
			}),
		)
		.default([]),
});
