import { Challenge } from '../db/models/challenge';
import { User } from '../db/models/user';
import { Token } from '../security/auth-utils';
import { Response } from 'express';

interface EmbeddedLocals {
	username?: string;
	token?: Token;
	user?: User;
	loginInformation: { username: string, password: string };
	challenge?: Challenge;
}

export interface ResponseWithLocals extends Response {
	locals: EmbeddedLocals;
}
