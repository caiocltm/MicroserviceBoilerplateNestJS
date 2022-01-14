import { ResponseTypeDto } from '@api_gateway';
import {
	CreateCustomerDto,
	FindAllCustomersDto,
	MicroserviceName,
	CustomersMicroservicePatterns,
	UpdateCustomerDto,
	FindAllCustomersResponseDto,
	DeleteCustomerDto,
	Customer
} from '@customer_microservice';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class CustomersAPIService {
	constructor(
		@Inject(MicroserviceName.CUSTOMERS) private readonly microserviceCustomers: ClientProxy,
		private readonly configService: ConfigService
	) {}

	createCustomer(body: CreateCustomerDto): Observable<ResponseTypeDto> {
		return this.microserviceCustomers.send(CustomersMicroservicePatterns.CREATE_CUSTOMER, body);
	}

	findAllCustomers(query: FindAllCustomersDto): Observable<FindAllCustomersResponseDto> {
		return this.microserviceCustomers.send(CustomersMicroservicePatterns.FIND_ALL_CUSTOMERS, query);
	}

	findOneCustomerByCustomerCode(customerCode: number): Observable<Partial<Customer>> {
		return this.microserviceCustomers.send(
			CustomersMicroservicePatterns.FIND_ONE_CUSTOMER_BY_CUSTOMER_CODE,
			customerCode
		);
	}

	updateCustomer(body: UpdateCustomerDto): Observable<ResponseTypeDto> {
		return this.microserviceCustomers.send(CustomersMicroservicePatterns.UPDATE_CUSTOMER, body);
	}

	deleteCustomer(deleteCustomerDto: DeleteCustomerDto): Observable<ResponseTypeDto> {
		return this.microserviceCustomers.send(CustomersMicroservicePatterns.DELETE_CUSTOMER, deleteCustomerDto);
	}

	createCustomerBulk(customers: CreateCustomerDto[]): ResponseTypeDto {
		const CREATE_CUSTOMERS_BULK_OFFSET = Number(this.configService.get('CREATE_CUSTOMERS_BULK_OFFSET'));

		for (let i = 1; i <= Math.ceil(customers.length / CREATE_CUSTOMERS_BULK_OFFSET); i++) {
			const customersToCreate = customers.slice(
				(i - 1) * CREATE_CUSTOMERS_BULK_OFFSET,
				i * CREATE_CUSTOMERS_BULK_OFFSET
			);
			this.microserviceCustomers.emit(CustomersMicroservicePatterns.CREATE_CUSTOMER_BULK, customersToCreate);
		}

		const response = new ResponseTypeDto();

		response.statusCode = HttpStatus.CREATED;
		response.message = `Successfully processed and sent [${customers.length}] customers to queue`;

		return response;
	}
}
