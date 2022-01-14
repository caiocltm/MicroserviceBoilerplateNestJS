// jest.config.ts
import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
	cache: false,
	clearMocks: true,
	coveragePathIgnorePatterns: ['dto.ts', 'schema.ts', 'module.ts'],
	coverageThreshold: {
		global: {
			branches: 100,
			functions: 100,
			lines: 100,
			statements: 100
		}
	},
	setupFiles: ['dotenv/config'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest'
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@api_gateway': ['<rootDir>/api_gateway/index'],
		'^@microservices_config': ['<rootDir>/microservices/config/index'],
		'^@customer_microservice': ['<rootDir>/microservices/customers/index'],
		'^@cli': ['<rootDir>/cli/index'],
		'^@common': ['<rootDir>/common/index']
	},
	coverageDirectory: './coverage',
	roots: [
		'api_gateway/tests',
		'cli/tests',
		'microservices/config/tests',
		'microservices/customers/tests',
		'common/filters/tests'
	],
	displayName: {
		name: 'Microservices Tests',
		color: 'blue'
	}
};

export default config;
