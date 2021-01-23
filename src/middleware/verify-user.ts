import { NextFunction, Request, Response } from 'express';
import { HTTP_CODES } from '../app';
import { UserDbHelper } from '../db/helpers/user-db-helper';
import { ResponseWithLocals } from './custom-response';

export async function verifyRegistration(req: Request, res: Response, next: NextFunction) {
	const registeringUser: { username: string, password: string} = req.body;

	if (!registeringUser || !registeringUser.username || !registeringUser.password) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Registration body must contain username and password fields.');
	} else if (await UserDbHelper.existsByUsername(registeringUser.username)) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Username is already taken');
	}

	next();
}

export async function verifyLogin(req: Request, res: ResponseWithLocals, next: NextFunction) {
	const loginInformation: { username: string, password: string } = req.body;
	if (!loginInformation.username || !loginInformation.password) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Login body must contain username and password fields.');
	}

	const foundUser = await UserDbHelper.findByUsername(loginInformation.username);
	if (foundUser) {
		res.locals.user = foundUser;
		res.locals.loginInformation = loginInformation;
	} else {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Username or password not correct.');
	}

	next();
}
