import { getModel, TABLE } from '../src/db/db';

export async function cleanDatabase() {
	const userModel = getModel(TABLE.USER);
	return userModel.truncate({ cascade: true });
}
