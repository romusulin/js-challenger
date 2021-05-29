import { ResetPasswordToken, User } from '../db/models';
import { Op } from 'sequelize';
import { NextFunction, Request } from 'express';
import { ResponseWithLocals } from './custom-response';
import { HTTP_CODES } from '../app';

export async function getActiveResetPasswordRequest(userId: string, token: string): Promise<ResetPasswordToken> {
	const hourAgo = new Date(Date.now() - (60 * 60 * 1000));

	const recentActiveResetPasswordRequests = await ResetPasswordToken.findOne({
		where: {
			[Op.and]: [
				{ isConsumed: false },
				{ 'createdAt': { [Op.gt]: hourAgo } },
				{ userId },
				{ token }
			]
		}
	});

	return recentActiveResetPasswordRequests;
}

export async function verifyChangePassword(req: Request, res: ResponseWithLocals, next: NextFunction) {
	const { email, token, newPassword } = req.body;
	if (!newPassword || newPassword.length < 8) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('New password must be provided to change the password. It must be at least 8 characters long.');
	}

	if (!email) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Email must be provided to change the password.');
	}

	if (!token) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Password reset token must be provided to change the password.');
	}

	next();
}
