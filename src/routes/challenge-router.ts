import * as express from 'express';
import { verifyAuthorizationTokenMiddleware } from '../middleware/verify-token';
import { Request } from 'express';
import { HTTP_CODES } from '../app';
import { verifyChallengeSubmission } from '../middleware/verify-challenge-submission';
import { executeSubmission, getLeaderboardData } from '../services/challenge-service';
import { ResponseWithLocals } from '../middleware/custom-response';

export const challengeRouter: express.Router = express.Router();

challengeRouter.use(verifyAuthorizationTokenMiddleware);

challengeRouter.post('/submit/:challengeid?', verifyChallengeSubmission, async (req: Request, res: ResponseWithLocals) => {
	// challenge and token info inserted into res.locals
	const challenge = res.locals.challenge;
	const username: string = res.locals.token.username;
	const userCode: string = req.body.code;

	try {
		await executeSubmission(username, challenge, userCode);
		return res.status(HTTP_CODES.HTTP_OK).json(`All test cases passed successfully.`);
	} catch (err) {
		return res.status(HTTP_CODES.HTTP_OK).json(err.message);
	}
});

challengeRouter.get('/leaderboard/:page?', async (req: Request, res: ResponseWithLocals) => {
	const page = Number(req.params.page) || 0;
	const response = getLeaderboardData(page);

	return res.status(HTTP_CODES.HTTP_OK).json(response);
});
