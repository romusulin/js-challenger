const {hashUserPassword} = require("../src/security/password-utils");

const userMigration = {
	up: async (queryInterface) => {
		const testCases = [
			{
				input: [ 2 ],
				output: 4,
				operation: 'equals'
			},
			{
				input: [ 4 ],
				output: 16,
				operation: 'equals'
			}
		];

		return queryInterface
		.bulkInsert('User', [{
				username: 'test1234',
				password: await hashUserPassword('test1234'),
				email: 'test@1234.com',
				createdAt: 'NOW()',
				updatedAt: 'NOW()'
			}]
		).then(() => {
			return queryInterface.bulkInsert('Challenge', [{
				name: '(S) Square the number',
				description: 'Write a function which receives a number, and returns a squared number. (input: Number) => Number',
				test: JSON.stringify(testCases),
				points: 1,
				isActive: true,
				createdAt: 'NOW()',
				updatedAt: 'NOW()'
			}])
		});
	}
};

module.exports = userMigration;
