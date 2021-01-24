const userMigration = {
	up: async (queryInterface, DataType) => {
		await queryInterface.createTable('User', {
			id: {
				type: DataType.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			username: {
				type: DataType.STRING,
				allowNull: false
			},
			password: {
				type: DataType.STRING,
				allowNull: false
			},
			isAdmin: {
				type: DataType.BOOLEAN,
				allowNull: true
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
		return queryInterface.dropTable('Challenge', { cascade: true });
	}
};

module.exports = userMigration;
