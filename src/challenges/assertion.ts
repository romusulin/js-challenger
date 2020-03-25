import { expect } from 'chai';

export enum ASSERT_OPERATIONS {
	EQUALS = 'equals'
};

export const ASSERTION_FUNCTIONS = {
	[ASSERT_OPERATIONS.EQUALS]: (func: any, input: any[], output: any): void => {
		try {
			expect(func.call(undefined, ...input)).to.equal(output);
		} catch (err) {
			throw new Error(`Test execution failed: Calling the function with "${JSON.stringify(input)}" does not equal "${JSON.stringify(output)}"`);
		}
	}
}
