import { NextFunction, Request, Response } from 'express';
import { HTTP_CODES } from '../app';
import { Challenge } from '../db/models/challenge';
import { ResponseWithLocals } from './custom-response';

export async function verifyChallengeSubmission(req: Request, res: ResponseWithLocals, next: NextFunction) {
	const challengeId: string = req.params.challengeid;
	if (!challengeId) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Missing challenge id.');
	}

	if(!req.body.code) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Solution must be stringifed into the "code" property of the request body.');
	}

	const challenge = await Challenge.findOne({
		where: { id: challengeId}
	});
	if (!challenge) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json('Challenge does not exist.');
	} else {
		res.locals.challenge = challenge;
	}

	next();
}
