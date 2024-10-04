import * as yup from 'yup';

export default yup.object({
	latitude: yup.number(),
	longitude: yup.number(),
	minLength: yup.number(),
	maxLength: yup.number(),
	fullLength: yup.boolean(),
	minRecordTime: yup.number(),
	maxRecordTime: yup.number(),
	averageRating: yup.number(),
	categories: yup.array(),
	sortBy: yup.number().oneOf([1, 2]),
});
