import * as envalid from 'envalid';
import {
	bool,
	num,
	str
} from 'envalid';

require('dotenv').config();

/*
 * Validate environment variables and set the default value where
 * missing. The best way to set the environment for the local
 * machine is to add the .env file to the project root as described
 * in https://github.com/motdotla/dotenv. The .env file will be
 * created automatically by running npm run setup-dev-env-vars
 */
const env = envalid.cleanEnv(process.env, {
	NODE_ENV: str({
		default: 'development',
		desc: 'Type of environment'
	}),
	PORT: num({
		default: 3000,
		desc: 'A port on which the application will listen on'
	}),
	DATABASE_URL: str({
		default: 'postgres://postgres:password@localhost:5432/postgres',
		desc: 'Postgres url'
	}),
	ENABLE_SEQUELIZE_LOGGING: bool({
		default: true,
		desc: 'Enable sequelize logging'
	}),
	MAX_DB_CONNECTIONS_PER_INSTANCE: num({
		default: 20,
		desc: 'Max connections per instance'
	}),
	MIN_DB_CONNECTIONS_PER_INSTANCE: num({
		default: 0,
		desc: 'Min connections per instance'
	}),
	DISABLE_DATABASE_SSL: bool({
		default: true,
		desc: 'Disable database ssl connections'
	})
});

export default { ...env };
