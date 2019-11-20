import { User } from '../src/db/models/user';
import { Challenge } from '../src/db/models/challenge';

export async function cleanDatabase() {
	return await Promise.all([
		User.truncate({ cascade: true }),
		Challenge.truncate({ cascade: true })
	]);
}
