import { app } from '../../src/app';
import * as request from 'supertest';
import { Challenge, ResetPasswordToken, User, UserChallenge } from '../../src/db/models';
import { expect } from 'chai';


describe('Forgot password tests', () => {
	const MOCK_USER = {
		username: 'mock',
		password: 'hunter2',
		email: 'mock@domain.com'
	};

	before( async () => {
		await Promise.all([
			UserChallenge.truncate({ cascade: true }),
			User.truncate({ cascade: true }),
			Challenge.truncate({ cascade: true }),
			ResetPasswordToken.truncate({ cascade: true })
		]);
	});

	it('user can change password', async () => {
		await request(app)
			.post('/user/register')
			.send(MOCK_USER)
			.set('Accept', 'application/json');

		await request(app)
			.get('/user/forgotpassword')
			.send({ email: MOCK_USER.email})
			.set('Accept', 'application/json');


		const users = await User.findAll();
		expect(users.length).to.equal(1);

		let resetPasswordTokens = await ResetPasswordToken.findAll();
		expect(resetPasswordTokens.length).to.equal(1);
		expect(resetPasswordTokens[0].userId).to.equal(users[0].id);
		expect(resetPasswordTokens[0].isConsumed).to.equal(false);


		const newPassword = 'test1234';
		await request(app)
			.post('/user/changepassword')
			.send({
				email: MOCK_USER.email,
				token: resetPasswordTokens[0].token,
				newPassword
			})
			.set('Accept', 'application/json');

		resetPasswordTokens = await ResetPasswordToken.findAll();
		expect(resetPasswordTokens.length).to.equal(1);
		expect(resetPasswordTokens[0].userId).to.equal(users[0].id);
		expect(resetPasswordTokens[0].isConsumed).to.equal(true);

		const loginResponse = await request(app)
			.post('/user/login')
			.send({
				...MOCK_USER,
				password: newPassword
			})
			.set('Accept', 'application/json');
		expect(loginResponse.statusCode).to.equal(200);
		expect(loginResponse.body.token).to.not.equal(undefined);

		const verificationResponse = await request(app)
			.post('/user/verify')
			.set('Authorization', `JWT ${loginResponse.body.token}`);
		expect(verificationResponse.statusCode).to.equal(200);

	});
});
