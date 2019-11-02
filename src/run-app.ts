import Settings from './settings';
import { app } from './app';
import { Logger } from './logger';


app.listen(Settings.PORT, () => {
	const logger = new Logger();
	logger.log(`Example app listening on port ${Settings.PORT}!`);
});
