import { MicroserviceName } from '@customer_microservice';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { RabbitMQConfig } from '../services/rabbitmq/rabbitmq.config';

describe('RabbitMQ Config', () => {
	let rabbitMqConfig: RabbitMQConfig;
	let configService: ConfigService = new ConfigService();

	it(`should get RabbitMQ connection options for ${MicroserviceName.CUSTOMERS} queue`, () => {
		jest.spyOn(configService, 'get').mockImplementation((name) => {
			const variables: any = {
				RMQ_QUEUE_ACK_CONFIG: 'false',
				RMQ_PERSISTENT_CONFIG: 'true',
				RMQ_QUEUE_DURABLE_CONFIG: 'true',
				RMQ_CONNECTION_URL: 'amqp://unittest:6666',
				CUSTOMER_MICROSERVICE_PREFETCH_COUNT: '1'
			};

			return variables[name];
		});

		rabbitMqConfig = new RabbitMQConfig(configService);

		const expected: any = {
			transport: Transport.RMQ,
			options: {
				urls: ['amqp://unittest:6666'],
				queue: MicroserviceName.CUSTOMERS,
				noAck: false,
				prefetchCount: 1,
				persistent: true,
				queueOptions: {
					durable: true,
					arguments: {
						'x-queue-mode': 'lazy'
					}
				}
			}
		};

		expect(rabbitMqConfig.getOptions(MicroserviceName.CUSTOMERS)).toEqual(expected);
	});

	it(`should get RabbitMQ connection options for ${MicroserviceName.CUSTOMERS} queue`, () => {
		jest.spyOn(configService, 'get').mockImplementation((name) => {
			const variables: any = {
				RMQ_QUEUE_ACK_CONFIG: 'true',
				RMQ_PERSISTENT_CONFIG: 'false',
				RMQ_QUEUE_DURABLE_CONFIG: 'false',
				RMQ_CONNECTION_URL: 'amqp://unittest:6666',
				CUSTOMER_MICROSERVICE_PREFETCH_COUNT: '1'
			};

			return variables[name];
		});

		rabbitMqConfig = new RabbitMQConfig(configService);

		const expected: any = {
			transport: Transport.RMQ,
			options: {
				urls: ['amqp://unittest:6666'],
				queue: MicroserviceName.CUSTOMERS,
				noAck: true,
				prefetchCount: 1,
				persistent: false,
				queueOptions: {
					durable: false,
					arguments: {
						'x-queue-mode': 'lazy'
					}
				}
			}
		};

		expect(rabbitMqConfig.getOptions(MicroserviceName.CUSTOMERS)).toEqual(expected);
	});
});
