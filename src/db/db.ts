import Settings from '../settings';
import { DbLogger} from '../logger';
import * as Sequelize from 'sequelize';
import { User } from './models/user';

export enum TABLE {
	USER = "User"
};

let logging: Function | boolean = false;

if (Settings.ENABLE_SEQUELIZE_LOGGING) {
	const logger = new DbLogger();
	logging = (query) => {
		logger.log.bind(logger)(query);
	}
}

const sequelize = new Sequelize(
	Settings.DATABASE_URL,
	{
		dialect: 'postgres',
		dialectOptions: {
			ssl: !Settings.DISABLE_DATABASE_SSL,
			prependSearchPath: true // https://github.com/sequelize/sequelize/issues/4771
		},
		pool: {
			acquire: 30000,
			max: Settings.MAX_DB_CONNECTIONS_PER_INSTANCE,
			min: Settings.MIN_DB_CONNECTIONS_PER_INSTANCE
		},
		logging,
		operatorsAliases: false
	}
);

const test = Settings;
const userSchema = User(sequelize, sequelize.Sequelize);

export const db: Sequelize.Sequelize = sequelize;

export function getModel(table: TABLE): Sequelize.Model<any,any> {
	return db.models[table];
}
