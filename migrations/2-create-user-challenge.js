const userChallengeMigration = {
	up: async (queryInterface, DataType) => {
		await queryInterface.createTable('UserChallenge', {
			id: {
				type: DataType.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			userId: {
				type: DataType.INTEGER,
				references: {
					model: { tableName: 'User' },
					key: 'id'
				}
			},
			challengeId: {
				type: DataType.INTEGER,
				references: {
					model: { tableName: 'Challenge'},
					key: 'id'
				}
			},
			solution: {
				type: DataType.TEXT,
				allowNull: false
			},
			isSolved: {
				type: DataType.BOOLEAN,
				allowNull: false
			},
			createdAt: {
				allowNull: false,
				type: DataType.DATE
			},
			updatedAt: {
				allowNull: false,
				type: DataType.DATE
			}
		});
	},
	down: (queryInterface) => {
		return queryInterface.dropTable('UserChallenge', { cascade: true });
	}
};

module.exports = userChallengeMigration;
