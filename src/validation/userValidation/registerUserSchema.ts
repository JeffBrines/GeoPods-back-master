import * as yup from 'yup';

export default yup.object({
	name: yup.string().required(),
	userName: yup.string().required(),
	dateBorn: yup.date().required(),
	country: yup.string().required(),
	state: yup.string().required(),
	city: yup.string().required(),
	email: yup.string().email().min(5).required(),
	password: yup.string().min(5).required(),
	description: yup.string(),
	webUrl: yup.string(),
	instagram: yup.string(),
	twitter: yup.string(),
	tiktok: yup.string(),
});
