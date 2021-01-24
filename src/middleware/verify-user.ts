import { NextFunction, Request, Response } from 'express';
import { HTTP_CODES } from '../app';
import { ResponseWithLocals } from './custom-response';
import { User } from '../db/models';

export async function verifyRegistration(req: Request, res: Response, next: NextFunction) {
	const { username, password} = req.body;
	if (!req.body || !username || !password) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Registration body must contain username and password fields.');
	}
	const doesUserExist = Boolean(await User.findOne({ where: { username }}));
	if (doesUserExist) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Username is already taken');
	}

	next();
}

export async function verifyLogin(req: Request, res: ResponseWithLocals, next: NextFunction) {
	const loginInformation: { username: string, password: string } = req.body;
	if (!loginInformation.username || !loginInformation.password) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Login body must contain username and password fields.');
	}

	const foundUser = await User.findOne({ where: { username: loginInformation.username }});
	if (foundUser) {
		res.locals.user = foundUser;
		res.locals.loginInformation = loginInformation;
	} else {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Username or password not correct.');
	}

	next();
}
