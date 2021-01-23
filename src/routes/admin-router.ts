import * as express from 'express';
import { Request, Response } from 'express';
import { Challenge } from '../db/models/challenge';
import { verifyTokenMiddleware } from '../middleware/verify-token';
import { verifyAdminPrivilege } from '../middleware/verify-admin';
import { HTTP_CODES } from '../app';
import { upsertChallenge } from '../services/admin-service';

export const adminRouter: express.Router = express.Router();

adminRouter.use(verifyTokenMiddleware);
adminRouter.use(verifyAdminPrivilege);

adminRouter.post('/upsertchallenge/:challengeid?', async (req: Request, res: Response) => {
	let challenge: Challenge = req.body;
	challenge.id = challenge.id || req.params.challengeid;

	let result;
	try {
		result = await upsertChallenge(challenge);
	} catch (err) {
		return res.json(err.message).status(HTTP_CODES.HTTP_SERVER_ERROR);
	}

	res.status(HTTP_CODES.HTTP_OK).json(result[0]);
});

