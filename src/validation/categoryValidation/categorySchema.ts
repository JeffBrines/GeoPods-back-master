import * as yup from 'yup';

export default yup.object({
	name: yup.string().min(2).required(),
});
