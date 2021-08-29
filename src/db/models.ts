import { Model } from 'sequelize';
import { db } from './db';
import { hashUserPasswordHook, userAttributes } from './attributes/user-attributes';
import { challengeAttributes } from './attributes/challenge-attributes';
import { userChallengeAttributes } from './attributes/user-challenge-attributes';
import { leaderboardAttributes } from './attributes/leaderboard-attributes';
import { resetPasswordTokenAttributes } from './attributes/reset-password-token-attributes';

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
	public id?: number;
	public username: string;
	public email?: string;
	public password: string;
	public isAdmin?: boolean;
}

User.init(userAttributes, commonInitOptions);
User.beforeCreate('hashPwBeforeCreate', hashUserPasswordHook);

export class UserChallenge extends Model {
	public id?: number;
	public userId?: number;
	public challengeId?: number;
	public isSolved: boolean;
	public solution: string;
}

UserChallenge.init(userChallengeAttributes, commonInitOptions);

User.hasMany(UserChallenge, {foreignKey: 'userId', as: 'UserChallenges'});
User.belongsToMany(Challenge, {through: 'UserChallenge', foreignKey: 'userId', as: 'Challenges'});
Challenge.belongsToMany(User, {through: 'UserChallenge', foreignKey: 'challengeId', as: 'Users'});

export class  Leaderboard extends Model {
	public rank: number;
	public username: string;
	public solvedChallenges: number;
	public totalPoints: number;
}

const leaderboardInitOptions = {
	...commonInitOptions,
	createdAt: false,
	updatedAt: false,
	modelName: 'leaderboard_view'
};
Leaderboard.init(leaderboardAttributes, leaderboardInitOptions);

export class ResetPasswordToken extends Model {
	public id: number;
	public token: string;
	public userId: number;
	public isConsumed: boolean;
}

ResetPasswordToken.init(resetPasswordTokenAttributes, commonInitOptions);
