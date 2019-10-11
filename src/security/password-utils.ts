import * as bcrypt from 'bcrypt';
import { ApplicationLogger, Logger } from '../logger';

const SALT_ROUNDS: number = 5;

export async function hashUserPassword(password: string): Promise<string> {
	const hashedPassword: string = bcrypt.hash(password, SALT_ROUNDS);

	return hashedPassword;
}
