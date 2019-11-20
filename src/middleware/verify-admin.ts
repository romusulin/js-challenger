import { NextFunction, Request, Response } from 'express';
import { HTTP_CODES } from '../app';

export function verifyAdminPrivilege(req: Request, res: Response, next: NextFunction) {
	const token = res.locals.token;
	if (!token.isAdmin) {
		res.status(HTTP_CODES.HTTP_UNAUTHORIZED);
		res.json('Insufficient permissions.');
		return;
	}

	next();
}
