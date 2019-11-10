import { User } from '../src/db/models/user';

export async function cleanDatabase() {
	return User.truncate({ cascade: true });
}
