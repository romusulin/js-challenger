import { Sequelize, DataTypes } from 'sequelize';
import { TABLE } from '../db';

export function User(sequelize: Sequelize, DataTypes: DataTypes) {
	return sequelize.define(TABLE.USER, {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			autoIncrement: true,
			primaryKey: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		freezeTableName: true,
		createdAt: 'createdAt',
		updatedAt: 'updatedAt'
	});
}
