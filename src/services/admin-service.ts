import { Challenge } from '../db/models/challenge';

export async function upsertChallenge(challenge: Challenge) {
	return Challenge.upsert(challenge, {
		returning: true
	});
}
