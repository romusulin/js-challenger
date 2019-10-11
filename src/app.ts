import * as express from 'express';
import * as bodyParser from 'body-parser';
import Settings from './settings';
import { Request, Response, NextFunction } from 'express';
import { Logger } from './logger';
import { UserDbHelper, CreateUserRow } from './db/helpers/user-db-helper';

enum HTTP_CODES {
	HTTP_OK_CREATED = 201,
	HTTP_BAD_REQUEST = 400
};

const logger = new Logger();
const app: express.Express = express();
app.use(bodyParser.json());

app.post('/register', async (req: Request, res: Response, next: NextFunction) => {
	const registeringUser: { username: string, password: string} = req.body;

	if (await UserDbHelper.existsByUsername(registeringUser.username)) {
		res.status(HTTP_CODES.HTTP_BAD_REQUEST);
		res.json('Username is already taken');
	} else {
		try {
			const te = await UserDbHelper.create(registeringUser);
		} catch (err) {
			res.json(err);
		}

		res.status(HTTP_CODES.HTTP_OK_CREATED);
	}

	res.send();
});

app.listen(Settings.PORT, () => {
	logger.log(`Example app listening on port ${Settings.PORT}!`);
});
