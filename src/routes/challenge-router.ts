import * as express from 'express';
import { verifyTokenMiddleware } from '../middleware/verify-token';
import { Request } from 'express';
import { Response } from 'express';
import { Challenge } from '../db/models/challenge';
import { HTTP_CODES } from '../app';
import { TestCase } from '../challenges/test-case';
import { executeChallenge } from '../challenges/challenge-executor';

export const challengeRouter: express.Router = express.Router();

challengeRouter.use(verifyTokenMiddleware);

interface ChallengeSubmission {
	code: string;
}

challengeRouter.post('/submit/:challengeid?', async (req: Request, res: Response) => {
	const challengeId: string = req.params.challengeid;
	if (!challengeId) {
		res.status(HTTP_CODES.HTTP_BAD_REQUEST);
		res.json('Missing challenge id');
		return;
	}

	const userCode: string = req.body.code;
	if (!userCode || !userCode.length) {
		res.status(HTTP_CODES.HTTP_BAD_REQUEST);
		res.json('No user code received');
		return;
	}

	const challenge = await Challenge.findOne({
		where: { id: challengeId }
	});
	const testCases: TestCase[] = JSON.parse(challenge.test);
	try {
		executeChallenge(userCode, testCases);
	} catch (err) {
		res.status(HTTP_CODES.HTTP_BAD_REQUEST)
		res.json(err.message);
		return;
	}

	res.status(HTTP_CODES.HTTP_OK);
	res.json(`Passed ${testCases.length} test case(s) successfully`);
	return;
});
