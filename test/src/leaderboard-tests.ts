import { expect } from 'chai';
import { Challenge, User, UserChallenge } from '../../src/db/models';
import { getLeaderboardData, LeaderboardData } from '../../src/controllers/challenge-controller';

describe('Leaderboard tests', () => {
	before(async () => {
		await Challenge.truncate({cascade: true});
		await User.truncate({cascade: true});
		await UserChallenge.truncate({cascade: true});
	});

	it('should return data on no user challenges', async () => {
		const data: LeaderboardData = await getLeaderboardData(0);
		const expectedData: LeaderboardData = {
			leaderboard: [],
			hasMore: false,
			page: 0,
			pageRows: 0
		}

		expect(data).to.deep.equal(expectedData);
	});

	it('should fetch leaderboard data', async () => {
		let users: Pick<User, 'id' | 'username' | 'password' | 'isAdmin'>[] = [];
		for (let i = 0; i < 75; i++) {
			const user: Pick<User, 'id' | 'username' | 'password' | 'isAdmin'> = {
				username: `user-${i}`,
				password: 'pw',
				isAdmin: false
			};

			users.push(user);
		}

		await User.bulkCreate(users);
		expect((await User.findAll()).length).to.equal(75);

		const page0 = await getLeaderboardData(0);
		expect(page0.leaderboard.length).to.equal(50);
		expect(page0.hasMore).to.equal(true);
		expect(page0.page).to.equal(0);
		expect(page0.pageRows).to.equal(50);

		const page1 = await getLeaderboardData(1);
		expect(page1.leaderboard.length).to.equal(25);
		expect(page1.hasMore).to.equal(false);
		expect(page1.page).to.equal(1);
		expect(page1.pageRows).to.equal(25);
	});
});
