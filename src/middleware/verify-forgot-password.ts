import { NextFunction, Request } from 'express';
import { HTTP_CODES } from '../app';
import { ResponseWithLocals } from './custom-response';

export async function verifyResetPassword(req: Request, res: ResponseWithLocals, next: NextFunction) {
	const email = req.body.email;
	if (!email) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Email must be provided to reset the password.');
	}

	next();
}
