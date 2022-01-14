require('module-alias/register');
import { NestFactory } from '@nestjs/core';
import { MicroserviceCustomersModule } from './src/customers.microservice.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { RabbitMQConfig } from '@microservices_config';
import { MicroserviceName } from './src/enum/customers.microservice.enum';
import { MicroserviceExceptionFilter } from '@common';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const rabbitMqConfig = new RabbitMQConfig(configService);

(async () => {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		MicroserviceCustomersModule,
		rabbitMqConfig.getOptions(MicroserviceName.CUSTOMERS)
	);

	app.useGlobalFilters(new MicroserviceExceptionFilter());

	await app.listen();
})();
