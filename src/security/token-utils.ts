import * as crypto from "crypto";

export function generateToken(size: number = 16) {
	const token = crypto.randomBytes(size * 4).toString('hex').slice(0, size);

	return token;
}
