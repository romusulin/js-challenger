import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import { Logger } from '../logger';

export const AUTHORIZATION_SCHEMA = 'JWT';

const PUBLIC_KEY = fs.readFileSync('./public.pem', 'utf8');
const PRIVATE_KEY = fs.readFileSync('./private.pem', 'utf8');

// Duration interpreted as seconds
const TOKEN_DURATION = 60 * 30;

const signOptions: jwt.SignOptions = {
	issuer: 'js challenger',
	expiresIn:  TOKEN_DURATION,
	algorithm:  'RS256'
};

const verificationOptions: jwt.VerifyOptions = {
	issuer: 'js challenger',
	algorithms:  [ 'RS256' ],
};

export function createToken(payload: Token) {
	const token = jwt.sign(payload, PRIVATE_KEY, signOptions);

	return token;
}

export function verifyToken(token: string): VerificationResult {
	const logger = new Logger();

	let result: VerificationResult = {
		success: true
	};

	try {
		result.token = jwt.verify(token, PUBLIC_KEY, verificationOptions) as Token;
		logger.info(`Token verification successful for user: "${result.token.username}"`);
	} catch (error) {
		result.error = error.message;
		result.success = false;
		logger.error(`Token verification failed: ${error}`);
	}

	return result;
}

export interface VerificationResult {
	success: boolean;
	error?: string,
	token?: Token;
}

export interface Token {
	username: string;
}
