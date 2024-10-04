import db from '../../db';
import { ID } from '../../types/mongo';

export default async (userId: ID, text: string): Promise<void> => {
	const user = await db.UserModel.findById(userId);

	if (user.searchList.includes(text)) {
		return;
	}

	if (user.searchList.length === 3) {
		user.searchList.pop();
	}

	user.searchList.unshift(text);
	await user.save();
};
