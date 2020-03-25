import { VM } from 'vm2';
import { TestCase } from './test-case';
import { ASSERTION_FUNCTIONS } from './assertion';

export enum KEYWORDS {
	RESERVED_FUNCTION_NAME = 'solution'
}

export function executeChallenge(userCode: string, testCases: TestCase[]) {
	const vmOptions = {
		timeout: 1000,
		external: false,
		sandbox: {
			assertTestCases: assertTestCases
		}
	};

	const vm = new VM(vmOptions);
	const testCode = `assertTestCases(${KEYWORDS.RESERVED_FUNCTION_NAME}, ${JSON.stringify(testCases)});`;
	const fullCode = [ userCode, testCode ].join('\n');

	vm.run(fullCode);
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
