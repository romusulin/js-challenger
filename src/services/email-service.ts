import * as nodemailer from 'nodemailer';
import Settings from '../settings';

interface EmailRequest {
	from: string;
	to: string;
	subject: string;
	text: string;
}

interface TransportedObject {
	host: string;
	port: number;
	secure: boolean;
	auth: {
		user: string;
		pass: string;
	}
}

async function getAuth(): Promise<Pick<TransportedObject, 'auth'>> {
	let envAuth = Settings.EMAIL_AUTH_JSON;
	if (!envAuth) {
		return await nodemailer.createTestAccount();
	} else {
		let auth;
		try {
			auth = JSON.parse(envAuth);
		} catch (e) {
			throw new Error(`Parsing "EMAIL_AUTH_JSON" JSON failed. Received string: ${envAuth}`);
		}

		return auth;
	}
}

async function getTransporterObject() {
	const auth = await getAuth();

	const transporter = {
		host: Settings.EMAIL_HOST,
		port: Settings.EMAIL_PORT,
		secure: Settings.EMAIL_SECURE,
		auth
	};

	return transporter;
}

export async function sendEmail(recipient: string, subject: string, text: string) {
	const transporterObject = await getTransporterObject();
	if (Settings.NODE_ENV === 'test' || !transporterObject.auth) {
		return;
	}

	const transporter = nodemailer.createTransport(transporterObject);

	const emailInfo: EmailRequest = {
		from: Settings.EMAIL_SENDER,
		to: recipient,
		subject,
		text
	};

	const response = await transporter.sendMail(emailInfo);

	return response;
}
