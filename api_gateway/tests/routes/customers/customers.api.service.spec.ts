import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersAPIController } from '../../../src/routes/customers/customers.api.controller';
import { CustomersAPIService } from '../../../src/routes/customers/customers.api.service';
import { ResponseTypeDto } from '../../../src/dto/response-type.dto';
import { HttpStatus } from '@nestjs/common';
import {
	CreateCustomerDto,
	Customer,
	DeleteCustomerDto,
	FindAllCustomersDto,
	FindAllCustomersResponseDto,
	MicroserviceName,
	UpdateCustomerDto
} from '@customer_microservice';
import { Observable, of } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

export const RabbitMQServiceMock = jest.fn(() => ({
	emit: jest.fn().mockReturnValue(null),
	send: jest.fn().mockReturnValue(of())
}));

describe('CustomersAPIService', () => {
	let app: TestingModule;
	let customersAPIService: CustomersAPIService;
	let configService: ConfigService;
	let clientProxy: ClientProxy;

	beforeEach(async () => {
		app = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot(),
				PassportModule.register({ defaultStrategy: 'jwt' }),
				JwtModule.register({
					secret: 'a9s9df9sd5f9sd5f9sdasd',
					signOptions: {
						expiresIn: Number('5000')
					}
				})
			],
			controllers: [CustomersAPIController],
			providers: [
				CustomersAPIService,
				{
					provide: MicroserviceName.CUSTOMERS,
					useClass: RabbitMQServiceMock
				},
				{
					provide: ClientProxy,
					useClass: RabbitMQServiceMock
				}
			]
		}).compile();

		customersAPIService = app.get<CustomersAPIService>(CustomersAPIService);
		configService = app.get<ConfigService>(ConfigService);
		clientProxy = app.get<ClientProxy>(ClientProxy);
	});

	describe('createCustomer', () => {
		it('should create a new customer given body', (done: any) => {
			const body = new CreateCustomerDto();

			body.customer_code = 6899;
			body.name = 'Caio Cesar';
			body.taxvat = '54528658000115';
			body.address = {
				street: 'Rua do Teste Unitario',
				number: '458',
				complement: 'AP 11 Bloco V',
				district: 'PéGrande',
				city: 'Santos',
				postal_code: '11455559',
				uf: 'SP',
				country: 'Brasil'
			};

			const expected: ResponseTypeDto = new ResponseTypeDto();

			expected.statusCode = HttpStatus.CREATED;
			expected.message = 'Customer with customer code [6899] successfully created';

			const observable = of(expected); // Example here

			jest.spyOn(clientProxy, 'send').mockReturnValue(observable);

			const result = customersAPIService.createCustomer(body);

			result.subscribe({
				next: (value) => {
					expect(value).toBe(expected);
				},
				complete: () => {
					done();
				}
			});

			expect(result).toBeInstanceOf(Observable);
		});
	});

	describe('findAllCustomers', () => {
		it('should find all customers given a page number and limit per page', (done: any) => {
			const query = new FindAllCustomersDto();

			query.page = 1;
			query.limit = 50;

			const expected: FindAllCustomersResponseDto = new FindAllCustomersResponseDto();

			expected.customers = [
				{
					customer_code: 6899,
					name: 'Caio Cesar',
					taxvat: '54528658000115',
					address: {
						street: 'Rua do Teste Unitario',
						number: '458',
						complement: 'AP 11 Bloco V',
						district: 'PéGrande',
						city: 'Santos',
						postal_code: '11455559',
						uf: 'SP',
						country: 'Brasil'
					}
				}
			];
			expected.total_count = 1;
			expected.page_info = {
				current_page: query.page,
				page_size: query.limit,
				total_pages: 1
			};

			const observable = of(expected); // Example here

			jest.spyOn(clientProxy, 'send').mockReturnValue(observable);

			const result = customersAPIService.findAllCustomers(query);

			result.subscribe({
				next: (value) => {
					expect(value).toBe(expected);
				},
				complete: () => {
					done();
				}
			});

			expect(result).toBeInstanceOf(Observable);
		});
	});

	describe('findOneCustomerByCustomerCode', () => {
		it('should find one customer given customer code number', (done: any) => {
			const param = 6899;

			const expected: Partial<Customer> = {
				customer_code: 6899,
				name: 'Caio Cesar',
				taxvat: '54528658000115',
				address: {
					street: 'Rua do Teste Unitario',
					number: '458',
					complement: 'AP 11 Bloco V',
					district: 'PéGrande',
					city: 'Santos',
					postal_code: '11455559',
					uf: 'SP',
					country: 'Brasil'
				}
			};

			const observable = of(expected); // Example here

			jest.spyOn(clientProxy, 'send').mockReturnValue(observable);

			const result = customersAPIService.findOneCustomerByCustomerCode(param);

			result.subscribe({
				next: (value) => {
					expect(value).toBe(expected);
				},
				complete: () => {
					done();
				}
			});

			expect(result).toBeInstanceOf(Observable);
		});
	});

	describe('updateCustomer', () => {
		it('should updates one customer given body data', (done: any) => {
			const body = new UpdateCustomerDto();

			body.customer_code = 6899;
			body.taxvat = '54528658000115';
			body.address = {
				street: 'Rua do Teste Unitario',
				number: '458',
				complement: 'AP 11 Bloco V',
				district: 'PéGrande',
				city: 'Santos',
				postal_code: '11455559',
				uf: 'SP',
				country: 'Brasil'
			};

			const expected: ResponseTypeDto = new ResponseTypeDto();

			expected.statusCode = HttpStatus.OK;
			expected.message = 'Customer with customer code [6899] successfully updated';

			const observable = of(expected); // Example here

			jest.spyOn(clientProxy, 'send').mockReturnValue(observable);

			const result = customersAPIService.updateCustomer(body);

			result.subscribe({
				next: (value) => {
					expect(value).toBe(expected);
				},
				complete: () => {
					done();
				}
			});

			expect(result).toBeInstanceOf(Observable);
		});
	});

	describe('deleteCustomer', () => {
		it('should deletes one customer given customer code number and taxvat number', (done: any) => {
			const query = new DeleteCustomerDto();

			query.customer_code = 6899;
			query.taxvat = '54528658000115';

			const expected: ResponseTypeDto = new ResponseTypeDto();

			expected.statusCode = HttpStatus.OK;
			expected.message = 'Customer with customer code [6899] and taxvat [54528658000115] successfully deleted';

			const observable = of(expected); // Example here

			jest.spyOn(clientProxy, 'send').mockReturnValue(observable);

			const result = customersAPIService.deleteCustomer(query);

			result.subscribe({
				next: (value) => {
					expect(value).toBe(expected);
				},
				complete: () => {
					done();
				}
			});

			expect(result).toBeInstanceOf(Observable);
		});
	});

	describe('createCustomerBulk', () => {
		it('should create customers in bulk operation', () => {
			const bulkData: CreateCustomerDto[] = [
				{
					customer_code: 6899,
					name: 'Nome 1',
					taxvat: '54528658000115',
					address: {
						street: 'Rua do Teste Unitario',
						number: '458',
						complement: 'AP 11 Bloco V',
						district: 'PéGrande',
						city: 'Santos',
						postal_code: '11455559',
						uf: 'SP',
						country: 'Brasil'
					}
				},
				{
					customer_code: 6900,
					name: 'Nome 2',
					taxvat: '54528658000116',
					address: {
						street: 'Rua do Teste',
						number: '458',
						complement: 'AP 11 Bloco G',
						district: 'Pé Grande',
						city: 'Ouro Preto',
						postal_code: '11455449',
						uf: 'MG',
						country: 'Brasil'
					}
				}
			];

			const expected: ResponseTypeDto = new ResponseTypeDto();

			expected.statusCode = HttpStatus.CREATED;
			expected.message = 'Successfully processed and sent [2] customers to queue';

			jest.spyOn(clientProxy, 'emit').mockReturnValue(null);
			jest.spyOn(configService, 'get').mockReturnValue('1000');

			const result = customersAPIService.createCustomerBulk(bulkData);

			expect(result).toEqual(expected);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
