import { NextFunction, Request, Response } from 'express';
import { HTTP_CODES } from '../app';
import { AUTHORIZATION_SCHEMA } from '../security/auth-utils';
import { verifyToken } from '../security/auth-utils';
import { ResponseWithLocals } from './custom-response';

export function verifyAuthorizationTokenMiddleware(req: Request, res: ResponseWithLocals, next: NextFunction) {
	const authorizationHeader = req.header('Authorization');
	if (!authorizationHeader) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Verification requires the authorization header to be set');
	}

	const [ schema, encodedToken ] = authorizationHeader.split(' ');
	if (schema !== AUTHORIZATION_SCHEMA) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Incorrect authorization schema');
	}

	const verificationResult = verifyToken(encodedToken);
	if (!verificationResult.success) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json(`Token verification failed: ${verificationResult.error}`);
	}

	res.locals.token = verificationResult.token;
	next();
}
