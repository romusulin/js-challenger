import { DataTypes, Model } from 'sequelize';
import { db } from './db';
import { hashUserPassword } from '../security/password-utils';

export class Challenge extends Model {
	public id?: number;
	public name: string;
	public description: string;
	public test: string;
	public isActive: boolean;
}

export class User extends Model {
	public id?: string;
	public username: string;
	public password: string;
	public isAdmin?: boolean;
}

export class UserChallenge extends Model {
	public id?: string;
	public userId?: number;
	public challengeId?: number;
	public isSolved: boolean;
	public solution: string;
}

const commonInitOptions = {
	freezeTableName: true,
	sequelize: db,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
};

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
}, commonInitOptions);

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
	},
	isAdmin: {
		type: DataTypes.BOOLEAN,
		allowNull: true
	}
}, commonInitOptions);



UserChallenge.init({
	id: {
		type: DataTypes.STRING,
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
}, commonInitOptions);

async function hashUserPasswordHook(user: User): Promise<void> {
	const currentPassword: string = user.password;
	user.password = await hashUserPassword(currentPassword);
}

User.beforeCreate('hashPwBeforeCreate', hashUserPasswordHook);
User.hasMany(UserChallenge, { foreignKey: 'userId', as: 'UserChallenges' });

Challenge.belongsToMany(User, { through: 'UserChallenge', foreignKey: 'challengeId', as: 'Users' });
User.belongsToMany(Challenge, { through: 'UserChallenge', foreignKey: 'userId', as: 'Challenges'});
