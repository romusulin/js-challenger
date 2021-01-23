import { User } from '../db/models/user';
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
