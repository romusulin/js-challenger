import { expect } from 'chai';
import { app, HTTP_CODES } from '../../src/app';
import * as request from 'supertest';
import { db } from '../../src/db/db';
import { cleanDatabase } from '../test-utils';
import { User } from '../../src/db/models/user';
import { ASSERT_OPERATIONS } from '../../src/challenges/assertion';
import { TestCase } from '../../src/challenges/test-case';
import { Challenge } from '../../src/db/models/challenge';

const MOCK_USER = {
	username: 'test',
	password: 'hunter2'
};

async function getNonAdminAuthorizationHeader() {
	await request(app)
		.post('/register')
		.send(MOCK_USER)
		.set('Accept', 'application/json');

	const loginResponse = await request(app)
		.post('/login')
		.send(MOCK_USER)
		.set('Accept', 'application/json');

	return 'JWT ' + loginResponse.body.token;
}

describe('Request endpoints', () => {
	after(async () => {
		await db.close();
	});

	describe('Registration', () => {
		beforeEach(async () => {
			await cleanDatabase();
		});

		it('should insert the user into postgres', async () => {
			const response = await request(app)
			.post('/register')
			.send(MOCK_USER)
			.set('Accept', 'application/json');

			expect(response.statusCode).to.equal(201);

			const allUsers = await User.findAll();
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

			const allUsers = await User.findAll();
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

			const allUsers = await User.findAll();
			expect(allUsers.length).to.equal(0);
		});
	});

	describe('Login', () => {
		beforeEach(async () => {
			await cleanDatabase();
		});

		const MOCK_USER = {
			username: 'mock',
			password: 'hunter2'
		};

		async function createMockUser() {
			await request(app)
			.post('/register')
			.send(MOCK_USER)
			.set('Accept', 'application/json');
		}

		it('should receive a verifiable token with correct credentials', async () => {
			await createMockUser();
			const successResponse = await request(app)
			.post('/login')
			.send(MOCK_USER)
			.set('Accept', 'application/json');

			expect(successResponse.statusCode).to.equal(200);

			const token = successResponse.body.token;
			expect(successResponse.body.token).to.not.equal(undefined);

			const verificationResponse = await request(app)
			.post('/verify')
			.set('Authorization', `JWT ${token}`);

			expect(verificationResponse.statusCode).to.equal(200);
		});
	});

	describe('Admin', () => {
		beforeEach(async () => {
			await cleanDatabase();
		});

		const MOCK_ADMIN_USER = {
			username: 'test',
			password: 'hunter2',
			isAdmin: true
		};

		async function getAuthorizationHeader() {
			await request(app)
			.post('/register')
			.send(MOCK_ADMIN_USER)
			.set('Accept', 'application/json');

			const loginResponse = await request(app)
			.post('/login')
			.send(MOCK_ADMIN_USER)
			.set('Accept', 'application/json');

			return 'JWT ' + loginResponse.body.token;
		}

		it ('should insert and update the challenge', async () => {
			const authHeader = await getAuthorizationHeader();
			const mockChallenge = {
				name: 'Test',
				description: 'Test description',
				test: 'undefined',
				isActive: true
			};

			const response = await request(app)
			.post('/admin/upsertchallenge')
			.send(mockChallenge)
			.set('Accept', 'application/json')
			.set('Authorization', authHeader);

			expect(response.status).to.equal(200);

			let allChallenges = await Challenge.findAll();
			expect(allChallenges.length).to.equal(1);
			expect(allChallenges[0].name).to.equal(mockChallenge.name);
			expect(allChallenges[0].description).to.equal(mockChallenge.description);
			expect(allChallenges[0].id).to.equal(response.body.id);

			const newDescription = 'Test #2';
			mockChallenge.description = newDescription;

			await request(app)
			.post('/admin/upsertchallenge/' + allChallenges[0].id)
			.send(mockChallenge)
			.set('Accept', 'application/json')
			.set('Authorization', authHeader);

			allChallenges = await Challenge.findAll();
			expect(allChallenges.length).to.equal(1);
			expect(allChallenges[0].name).to.equal(mockChallenge.name);
			expect(allChallenges[0].description).to.equal(newDescription);
		});

		it('should not authorize a non admin to update a challenge', async () => {
			const authHeader = await getNonAdminAuthorizationHeader();
			const mockChallenge = {
				name: 'Test',
				description: 'Test description',
				test: 'undefined',
				isActive: true
			};

			const response = await request(app)
			.post('/admin/upsertchallenge')
			.send(mockChallenge)
			.set('Accept', 'application/json')
			.set('Authorization', authHeader);

			expect(response.status).to.equal(401);
		});
	});

	describe('Challenge', () => {
		async function setupMockChallenge(): Promise<string> {
			const testCases: TestCase[] = [
				{
					input: [ 2 ],
					output: 4,
					operation: ASSERT_OPERATIONS.EQUALS
				},
				{
					input: [ 4 ],
					output: 16,
					operation: ASSERT_OPERATIONS.EQUALS
				}
			];

			const mockChallenge = {
				name: 'Square the number',
				description: 'Write a function which receives a number, and returns a squared number',
				test: JSON.stringify(testCases),
				isActive: true
			};
			return (await Challenge.create(mockChallenge)).id;
		}

		let authHeader: string;
		let challengeId: string;

		before(async () => {
			authHeader = await getNonAdminAuthorizationHeader();
			challengeId = await setupMockChallenge();
		});

		it('should fail the challenge', async () => {
			const invalidSolution = `const solution = (n) => { return n*n+1; }`;
			const response = await request(app)
			.post('/challenge/submit/' + challengeId)
			.send({
				code: invalidSolution
			})
			.set('Accept', 'application/json')
			.set('Authorization', authHeader);

			expect(response.status).to.equal(HTTP_CODES.HTTP_BAD_REQUEST);
			expect(response.body).to.contain('Test execution failed: ');
		});

		it('should pass the challenge', async () => {
			const invalidSolution = `const solution = (n) => { return n*n; }`;
			const response = await request(app)
				.post('/challenge/submit/' + challengeId)
				.send({
					code: invalidSolution
				})
				.set('Accept', 'application/json')
				.set('Authorization', authHeader);

			expect(response.status).to.equal(HTTP_CODES.HTTP_OK);
			expect(response.body).to.contain('Passed ');
		});
	});
});
