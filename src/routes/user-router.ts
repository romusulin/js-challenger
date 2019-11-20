import * as express from 'express';
import { UserDbHelper } from '../db/helpers/user-db-helper';
import { verifyUserPassword } from '../security/password-utils';
import { createToken } from '../security/auth-utils';
import { User } from '../db/models/user';
import { Request, Response, NextFunction } from 'express';
import { HTTP_CODES } from '../app';
import { verifyTokenMiddleware } from '../middleware/verify-token';

export const userRouter: express.Router = express.Router();

userRouter.post('/login', async (req: Request, res: Response) => {
	const loginInformation: { username: string, password: string } = req.body;
	if (!loginInformation.username || !loginInformation.password) {
		res.status(HTTP_CODES.HTTP_BAD_REQUEST);
		res.json('Login body must contain username and password fields.');
	} else {
		const dbUser = await UserDbHelper.findByUsername(loginInformation.username);
		if (dbUser && await verifyUserPassword(loginInformation.password, dbUser.password)) {
			const token = createToken({ username: dbUser.username, isAdmin: !!dbUser.isAdmin });
			res.json({ token: token });
			res.status(HTTP_CODES.HTTP_OK);
		} else {
			res.status(HTTP_CODES.HTTP_BAD_REQUEST);
			res.json('Bad username or password');
		}
	}

	res.send();
});

userRouter.post('/verify', verifyTokenMiddleware, (req: Request, res: Response) => {
	res.status(HTTP_CODES.HTTP_OK)
	res.json('Token verification successful');
});

userRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
	const registeringUser: { username: string, password: string} = req.body;

	res.status(HTTP_CODES.HTTP_BAD_REQUEST);

	if (!registeringUser || !registeringUser.username || !registeringUser.password) {
		res.json('Registration body should contain username and password fields.');
	} else if (await UserDbHelper.existsByUsername(registeringUser.username)) {
		res.json('Username is already taken');
	} else {
		try {
			const te = await User.create(registeringUser);
			res.status(HTTP_CODES.HTTP_OK_CREATED);
		} catch (err) {
			res.status(HTTP_CODES.HTTP_SERVER_ERROR);
			res.json(err);
		}
	}

	res.send();
});

