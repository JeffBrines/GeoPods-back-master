import * as yup from 'yup';

export default yup.object({
	tokenId: yup.string().required(),
});
