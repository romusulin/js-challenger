import { Challenge } from '../db/models/challenge';
import { TestCase } from '../challenges/test-case';
import { executeChallenge } from '../challenges/challenge-executor';

export async function executeSubmission(username: string, challenge: Challenge, userCode: string) {
	const testCases: TestCase[] = JSON.parse(challenge.test);
	executeChallenge(userCode, testCases);

	return testCases.length;
}

