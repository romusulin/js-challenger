import * as express from 'express';
import { Request, Response } from 'express';
import { HTTP_CODES } from '../app';
import { verifyTokenMiddleware } from '../middleware/verify-token';
import { verifyLogin, verifyRegistration } from '../middleware/verify-user';
import {
	changePassword,
	createUser,
	getUserDetails,
	login,
	resetPassword
} from '../services/user-service';
import { ResponseWithLocals } from '../middleware/custom-response';
import { verifyResetPassword} from "../middleware/verify-forgot-password";
import { verifyChangePassword } from '../middleware/verify-change-password';

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

userRouter.get('/forgotpassword', verifyResetPassword, async (req: Request, res: ResponseWithLocals) => {
	try {
		await resetPassword(req.body.email);

		return res.status(HTTP_CODES.HTTP_OK).json(`Password reset token has been sent to the provided email.`);
	} catch (err) {
		return res.status(HTTP_CODES.HTTP_SERVER_ERROR).json(err);
	}
});

userRouter.post('/changepassword', verifyChangePassword, async (req: Request, res: ResponseWithLocals) => {
	try {
		const { email, token, newPassword } = req.body;
		await changePassword(email, token, newPassword);

		return res.status(HTTP_CODES.HTTP_OK).json(`Password changed.`);
	} catch (err) {
		return res.status(HTTP_CODES.HTTP_SERVER_ERROR).json(err);
	}
});

