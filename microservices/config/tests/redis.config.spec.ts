import { Transport } from '@nestjs/microservices';
import { MicroserviceName } from '@customer_microservice';
import { RedisConfig } from '../services/redis/redis.config';

describe('Redis Config', () => {
	let redisConfig: RedisConfig;

	const oldProcessEnv = Object.assign({}, process.env);

	process.env.REDIS_PLATFORM_URL = 'redis://666.0.0.1:6666';
	process.env.REDIS_RETRY_ATTEMPTS = '10';
	process.env.REDIS_RETRY_DELAY = '5000';
	process.env.CUSTOMER_MICROSERVICE_TOKEN_CACHE_TTL = '3600000';
	process.env.CUSTOMER_MICROSERVICE_TOKEN_CACHE_MAX = '1';

	beforeEach(() => {
		redisConfig = new RedisConfig();
	});

	it('should get redis cache server url', () => {
		const expected: string = '666.0.0.1';
		expect(redisConfig.getCacheUrl()).toEqual(expected);
	});

	it('should get redis message broker server url', () => {
		const expected: string = 'redis://666.0.0.1:6666';
		expect(redisConfig.getMessageBrokerUrl()).toEqual(expected);
	});

	it('should get redis server port', () => {
		const expected: string = '6666';
		expect(redisConfig.getPort()).toEqual(expected);
	});

	it('should get redis server scheme', () => {
		const expected: string = 'redis';
		expect(redisConfig.getScheme()).toEqual(expected);
	});

	it('should get redis server transport', () => {
		const expected: Transport = Transport.REDIS;
		expect(redisConfig.getTransport()).toEqual(expected);
	});

	it('should get redis server message broker connection options for Flexx third party service', () => {
		const expected: any = {
			transport: Transport.REDIS,
			options: {
				url: 'redis://666.0.0.1:6666',
				retryAttempts: 10,
				retryDelay: 5000
			}
		};

		expect(redisConfig.getMessageBrokerOptions()).toEqual(expected);
	});

	it('should get redis server cache connection options for invalid party service', () => {
		const config: any = redisConfig.getCacheOptions();

		expect(config).toHaveProperty('host');
		expect(config).toHaveProperty('max');
		expect(config).toHaveProperty('port');
		expect(config).toHaveProperty('store');
		expect(config).toHaveProperty('ttl');
	});

	it(`should get redis server cache connection options for ${MicroserviceName.CUSTOMERS} microservice`, () => {
		const config: any = redisConfig.getCacheOptions(MicroserviceName.CUSTOMERS);

		expect(config).toHaveProperty('host');
		expect(config).toHaveProperty('max');
		expect(config).toHaveProperty('port');
		expect(config).toHaveProperty('store');
		expect(config).toHaveProperty('ttl');
	});

	afterAll(() => {
		process.env = oldProcessEnv;
	});
});
