import { Model } from 'sequelize';
import { db } from './db';
import { hashUserPassword } from '../security/password-utils';
import { hashUserPasswordHook, userAttributes } from './attributes/user-attributes';
import { challengeAttributes } from './attributes/challenge-attributes';
import { userChallengeAttributes } from './attributes/user-challenge-attributes';

const commonInitOptions = {
	freezeTableName: true,
	sequelize: db,
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
};

export class Challenge extends Model {
	public id?: number;
	public name: string;
	public points: number;
	public description: string;
	public test: string;
	public isActive: boolean;
}
Challenge.init(challengeAttributes, commonInitOptions);

export class User extends Model {
	public id?: string;
	public username: string;
	public password: string;
	public isAdmin?: boolean;
}
User.init(userAttributes, commonInitOptions);
User.beforeCreate('hashPwBeforeCreate', hashUserPasswordHook);

export class UserChallenge extends Model {
	public id?: string;
	public userId?: number;
	public challengeId?: number;
	public isSolved: boolean;
	public solution: string;
}
UserChallenge.init(userChallengeAttributes, commonInitOptions);


User.hasMany(UserChallenge, { foreignKey: 'userId', as: 'UserChallenges' });
User.belongsToMany(Challenge, { through: 'UserChallenge', foreignKey: 'userId', as: 'Challenges'});
Challenge.belongsToMany(User, { through: 'UserChallenge', foreignKey: 'challengeId', as: 'Users' });
