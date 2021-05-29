import { DataTypes } from 'sequelize';

export const leaderboardAttributes = {
	rank: {
		type: DataTypes.NUMBER,
		primaryKey: true
	},
	username: {
		type: DataTypes.STRING
	},
	solvedChallenges: {
		type: DataTypes.NUMBER
	},
	totalPoints: {
		type: DataTypes.NUMBER
	}
};
