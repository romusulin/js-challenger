import { Sequelize, DataTypes } from 'sequelize';
import { TABLE } from '../db';
import { hashUserPassword} from '../../security/password-utils';
import { UserRow } from '../helpers/user-db-helper';
import * as sequelize from 'sequelize';

async function hashUserPasswordHook(user: UserRow, options: sequelize.Options) {
	const currentPassword: string = user.password;
	user.password = await hashUserPassword(currentPassword);

	return user;
}

export function User(sequelize: Sequelize, DataTypes: DataTypes) {
	const userSchema =  sequelize.define(TABLE.USER, {
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

	userSchema.beforeCreate('hashPwBeforeCreate', hashUserPasswordHook);
	userSchema.beforeUpdate('hashPwBeforeUpdate', hashUserPasswordHook);

	return userSchema;
}
