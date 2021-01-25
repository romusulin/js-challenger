const { readFileSync } = require('fs');
const { join } = require('path');

const addPointsToChallenge = {
	up: async (queryInterface, DataType) => {
		return queryInterface.sequelize.transaction(async transaction => {
			await queryInterface.addColumn(
				'Challenge',
				'points',
				{
					type: DataType.INTEGER,
					allowNull: false
				}, {
					transaction
				}
			);

			const addLeaderboardView = readFileSync(
				join(__dirname, 'leaderboard-view.sql'),
				'utf-8'
			);

			return queryInterface.sequelize.query(addLeaderboardView, { transaction });
		});
	},
	down: async (queryInterface) => {
		return queryInterface.sequelize.transaction(async (transaction) => {
			await queryInterface.sequelize.query(`DROP VIEW "leaderboard_view";`, { transaction });

			return queryInterface.removeColumn({ tableName: 'Challenge' }, 'points');
		});
	}
};

module.exports = addPointsToChallenge;
