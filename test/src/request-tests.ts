import { expect } from 'chai';
import { app } from '../../src/app';
import * as request from 'supertest';
import { CreateUserRow } from '../../src/db/helpers/user-db-helper';
import { getModel, TABLE, db } from '../../src/db/db';
import { cleanDatabase } from '../test-utils';

describe('Request endpoints', () => {
	const MOCK_USER: CreateUserRow = {
		username: 'test',
		password: 'hunter2'
	};

	beforeEach(() => {
		cleanDatabase();
	});

	after(async () => {
		await db.close();
	});

	describe('Registration', () => {
		it('should insert the user into postgres', async () => {
			const response = await request(app)
			.post('/register')
			.send(MOCK_USER)
			.set('Accept', 'application/json');

			expect(response.statusCode).to.equal(201);

			const allUsers = await getModel(TABLE.USER).findAll();
			expect(allUsers.length).to.equal(1);
			expect(allUsers[0].username).to.equal(MOCK_USER.username);
			expect(allUsers[0].password).to.not.equal(undefined);
			expect(allUsers[0].password).to.not.equal(MOCK_USER.password);
		});

		it('should respond 400 if user is already inserted', async () => {
			const successResponse = await request(app)
			.post('/register')
			.send(MOCK_USER)
			.set('Accept', 'application/json');

			expect(successResponse.statusCode).to.equal(201);

			const failedResponse = await request(app)
			.post('/register')
			.send(MOCK_USER)
			.set('Accept', 'application/json');

			expect(failedResponse.statusCode).to.equal(400);

			const allUsers = await getModel(TABLE.USER).findAll();
			expect(allUsers.length).to.equal(1);
		});

		it('should respond 400 if body is missing info', async () => {
			const missingPasswordResponse = await request(app)
			.post('/register')
			.send({ username: 'mock' })
			.set('Accept', 'application/json');

			expect(missingPasswordResponse.statusCode).to.equal(400);

			const rubbishBodyResponse = await request(app)
			.post('/register')
			.send('{[username"123"}')
			.set('Accept', 'application/json');

			expect(rubbishBodyResponse.statusCode).to.equal(400);

			const allUsers = await getModel(TABLE.USER).findAll();
			expect(allUsers.length).to.equal(0);
		});
	});
});
