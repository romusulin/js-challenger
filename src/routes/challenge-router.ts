import * as express from 'express';
import { verifyTokenMiddleware } from '../middleware/verify-token';
import { Request } from 'express';
import { Challenge } from '../db/models/challenge';
import { HTTP_CODES } from '../app';
import { verifyChallengeSubmission } from '../middleware/verify-challenge-submission';
import { executeSubmission } from '../services/challenge-service';
import { ResponseWithLocals } from '../middleware/custom-response';

export const challengeRouter: express.Router = express.Router();

challengeRouter.use(verifyTokenMiddleware);

challengeRouter.post('/submit/:challengeid?', verifyChallengeSubmission, async (req: Request, res: ResponseWithLocals) => {
	// challenge and token info inserted into req.locals
	const challenge: Challenge = res.locals.challenge;
	const username: string = res.locals.token.username;
	const userCode: string = req.body.code;

	try {
		const numberOfTestCases = await executeSubmission(username, challenge, userCode);
		return res.status(HTTP_CODES.HTTP_OK).json(`Passed ${numberOfTestCases} test case(s) successfully.`).send();
	} catch (err) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json(err.message).send();
	}
});
