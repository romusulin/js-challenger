import {Leaderboard, User} from '../db/models';
import { verifyUserPassword } from '../security/password-utils';
import { createToken } from '../security/auth-utils';

export async function createUser(user: {username: string, password: string}) {
	return User.create(user);
}

export async function login(dbUser: User, loginInformation: {username: string, password: string}) {
	const isPasswordVerified = await verifyUserPassword(loginInformation.password, dbUser.password);
	if (!isPasswordVerified) {
		throw new Error('Username or password not correct');
	}

	return createToken({ username: dbUser.username, isAdmin: !!dbUser.isAdmin });
}

export async function getUserDetails(username: string) {
	return Leaderboard.findOne({
		where: { username }
	});
}
