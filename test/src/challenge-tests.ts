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
		executeChallenge(correctSolution, testCases);
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
		try {
			executeChallenge(incorrectSolution, testCases);
			assert(false, 'An error should have been thrown');
		} catch (err) {
			expect(err.message).to.include('Calling the function with');
			expect(err.message).to.include('[2]');
			expect(err.message).to.include('4');
		}
	});
});
