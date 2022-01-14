import { Module } from '@nestjs/common';
import { CustomersMicroserviceService } from './customers.microservice.service';
import { CustomersMicroserviceController } from './customers.microservice.controller';
import { ConfigModule } from '@nestjs/config';
import { MongoDBModule, RabbitMQModule, RedisModule } from '@microservices_config';
import { MicroserviceName } from './enum/customers.microservice.enum';
import { CustomerMicroserviceRepository } from './repository/customer.microservice.repository';
import MicroserviceCustomersSchemas from './schemas/microservice-customers.schemas';

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongoDBModule.register(MicroserviceName.CUSTOMERS, MicroserviceCustomersSchemas),
		RabbitMQModule.register(MicroserviceName.CUSTOMERS),
		RedisModule.register(MicroserviceName.CUSTOMERS)
	],
	controllers: [CustomersMicroserviceController],
	providers: [CustomersMicroserviceService, CustomerMicroserviceRepository]
})
export class MicroserviceCustomersModule {}
