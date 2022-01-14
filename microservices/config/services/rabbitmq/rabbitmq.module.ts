import { MicroserviceType } from '../../types/microservice.type';
import { DynamicModule, Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { RabbitMQConfig } from './rabbitmq.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({})
export class RabbitMQModule {
	static register(microservice: MicroserviceType): DynamicModule {
		return {
			module: RabbitMQModule,
			imports: [ConfigModule.forRoot()],
			providers: [
				{
					provide: microservice,
					useFactory: (rabbitMqConfig: RabbitMQConfig, configService: ConfigService) => {
						configService = new ConfigService();
						rabbitMqConfig = new RabbitMQConfig(configService);
						return ClientProxyFactory.create(rabbitMqConfig.getOptions(microservice));
					}
				}
			],
			exports: [
				{
					provide: microservice,
					useFactory: (rabbitMqConfig: RabbitMQConfig, configService: ConfigService) => {
						configService = new ConfigService();
						rabbitMqConfig = new RabbitMQConfig(configService);
						return ClientProxyFactory.create(rabbitMqConfig.getOptions(microservice));
					}
				}
			]
		};
	}
}
