import { Challenge, User, UserChallenge } from '../db/models';
import { executeChallenge } from '../challenges/challenge-executor';

export async function executeSubmission(username: string, challenge: Challenge, userCode: string) {
	let result = executeChallenge(userCode, challenge);
	const user = await User.findOne({
		where: { username },
		include: [{ model: UserChallenge, as: 'UserChallenges' }]
	});

	const userChallenges: UserChallenge[] = await user.getUserChallenges();
	let userChallenge = userChallenges.find((uc) => uc.challengeId === challenge.id);

	if (userChallenge && !userChallenge.isSolved) {
		const updatedUserChallenge = {
			...userChallenge,
			solution: userCode,
			isSolved: result.isSuccess
		};
		await UserChallenge.update(updatedUserChallenge, { where: { id: userChallenge.id }});
	} else if (!userChallenge) {
		const newUserChallenge = {
			userId: user.id,
			challengeId: challenge.id,
			solution: userCode,
			isSolved: result.isSuccess
		};
		await UserChallenge.create(newUserChallenge);
	}

	if (result.isSuccess === false) {
		throw result.error;
	}
}
