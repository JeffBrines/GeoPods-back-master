/*--------------------database--------------------*/
import db from '../../db';
/*--------------------database--------------------*/

/*--------------------error--------------------*/
import ApiError from '../../errors/ApiError';
/*--------------------error--------------------*/

/*--------------------types--------------------*/
import { ID } from '../../types/mongo';
/*--------------------types--------------------*/

/*--------------------helpers--------------------*/
import generateVerifyCode from '../../generators/verifyCode';
/*--------------------helpers--------------------*/

/*--------------------utils--------------------*/
import { checkFiveMinutes } from './utils';
/*--------------------utils--------------------*/

export default {
	async generateCode(id: ID): Promise<string> {
		let VerifyUser = await db.VerifyModel.findOne({ user: id });
		if (!VerifyUser) {
			VerifyUser = await db.VerifyModel.create({ user: id });
		}
		if (
			VerifyUser.blockedVerify &&
			!checkFiveMinutes(VerifyUser.blockedTime)
		) {
			throw ApiError.Forbidden('Verification is blocked for 5 minutes');
		} else if (
			checkFiveMinutes(VerifyUser.blockedTime) &&
			VerifyUser.blockedVerify
		) {
			VerifyUser.blockedVerify = false;
		}
		const code = generateVerifyCode();
		VerifyUser.code = code;
		await VerifyUser.save();
		return code;
	},

	async VerifyCode(id: ID, code: string): Promise<boolean> {
		const VerifyUser = await db.VerifyModel.findOne({ user: id });
		if (!VerifyUser) {
			throw ApiError.NotFound('Not found user verify model in db');
		}
		if (VerifyUser.code === code && !VerifyUser.blockedVerify) {
			VerifyUser.code = generateVerifyCode();
			if (!VerifyUser.verifyEmail) {
				VerifyUser.verifyEmail = true;
			}
			await VerifyUser.save();
			return true;
		} else {
			if (VerifyUser.counterVerify >= 5) {
				VerifyUser.code = generateVerifyCode();
				VerifyUser.counterVerify = 0;
				VerifyUser.blockedVerify = true;
				VerifyUser.blockedTime = new Date();
				await VerifyUser.save();
				return false;
			} else if (!VerifyUser.blockedVerify) {
				VerifyUser.counterVerify += 1;
			}
			await VerifyUser.save();
			return false;
		}
	},
};
