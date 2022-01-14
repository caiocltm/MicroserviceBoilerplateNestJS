import { ResponseTypeDto } from '@api_gateway';
import { FindAllCustomersDto } from './dto/find-all-customers.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerMicroserviceRepository } from './repository/customer.microservice.repository';
import { Customer } from './schemas/customer.schema';
import { plainToInstance } from 'class-transformer';
import { FindAllCustomersResponseDto } from './dto/find-all-customers-response.dto';
import { DeleteCustomerDto } from './dto/delete-customer.dto';

@Injectable()
export class CustomersMicroserviceService {
	constructor(private customerMicroserviceRepository: CustomerMicroserviceRepository) {}

	async createCustomer(createCustomerDto: CreateCustomerDto): Promise<ResponseTypeDto> {
		const newCustomer = await plainToInstance(CreateCustomerDto, createCustomerDto, {
			enableImplicitConversion: true
		});

		const result = await this.customerMicroserviceRepository.createCustomer(newCustomer);

		const response = new ResponseTypeDto();

		if (result) {
			response.statusCode = HttpStatus.CREATED;
			response.message = `Customer with customer code [${newCustomer.customer_code}] successfully created`;

			return response;
		}

		response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
		response.message = 'Customer not created';

		return response;
	}

	async findAllCustomers(query: FindAllCustomersDto): Promise<FindAllCustomersResponseDto> {
		const findAllCustomersQuery = await plainToInstance(FindAllCustomersDto, query, {
			enableImplicitConversion: true
		});

		return this.customerMicroserviceRepository.findAllCustomers(findAllCustomersQuery);
	}

	async findOneCustomerByCustomerCode(customer_code: number): Promise<Customer> {
		return this.customerMicroserviceRepository.findOneCustomerByCustomerCode(customer_code);
	}

	async updateCustomer(updateCustomerDto: UpdateCustomerDto): Promise<ResponseTypeDto> {
		const customerToUpdate = await plainToInstance(UpdateCustomerDto, updateCustomerDto, {
			enableImplicitConversion: true
		});

		const result = await this.customerMicroserviceRepository.updateCustomer(customerToUpdate);

		const response = new ResponseTypeDto();

		if (result) {
			response.statusCode = HttpStatus.OK;
			response.message = `Customer with customer code [${customerToUpdate.customer_code}] successfully updated`;

			return response;
		}

		response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
		response.message = 'Customer not updated';

		return response;
	}

	async deleteCustomer(deleteCustomerDto: DeleteCustomerDto): Promise<ResponseTypeDto> {
		const customerToDelete = await plainToInstance(DeleteCustomerDto, deleteCustomerDto, {
			enableImplicitConversion: true
		});

		const result = await this.customerMicroserviceRepository.deleteCustomer(customerToDelete);

		const response = new ResponseTypeDto();

		if (result) {
			response.statusCode = HttpStatus.OK;
			response.message = `Customer with customer code [${customerToDelete.customer_code}] and taxvat [${customerToDelete.taxvat}] successfully deleted`;

			return response;
		}

		response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
		response.message = 'Customer not deleted';

		return response;
	}

	async createCustomerBulk(customersToDelete: CreateCustomerDto[]): Promise<void> {
		for (let customer of customersToDelete) {
			customer = await plainToInstance(CreateCustomerDto, customer, { enableImplicitConversion: true });
		}

		await this.customerMicroserviceRepository.createCustomerBulk(customersToDelete);
	}
}
