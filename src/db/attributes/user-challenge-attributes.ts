import { DataTypes } from 'sequelize';

export const userChallengeAttributes = {
	id: {
		type: DataTypes.INTEGER,
		allowNull: false,
		unique: true,
		autoIncrement: true,
		primaryKey: true
	},
	isSolved: {
		type: DataTypes.BOOLEAN,
		allowNull: true
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	challengeId: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	solution: {
		type: DataTypes.TEXT,
		allowNull: true
	}
};
