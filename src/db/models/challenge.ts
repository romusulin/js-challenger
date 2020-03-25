import { DataTypes, Model } from 'sequelize';
import { db } from '../db';

export class Challenge extends Model {
	public id?: string;
	public name: string;
	public description: string;
	public test: string;
	public isActive: boolean;
}

Challenge.init({
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
}, {
	freezeTableName: true,
	sequelize: db,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
});
