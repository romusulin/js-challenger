import { NextFunction, Response, Request } from 'express';
import { HTTP_CODES } from '../app';
import { AUTHORIZATION_SCHEMA } from '../security/auth-utils';
import { verifyToken } from '../security/auth-utils';

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
	res.status(HTTP_CODES.HTTP_BAD_REQUEST);

	const authorizationHeader = req.header('Authorization');
	if (!authorizationHeader) {
		res.json('Verification requires the authorization header to be set');
		return;
	}

	const [ schema, encodedToken ] = authorizationHeader.split(' ');
	if (schema !== AUTHORIZATION_SCHEMA) {
		res.json('Incorrect authorization schema');
		return;
	}

	const verificationResult = verifyToken(encodedToken);
	if (!verificationResult.success) {
		res.json(`Token verification failed: ${verificationResult.error}`);
		return;
	}

	res.status(HTTP_CODES.HTTP_OK);
	res.locals.token = verificationResult.token;
	next();
}
