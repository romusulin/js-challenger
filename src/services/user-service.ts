import {Leaderboard, ResetPasswordToken, User} from '../db/models';
import { hashUserPassword, verifyUserPassword } from '../security/password-utils';
import { createToken } from '../security/auth-utils';
import { generateToken } from '../security/token-utils';
import { sendEmail } from './email-service';
import { db } from '../db/db';
import { Op } from 'sequelize';
import Settings from '../settings';

export async function createUser(user: Pick<User, 'username' | 'password'>) {
	return User.create(user);
}

export async function login(dbUser: User, loginInformation: Pick<User, 'username' | 'password'>) {
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

export async function createResetPasswordToken(userId: User['id']) {
	const token = generateToken();

	await ResetPasswordToken.create({
		userId: userId,
		isConsumed: false,
		token
	});

	return token;
}

export async function resetPassword(email: string) {
	const user = await User.findOne({
		where: { email }
	});

	const recentActiveRequests = await ResetPasswordToken.findOne({
		where: {
			[Op.and]: [
				{ isConsumed: false },
				{ createdAt: { [Op.gt]: getSessionExpiryDate() } },
				{ userId: user.id }
			]
		}
	});
	if (!!recentActiveRequests) {
		throw new Error('Password reset request has already been made. Please wait before trying again.')
	}

	const generatedToken = await createResetPasswordToken(user.id);
	const subject = 'Reset Password Request';
	const text = `Account password can be reset with the following token: "${generatedToken}"`;
	await sendEmail(user.email, subject, text);
}

export async function changePassword(email: string, token: string, newPassword: string) {
	const user = await User.findOne({
		where: { email }
	});

	const mostRecentActiveRequest = await ResetPasswordToken.findOne({
		where: {
			[Op.and]: [
				{ isConsumed: false },
				{ createdAt: { [Op.gt]: getSessionExpiryDate() } },
				{ token },
				{ userId: user.id }
			]
		}
	});

	if (!mostRecentActiveRequest) {
		throw new Error('There are no recent reset password requests');
	}

	const transaction = await db.transaction();

	try {
		await User.update({
				password: await hashUserPassword(newPassword)
			},
			{
			where: { id: user.id },
			transaction
		});

		await ResetPasswordToken.update({
			isConsumed: true
		},
			{
			where: { id: mostRecentActiveRequest.id },
			transaction
		});
	} catch (e) {
		await transaction.rollback();
		throw e;
	}

	await transaction.commit();
}

export function getSessionExpiryDate() {
	return new Date(Date.now() - Settings.RESET_PASSWORD_EXPIRY_MS);
}

