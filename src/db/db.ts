import Settings from '../settings';
import { DbLogger} from '../logger';
import { Options, Sequelize, Model, ModelCtor } from 'sequelize';

export enum TABLE {
	USER = "User"
};

let logging: ((sql: string) => void) | boolean = false;

if (Settings.ENABLE_SEQUELIZE_LOGGING) {
	const logger = new DbLogger();
	logging = (query) => {
		logger.log.bind(logger)(query);
	}
}

const sequelizeOptions: Options = {
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
	logging
};

export const db = new Sequelize(Settings.DATABASE_URL as string, sequelizeOptions);
