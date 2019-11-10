import { User } from '../models/user';

export namespace UserDbHelper {
	export async function findByUsername(username: string): Promise<User> {
		const user = await User.findOne({
			where: { username }
		});

		return user;
	}

	export async function existsByUsername(username: string): Promise<boolean> {
		const potentialUser: User = await findByUsername(username);

		return !!potentialUser;
	}
}
