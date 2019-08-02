import { TABLE } from '../db';

const userMigration = {
	up: async (queryInterface, DataType) => {
		await queryInterface.createTable(TABLE.USER, {
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
		return queryInterface.dropTable(TABLE.USER, { cascade: true });
	}
};

export = userMigration;
