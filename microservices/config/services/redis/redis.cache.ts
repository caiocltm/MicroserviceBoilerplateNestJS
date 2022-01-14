import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
	constructor(private configService: ConfigService, @Inject(CACHE_MANAGER) private cache: Cache) {}

	public async retryOperation(operationCacheKey: string, ttl = 300): Promise<boolean> {
		let retryAttempts = await this.getCacheByKey(operationCacheKey);
		const maxNumberOfRetries = Number(this.configService.get('NACK_RETRY_ATEMPTS'));

		retryAttempts = Number(retryAttempts) ? Number(retryAttempts) : 1;

		if (retryAttempts === maxNumberOfRetries) {
			await this.deleteCache(operationCacheKey);
			return false;
		}

		await this.setCache(operationCacheKey, String(retryAttempts + 1), ttl);

		return true;
	}

	public async deleteCache(key: string): Promise<void> {
		await this.cache.del(key);
	}

	public async setCache(key: string, value: any, ttl = null): Promise<void> {
		await this.cache.set(key, value, { ttl });
	}

	public async getCacheByKey(key: string): Promise<any> {
		return this.cache.get(key);
	}
}
