//rating
import * as yup from 'yup';

export default yup.object({
	rating: yup.number().oneOf([1, 2, 3, 4, 5]).required(),
	message: yup.string(),
});
