import { DataTypes } from 'sequelize';

export const challengeAttributes = {
	id: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
		autoIncrement: true,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	points: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	description: {
		type: DataTypes.STRING,
		allowNull: false
	},
	test: {
		type: DataTypes.TEXT,
		allowNull: false
	},
	isActive: {
		type: DataTypes.BOOLEAN,
		allowNull: false
	}
};
