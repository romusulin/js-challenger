import * as log4js from 'log4js';

const APP_LOG_CATEGORY: string = 'app'
const DB_LOG_CATEGORY: string = 'db'

log4js.configure({
	appenders: {
		outSystem: {
			type: 'console',
			layout: {
				type: 'pattern',
				pattern: '%[%d{ABSOLUTE} (%z) %p %c -%] %m',
			}
		},
		outContext: {
			type: 'console',
			layout: {
				type: 'pattern',
				pattern: '%[%d{ABSOLUTE} (%z) %p %c @ %X{username} -%] %m'
			}
		}
	},
	categories: {
		default: {
			appenders: [
				'outSystem'
			],
			level: 'info',
		},
		[APP_LOG_CATEGORY]: {
			appenders: [
				'outContext'
			],
			level: 'info',
		},
		[DB_LOG_CATEGORY]: {
			appenders: [
				'outSystem'
			],
			level: 'info',
		}
	}
});

export class Logger {
	private logger: any;

	constructor(logCategory?: string, username?: string) {
		this.logger = log4js.getLogger(logCategory);
		this.logger.addContext('username', username);
	}

	info(...args) {
		this.logger.info(...['INFO', ...args]);
	}

	log(...args) {
		this.logger.log(...['INFO', ...args]);
	}

	debug(...args) {
		this.logger.log(...['DEBUG', ...args]);
	}

	error(...args) {
		this.logger.log(...['ERROR', ...args]);
	}
}

export class ApplicationLogger extends Logger {
	constructor(username: string) {
		super(APP_LOG_CATEGORY, username);
	}
}

export class DbLogger extends Logger {
	constructor() {
		super(DB_LOG_CATEGORY);
	}
}
