import * as yup from 'yup';

export default yup.object({
	name: yup.string().required(),
	explicit: yup.boolean().default(true),
	location: yup
		.object({
			latitude: yup.number().required('Location is required'),
			longitude: yup.number().required('Location is required'),
		})
		.required(),
	photo: yup.string().url().required(),
	url: yup.string().url().required(),
	description: yup.string().default(''),
	priority: yup.number().oneOf([1, 2, 3]).default(1),
	categories: yup.array().of(yup.string()).required(),
	recordTime: yup.number().required(),
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
