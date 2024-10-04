import * as yup from 'yup';

export default yup.object({
	categories: yup.array().of(yup.string()).required(),
	minRadius: yup.number().min(0).max(149).required(),
	maxRadius: yup.number().min(1).max(150).required(),
	notifcation: yup.boolean(),
	public: yup.boolean(),
	rating: yup.number().oneOf([1, 2, 3, 4, 5])
});
