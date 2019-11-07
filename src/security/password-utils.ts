import * as bcrypt from 'bcrypt';
import { ApplicationLogger, Logger } from '../logger';

const SALT_ROUNDS: number = 5;

export async function hashUserPassword(password: string): Promise<string> {
	const hashedPassword: string = await bcrypt.hash(password, SALT_ROUNDS);

	return hashedPassword;
}

export async function verifyUserPassword(password: string, hash: string): Promise<boolean> {
	const isVerificationSuccessful: boolean = await bcrypt.compare(password, hash);

	return isVerificationSuccessful;
}
