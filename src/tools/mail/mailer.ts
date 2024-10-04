import * as nodemailer from 'nodemailer';
import ApiError from '../../errors/ApiError';
import config from '../../config';
export default async (message: any) => {
	const {
		service,
		secure,
		auth: { user, pass },
	} = config.nodemailer;
	const transporter = nodemailer.createTransport(
		{
			service,
			secure,
			auth: {
				user,
				pass,
			},
		},
		{
			from: `Geo-Pod <${config.nodemailer.auth.user}>`,
		},
	);
	try {
		await transporter.sendMail(message);
	} catch (err) {
		console.log(err)
		throw ApiError.NotFound('Invalid email')
	}
};
