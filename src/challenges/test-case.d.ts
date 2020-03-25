import { ASSERT_OPERATIONS } from './assertion';

export interface TestCase {
	input: any[],
	output: any,
	operation: ASSERT_OPERATIONS
}
