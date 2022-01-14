import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { ResponseTypeDto } from '@api_gateway';
import { CustomersMicroserviceService } from './customers.microservice.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FindAllCustomersDto } from './dto/find-all-customers.dto';
import { CustomersMicroservicePatterns } from './enum/customers.microservice.enum';
import { Customer } from './schemas/customer.schema';
import { FindAllCustomersResponseDto } from './dto/find-all-customers-response.dto';
import { DeleteCustomerDto } from './dto/delete-customer.dto';

@Controller()
export class CustomersMicroserviceController {
	constructor(private customersMicroserviceService: CustomersMicroserviceService) {}

	@MessagePattern(CustomersMicroservicePatterns.CREATE_CUSTOMER)
	async createCustomer(
		@Payload() createCustomerDto: CreateCustomerDto,
		@Ctx() context: RmqContext
	): Promise<ResponseTypeDto> {
		const response = await this.customersMicroserviceService.createCustomer(createCustomerDto);
		const channel = context.getChannelRef();
		const message = context.getMessage();

		channel.ack(message);

		return response;
	}

	@MessagePattern(CustomersMicroservicePatterns.FIND_ALL_CUSTOMERS)
	async findAllCustomers(
		@Payload() query: FindAllCustomersDto,
		@Ctx() context: RmqContext
	): Promise<FindAllCustomersResponseDto> {
		const response = await this.customersMicroserviceService.findAllCustomers(query);
		const channel = context.getChannelRef();
		const message = context.getMessage();

		channel.ack(message);

		return response;
	}

	@MessagePattern(CustomersMicroservicePatterns.FIND_ONE_CUSTOMER_BY_CUSTOMER_CODE)
	async findOneCustomerByCustomerCode(
		@Payload() customer_code: number,
		@Ctx() context: RmqContext
	): Promise<Customer> {
		const response = await this.customersMicroserviceService.findOneCustomerByCustomerCode(customer_code);
		const channel = context.getChannelRef();
		const message = context.getMessage();

		channel.ack(message);

		return response;
	}

	@MessagePattern(CustomersMicroservicePatterns.UPDATE_CUSTOMER)
	async updateCustomer(
		@Payload() updateCustomerDto: UpdateCustomerDto,
		@Ctx() context: RmqContext
	): Promise<ResponseTypeDto> {
		const response = await this.customersMicroserviceService.updateCustomer(updateCustomerDto);
		const channel = context.getChannelRef();
		const message = context.getMessage();

		channel.ack(message);

		return response;
	}

	@MessagePattern(CustomersMicroservicePatterns.DELETE_CUSTOMER)
	async deleteCustomer(
		@Payload() deleteCustomerDto: DeleteCustomerDto,
		@Ctx() context: RmqContext
	): Promise<ResponseTypeDto> {
		const response = await this.customersMicroserviceService.deleteCustomer(deleteCustomerDto);
		const channel = context.getChannelRef();
		const message = context.getMessage();

		channel.ack(message);

		return response;
	}

	@EventPattern(CustomersMicroservicePatterns.CREATE_CUSTOMER_BULK)
	async createCustomerBulk(
		@Payload() customersToCreate: CreateCustomerDto[],
		@Ctx() context: RmqContext
	): Promise<void> {
		await this.customersMicroserviceService.createCustomerBulk(customersToCreate);
		const channel = context.getChannelRef();
		const message = context.getMessage();

		channel.ack(message);
	}
}
