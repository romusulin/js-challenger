import { Challenge, User, UserChallenge } from '../db/models';
import { executeChallenge } from '../challenges/challenge-executor';
import { db } from '../db/db';
import { QueryTypes } from 'sequelize';

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

interface LeaderboardUserRow {
	rank: string;
	"Solved challenges": number;
	User: string;
	"Total points": number;
}

export interface LeaderboardData {
	leaderboard: LeaderboardUserRow[],
	hasMore: boolean;
	page: number;
	pageRows: number;
}

export async function getLeaderboardData(page: number) {
	const offset = page * LEADERBOARD_QUERY_LIMIT;
	const results: LeaderboardUserRow[] = await db.query(
		`SELECT *
		 FROM leaderboard_view
		 LIMIT :limit
		 OFFSET :offset`,
		{
			replacements: { offset, limit: LEADERBOARD_QUERY_LIMIT + 1 },
			type: QueryTypes.SELECT
		}
	);

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
