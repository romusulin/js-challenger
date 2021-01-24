const challengeMigration = {
	up: async (queryInterface, DataType) => {
		await queryInterface.createTable('Challenge', {
			id: {
				type: DataType.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			name: {
				type: DataType.STRING,
				allowNull: false
			},
			description: {
				type: DataType.STRING,
				allowNull: false
			},
			test: {
				type: DataType.TEXT,
				allowNull: false
			},
			isActive: {
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
		return queryInterface.dropTable('Challenge', { cascade: true });
	}
};

module.exports = challengeMigration;
