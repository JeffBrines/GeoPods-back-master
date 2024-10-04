import * as yup from 'yup';

export default yup.object({
	name: yup.string(),
	userName: yup.string(),
	dateBorn: yup.date(),
	country: yup.string(),
	state: yup.string(),
	city: yup.string(),
	email: yup.string().email().min(5),
	description: yup.string(),
	webUrl: yup.string(),
	instagram: yup.string(),
	twitter: yup.string(),
	tiktok: yup.string(),
});
