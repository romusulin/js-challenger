import * as express from 'express';
import * as bodyParser from 'body-parser';
import { userRouter } from './routes/user-router';
import { adminRouter } from './routes/admin-router';
import { challengeRouter } from './routes/challenge-router';

export enum HTTP_CODES {
	HTTP_OK = 200,
	HTTP_OK_CREATED = 201,
	HTTP_BAD_REQUEST = 400,
	HTTP_SERVER_ERROR = 500,
	HTTP_UNAUTHORIZED = 401,
	HTTP_FORBIDDEN = 403
};

export const app: express.Express = express();
app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/admin', adminRouter);
app.use('/challenge', challengeRouter);
