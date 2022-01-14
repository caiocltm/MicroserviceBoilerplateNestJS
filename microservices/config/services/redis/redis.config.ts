import { MicroserviceName } from '@customer_microservice';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import * as RedisStore from 'cache-manager-redis-store';
import { MicroserviceType } from '../../types/microservice.type';

export class RedisConfig {
	private scheme: string;
	private messageBrokerUrl: string;
	private cacheUrl: string;
	private port: string;
	private transport: Transport.REDIS;
	private envVariables: ConfigService;

	constructor() {
		this.envVariables = new ConfigService();
		this.setVariables();
	}

	public setVariables() {
		this.transport = Transport.REDIS;
		this.scheme = 'redis';
		this.port = this.envVariables.get('REDIS_PLATFORM_URL').split('//')[1].split(':')[1];
		this.messageBrokerUrl = this.envVariables.get('REDIS_PLATFORM_URL');
		this.cacheUrl = this.envVariables.get('REDIS_PLATFORM_URL').split('//')[1].split(':')[0];
	}

	public getMessageBrokerUrl(): string {
		return this.messageBrokerUrl;
	}

	public getCacheUrl(): string {
		return this.cacheUrl;
	}

	public getPort(): string {
		return this.port;
	}

	public getScheme(): string {
		return this.scheme;
	}

	public getTransport(): Transport.REDIS {
		return this.transport;
	}

	public getMessageBrokerOptions(): any {
		return {
			transport: this.transport,
			options: {
				url: this.messageBrokerUrl,
				retryAttempts: Number(this.envVariables.get('REDIS_RETRY_ATTEMPTS')),
				retryDelay: Number(this.envVariables.get('REDIS_RETRY_DELAY'))
			}
		};
	}

	public getCacheOptions(microservice?: MicroserviceType): any {
		const cacheOptions = {
			[MicroserviceName.CUSTOMERS]: () => ({
				ttl: Number(this.envVariables.get('CUSTOMER_MICROSERVICE_TOKEN_CACHE_TTL')),
				max: Number(this.envVariables.get('CUSTOMER_MICROSERVICE_TOKEN_CACHE_MAX')),
				store: RedisStore,
				host: this.cacheUrl,
				port: this.port
			}),

			default: () => ({
				ttl: 3600000,
				max: 1,
				store: RedisStore,
				host: this.cacheUrl,
				port: this.port
			})
		};

		return microservice in cacheOptions ? cacheOptions[microservice]() : cacheOptions['default']();
	}
}
