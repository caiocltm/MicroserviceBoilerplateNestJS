import { MicroserviceType } from '../../types/microservice.type';
import { CacheModule, DynamicModule, Module } from '@nestjs/common';
import { RedisCacheService } from './redis.cache';
import { RedisConfig } from './redis.config';
import { ConfigModule } from '@nestjs/config';

const redisConfig = new RedisConfig();

@Module({})
export class RedisModule {
	static register(microservice: MicroserviceType): DynamicModule {
		return {
			module: RedisModule,
			imports: [ConfigModule.forRoot(), CacheModule.register(redisConfig.getCacheOptions(microservice))],
			providers: [RedisConfig, RedisCacheService],
			exports: [RedisCacheService]
		};
	}
}
