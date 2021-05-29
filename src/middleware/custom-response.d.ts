import { Challenge } from '../db/models/challenge';
import { User } from '../db/models/user';
import { Token } from '../security/auth-utils';
import { Response } from 'express';
import { ResetPasswordToken } from '../db/models';

interface EmbeddedLocals {
	username?: string;
	token?: Token;
	user?: User;
	loginInformation: { username: string, password: string };
	challenge?: Challenge;
	resetPasswordToken?: ResetPasswordToken;
}

export interface ResponseWithLocals extends Response {
	locals: EmbeddedLocals;
}
