import * as yup from 'yup';

export default yup.object({
	login: yup.string().min(5).required(),
	password: yup.string().min(5).required(),
});
