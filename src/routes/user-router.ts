import * as express from 'express';
import { Request, Response } from 'express';
import { HTTP_CODES } from '../app';
import { verifyTokenMiddleware } from '../middleware/verify-token';
import { verifyLogin, verifyRegistration } from '../middleware/verify-user';
import { createUser, login } from '../controllers/user-controller';
import { ResponseWithLocals } from '../middleware/custom-response';

export const userRouter: express.Router = express.Router();

userRouter.post('/login', verifyLogin, async (req: Request, res: ResponseWithLocals) => {
	// found user and login info are inserted into req.locals
	try {
		const token = await login(res.locals.user, res.locals.loginInformation);
		return res.json({ token: token}).status(HTTP_CODES.HTTP_OK).send();
	} catch (err) {
		return res.json(err.message).status(HTTP_CODES.HTTP_BAD_REQUEST).send();
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
		return res.status(HTTP_CODES.HTTP_SERVER_ERROR).json(err).send();
	}
});

