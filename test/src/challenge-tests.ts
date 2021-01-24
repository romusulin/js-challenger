import { executeChallenge } from '../../src/challenges/challenge-executor';
import { TestCase } from '../../src/challenges/test-case';
import { ASSERT_OPERATIONS } from '../../src/challenges/assertion';
import { assert, expect } from 'chai';

describe('Simple challenge executor tests', () => {
	it('should pass correct solution', () => {
		const correctSolution = 'function solution(num) { return num * num; }';
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
		const result = executeChallenge(correctSolution,  { test: JSON.stringify(testCases), id: 0 });
		expect(result.isSuccess).to.equal(true);
	});

	it('should throw an error on incorrect solution', () => {
		const incorrectSolution = 'function solution(num) { return num * num * num; }';
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

		const result = executeChallenge(incorrectSolution, { test: JSON.stringify(testCases), id: 0 });
		expect(result.isSuccess).to.equal(false);
		expect(result.error.message.includes('Calling the function with')).to.equal(true);
		expect(result.error.message.includes('[2]')).to.equal(true);
		expect(result.error.message.includes('4')).to.equal(true);
	});
});
