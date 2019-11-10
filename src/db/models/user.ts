import { Model, DataTypes, CreateOptions } from 'sequelize';
import { hashUserPassword} from '../../security/password-utils';
import { db } from '../db';

async function hashUserPasswordHook(user: User): Promise<void> {
	const currentPassword: string = user.password;
	user.password = await hashUserPassword(currentPassword);
}

export class User extends Model {
	public id?: string;
	public username: string;
	public password: string;
}

User.init({
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
	sequelize: db,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
});

User.beforeCreate('hashPwBeforeCreate', hashUserPasswordHook);
