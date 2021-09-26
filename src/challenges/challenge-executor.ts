import { VM } from 'vm2';
import { TestCase } from './test-case';
import { ASSERTION_FUNCTIONS } from './assertion';
import { Challenge } from '../db/models';

export enum KEYWORDS {
	RESERVED_FUNCTION_NAME = 'solution'
}

export interface ExecutionResult {
	challengeId: number;
	isSuccess: boolean;
	error?: Error;
}

export function executeChallenge(userCode: string, challenge: Pick<Challenge, 'id' | 'test'>) {
	const parsedTestCases: TestCase[] = JSON.parse(challenge.test);
	const vmOptions = {
		timeout: 1000,
		external: false,
		fixAsync: true,
		sandbox: {
			assertTestCases: assertTestCases
		}
	};

	const vm = new VM(vmOptions);
	const testCode = `assertTestCases(${KEYWORDS.RESERVED_FUNCTION_NAME}, ${JSON.stringify(parsedTestCases)});`;
	const fullCode = [ userCode, testCode ].join('\n');

	let result: ExecutionResult = {
		challengeId: challenge.id,
		isSuccess: true
	};
	try {
		vm.run(fullCode);
	} catch (err) {
		result.isSuccess = false;
		result.error = err;

	}

	return result;
}

function assertTestCases(func: any, testCases: TestCase[]): void {
	if (func === undefined) {
		throw new Error('Passed function was undefined');
	}

	for (const testCase of testCases) {
		const assertionFunction: Function = ASSERTION_FUNCTIONS[testCase.operation];
		assertionFunction(func, testCase.input, testCase.output);
	}
}
