/* eslint-disable @typescript-eslint/no-var-requires */
import { MicroserviceName } from '@customer_microservice';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { MicroserviceType } from '../../types/microservice.type';

export class RabbitMQConfig {
	private url: string;
	private transport: Transport.RMQ;
	private prefetchCount: number;
	private queue: string;
	private noAck: boolean;
	private persistent: boolean;
	private durable: boolean;
	private arguments: any = {};

	constructor(private configService: ConfigService) {
		this.setVariables();
	}

	public setVariables(): void {
		this.transport = Transport.RMQ;

		this.noAck =
			this.configService.get('RMQ_QUEUE_ACK_CONFIG') && this.configService.get('RMQ_QUEUE_ACK_CONFIG') === 'true'
				? true
				: false;

		this.persistent =
			this.configService.get('RMQ_PERSISTENT_CONFIG') &&
			this.configService.get('RMQ_PERSISTENT_CONFIG') === 'true'
				? true
				: false;

		this.durable =
			this.configService.get('RMQ_QUEUE_DURABLE_CONFIG') &&
			this.configService.get('RMQ_QUEUE_DURABLE_CONFIG') === 'true'
				? true
				: false;

		this.url = this.configService.get('RMQ_CONNECTION_URL');
	}

	public getOptions(microservice: MicroserviceType): any {
		const microserviceQueues = {
			[MicroserviceName.CUSTOMERS]: () => {
				this.queue = MicroserviceName.CUSTOMERS;
				this.prefetchCount = Number(this.configService.get('CUSTOMER_MICROSERVICE_PREFETCH_COUNT'));
				this.arguments = {
					'x-queue-mode': 'lazy'
				};
			}
		};

		microservice in microserviceQueues && microserviceQueues[microservice]();

		return {
			transport: this.transport,
			options: {
				urls: [this.url],
				queue: this.queue,
				prefetchCount: this.prefetchCount,
				noAck: this.noAck,
				persistent: this.persistent,
				queueOptions: {
					durable: this.durable,
					arguments: this.arguments
				}
			}
		};
	}
}
