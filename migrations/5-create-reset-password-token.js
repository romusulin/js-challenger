const createResetPasswordToken = {
	up: async (queryInterface, DataType) => {
		await queryInterface.createTable('ResetPasswordToken', {
			id: {
				type: DataType.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			token: {
				type: DataType.STRING,
				allowNull: false
			},
			userId: {
				type: DataType.INTEGER,
				references: {
					model: { tableName: 'User' },
					key: 'id'
				}
			},
			isConsumed: {
				type: DataType.BOOLEAN
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
		return queryInterface.dropTable('ResetPasswordToken', { cascade: true });
	}
};

module.exports = createResetPasswordToken;
