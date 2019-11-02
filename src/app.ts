import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response, NextFunction } from 'express';
import { UserDbHelper } from './db/helpers/user-db-helper';

enum HTTP_CODES {
	HTTP_OK_CREATED = 201,
	HTTP_BAD_REQUEST = 400,
	HTTP_SERVER_ERROR = 500
};

export const app: express.Express = express();
app.use(bodyParser.json());

app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
	const registeringUser: { username: string, password: string} = req.body;

	res.status(HTTP_CODES.HTTP_BAD_REQUEST);

	if (!registeringUser || !registeringUser.username || !registeringUser.password) {
		res.json('Registration body should contain username and password fields.');
	} else if (await UserDbHelper.existsByUsername(registeringUser.username)) {
		res.json('Username is already taken');
	} else {
		try {
			const te = await UserDbHelper.create(registeringUser);
			res.status(HTTP_CODES.HTTP_OK_CREATED);
		} catch (err) {
			res.status(HTTP_CODES.HTTP_SERVER_ERROR);
			res.json(err);
		}
	}

	res.send();
});
