import {Challenge, Leaderboard as LeaderboardModel, User, UserChallenge} from '../db/models';
import { executeChallenge } from '../challenges/challenge-executor';
const LEADERBOARD_QUERY_LIMIT = 50;

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

export interface LeaderboardData {
	leaderboard: LeaderboardModel[],
	hasMore: boolean;
	page: number;
	pageRows: number;
}

export async function getLeaderboardData(page: number) {
	const offset = page * LEADERBOARD_QUERY_LIMIT;
	const limit = LEADERBOARD_QUERY_LIMIT + 1;
	const results = await LeaderboardModel.findAll({
		limit,
		offset
	});

	let hasMore = false;
	if (results.length > LEADERBOARD_QUERY_LIMIT) {
		hasMore = true;
		results.pop();
	}

	const leaderboard: LeaderboardData = {
		leaderboard: results,
		pageRows: results.length,
		hasMore,
		page
	};

	return leaderboard;
}
