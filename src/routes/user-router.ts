import * as express from 'express';
import { Request, Response } from 'express';
import { HTTP_CODES } from '../app';
import { verifyTokenMiddleware } from '../middleware/verify-token';
import { verifyLogin, verifyRegistration } from '../middleware/verify-user';
import {createUser, getUserDetails, login} from '../controllers/user-controller';
import { ResponseWithLocals } from '../middleware/custom-response';

export const userRouter: express.Router = express.Router();

userRouter.post('/login', verifyLogin, async (req: Request, res: ResponseWithLocals) => {
	// found user and login info are inserted into req.locals
	try {
		const token = await login(res.locals.user, res.locals.loginInformation);
		return res.status(HTTP_CODES.HTTP_OK).json({ token: token});
	} catch (err) {
		return res.status(HTTP_CODES.HTTP_BAD_REQUEST).json(err.message);
	}
});

userRouter.post('/verify', verifyTokenMiddleware, (req: Request, res: Response) => {
	res.status(HTTP_CODES.HTTP_OK)
	res.json('Token verification successful');
});

userRouter.post('/register', verifyRegistration, async (req: Request, res: Response) => {
	try {
		await createUser(req.body);
		return res.status(HTTP_CODES.HTTP_OK_CREATED).send();
	} catch (err) {
		return res.status(HTTP_CODES.HTTP_SERVER_ERROR).json(err);
	}
});

userRouter.get('/details', verifyTokenMiddleware, async (req: Request, res: Response) => {
	try {
		const username = res.locals.token.username;
		const userDetails = await getUserDetails(username);
		return res.status(HTTP_CODES.HTTP_OK).json(userDetails);
	} catch (err) {
		return res.status(HTTP_CODES.HTTP_SERVER_ERROR).json(err);
	}
});

