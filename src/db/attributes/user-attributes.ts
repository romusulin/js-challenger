import { DataTypes } from 'sequelize';
import { hashUserPassword } from '../../security/password-utils';
import { User } from '../models';

export const userAttributes = {
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
	},
	isAdmin: {
		type: DataTypes.BOOLEAN,
		allowNull: true
	}
};

export async function hashUserPasswordHook(user: User): Promise<void> {
	const currentPassword: string = user.password;
	user.password = await hashUserPassword(currentPassword);
}
