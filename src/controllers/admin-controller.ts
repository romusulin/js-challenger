import { Challenge } from '../db/models';

export async function upsertChallenge(challenge: Challenge) {
	return Challenge.upsert(challenge, {
		returning: true
	});
}
