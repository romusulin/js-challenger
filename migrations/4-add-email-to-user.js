const { readFileSync } = require('fs');
const { join } = require('path');

const addEmailToUserMigration = {
	up: async (queryInterface, DataType) => {
		return queryInterface.sequelize.transaction((transaction) => {
			return queryInterface.addColumn(
				'User',
				'email',
				{
					type: DataType.TEXT,
					allowNull: false,
					unique: true
			}, {
					transaction
				}
			);
		});
	},
	down: async (queryInterface) => {
		return queryInterface.sequelize.transaction((transaction) => {
			return queryInterface.removeColumn({ tableName: 'User' }, 'email');
		});
	}
};

module.exports = addEmailToUserMigration;
