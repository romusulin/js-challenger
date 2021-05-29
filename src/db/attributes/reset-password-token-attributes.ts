import { DataTypes } from 'sequelize';

export const resetPasswordTokenAttributes = {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
		autoIncrement: true,
		primaryKey: true
	},
	token: {
		type: DataTypes.STRING,
		allowNull: false
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	isConsumed: {
		type: DataTypes.BOOLEAN
	}
};
