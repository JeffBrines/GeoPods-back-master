import * as yup from 'yup';

export default yup.object({
	latitude: yup.number().required(),
	longitude: yup.number().required(),
	minLength: yup.number().required(),
	maxLength: yup.number().required(),
	fullLength: yup.boolean(),
	minRecordTime: yup.number(),
	maxRecordTime: yup.number(),
	averageRating: yup.number(),
	categories: yup.array(),
	sortBy: yup.number().oneOf([1, 2]),
});
