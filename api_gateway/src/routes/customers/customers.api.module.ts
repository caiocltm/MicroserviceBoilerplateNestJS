import { MicroserviceName } from '@customer_microservice';
import { RabbitMQModule } from '@microservices_config';
import { Module } from '@nestjs/common';
import { CustomersAPIController } from './customers.api.controller';
import { CustomersAPIService } from './customers.api.service';

@Module({
	imports: [RabbitMQModule.register(MicroserviceName.CUSTOMERS)],
	controllers: [CustomersAPIController],
	providers: [CustomersAPIService]
})
export class CustomersAPIModule {}
