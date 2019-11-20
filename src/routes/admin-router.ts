import * as express from 'express';
import { Request, Response } from 'express';
import { Challenge } from '../db/models/challenge';
import { verifyTokenMiddleware } from '../middleware/verify-token';
import { verifyAdminPrivilege } from '../middleware/verify-admin';
import { HTTP_CODES } from '../app';

export const adminRouter: express.Router = express.Router();

adminRouter.use(verifyTokenMiddleware);
adminRouter.use(verifyAdminPrivilege);

adminRouter.post('/upsertchallenge/:challengeid?', async (req: Request, res: Response) => {
	let challenge: Challenge = req.body;
	challenge.id = challenge.id || req.params.challengeid;

	res.status(HTTP_CODES.HTTP_SERVER_ERROR);
	let result;
	try {
		result = await Challenge.upsert(challenge, {
			returning: true
		});
	} catch (err) {
		res.json(err.message);
		return;
	}

	res.status(HTTP_CODES.HTTP_OK);
	res.json(result[0]);
});

