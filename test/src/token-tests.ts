import { expect } from 'chai';
import { createToken, verifyToken, Token } from '../../src/security/auth-utils';

describe('Token tests', () => {
	it('should create and verify a valid token', async () => {
		const mockPayload: Token = {
			username: 'test'
		};

		const createdToken: string = createToken(mockPayload);
		expect(createdToken).to.not.equal(undefined);

		const decodedToken = verifyToken(createdToken);
		expect(decodedToken).to.not.equal(undefined);
		expect(decodedToken.token.username).to.equal(mockPayload.username);
	});

	it('created token should contain the admin status', () => {
		const mockPayload: Token = {
			username: 'test',
			isAdmin: true
		};

		const createdToken: string = createToken(mockPayload);
		expect(createdToken).to.not.equal(undefined);

		const decodedToken = verifyToken(createdToken);
		expect(decodedToken).to.not.equal(undefined);
		expect(decodedToken.token.username).to.equal(mockPayload.username);
		expect(decodedToken.token.isAdmin).to.equal(true);
	});
});
