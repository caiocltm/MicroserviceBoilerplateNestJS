import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from '../services/redis/redis.cache';

export const CacheServiceMock: any = {
	get: jest.fn().mockImplementation(() => Promise.resolve('test')),
	set: jest.fn().mockImplementation(() => Promise.resolve()),
	del: jest.fn().mockImplementation(() => Promise.resolve())
};

describe('Redis Cache Service', () => {
	let redisCacheService: RedisCacheService;
	let configService: ConfigService;

	beforeEach(() => {
		configService = new ConfigService();

		redisCacheService = new RedisCacheService(configService, CacheServiceMock);
	});

	describe('retryOperation', () => {
		it('should retry operation given operation with default TTL', async () => {
			jest.spyOn(redisCacheService, 'getCacheByKey').mockImplementation(() => Promise.resolve(''));
			jest.spyOn(redisCacheService, 'setCache').mockImplementation(() => Promise.resolve());
			jest.spyOn(configService, 'get').mockReturnValue('3');

			expect(await redisCacheService.retryOperation('create')).toBeTruthy();
		});

		it('should retry operation given operation with default TTL', async () => {
			jest.spyOn(redisCacheService, 'getCacheByKey').mockImplementation(() => Promise.resolve('1'));
			jest.spyOn(redisCacheService, 'setCache').mockImplementation(() => Promise.resolve());
			jest.spyOn(configService, 'get').mockReturnValue('3');

			expect(await redisCacheService.retryOperation('create')).toBeTruthy();
		});

		it('should retry operation given operation and TTL cache key', async () => {
			jest.spyOn(redisCacheService, 'getCacheByKey').mockImplementation(() => Promise.resolve('1'));
			jest.spyOn(redisCacheService, 'setCache').mockImplementation(() => Promise.resolve());
			jest.spyOn(configService, 'get').mockReturnValue('3');

			expect(await redisCacheService.retryOperation('create', 8600)).toBeTruthy();
		});

		it('should not retry operation given operation with default TTL, maximum retry attempts reached', async () => {
			jest.spyOn(redisCacheService, 'getCacheByKey').mockImplementation(() => Promise.resolve('3'));
			jest.spyOn(redisCacheService, 'deleteCache').mockImplementation(() => Promise.resolve());
			jest.spyOn(configService, 'get').mockReturnValue('3');

			expect(await redisCacheService.retryOperation('create')).toBeFalsy();
		});

		it('should not retry operation given operation, TTL cache key and maximum retry attempts reached', async () => {
			jest.spyOn(redisCacheService, 'getCacheByKey').mockImplementation(() => Promise.resolve('3'));
			jest.spyOn(redisCacheService, 'deleteCache').mockImplementation(() => Promise.resolve());
			jest.spyOn(configService, 'get').mockReturnValue('3');

			expect(await redisCacheService.retryOperation('create', 8600)).toBeFalsy();
		});
	});

	it('should get cached data by key', async () => {
		expect(await redisCacheService.getCacheByKey('test')).toEqual('test');
	});

	it('should set cache data', async () => {
		expect(await redisCacheService.setCache('test', 'test')).toBeUndefined();
	});

	it('should del cached data by key', async () => {
		expect(await redisCacheService.deleteCache('test')).toBeUndefined();
	});
});
