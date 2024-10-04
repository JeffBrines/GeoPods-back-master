/*--------------------database--------------------*/
import db from '../../db';
/*--------------------database--------------------*/

/*--------------------types--------------------*/
import { ID } from '../../types/mongo';
/*--------------------types--------------------*/

/*--------------------interfaces--------------------*/
import { IAdminToken, IAppToken } from '../../db/models/intefraces';

/*--------------------interfaces--------------------*/

/*--------------------generators--------------------*/
import appTokenGenerator from '../../generators/appToken';
/*--------------------generators--------------------*/

export default {
	async appSave(user: ID): Promise<string> {
		const tokenData = await db.AppTokenModel.findOne({ user });
		const appToken = appTokenGenerator(user);
		if (tokenData) {
			tokenData.appToken = appToken;
			await tokenData.save();
			return appToken;
		}
		await db.AppTokenModel.create({
			user,
			appToken,
		});
		return appToken;
	},

	async adminSave(admin: ID, refreshToken: string): Promise<IAdminToken> {
		const tokenData = await db.AdminTokenModel.findOne({ admin });
		if (tokenData) {
			tokenData.refreshToken = refreshToken;
			return await tokenData.save();
		}
		return await db.AdminTokenModel.create({
			admin,
			refreshToken,
		});
	},
};
