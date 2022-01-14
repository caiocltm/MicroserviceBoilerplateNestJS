import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import {
	CreateCustomerDto,
	Customer,
	DeleteCustomerDto,
	FindAllCustomersDto,
	FindAllCustomersResponseDto,
	UpdateCustomerDto
} from '@customer_microservice';
import { CustomersMicroserviceService } from '../src/customers.microservice.service';
import { ResponseTypeDto } from '@api_gateway';
import { CustomerMicroserviceRepository } from '../src/repository/customer.microservice.repository';
import { ConfigModule } from '@nestjs/config';

export const CustomerMicroserviceRepositoryMock = jest.fn(() => ({
	createCustomer: jest.fn().mockResolvedValue(undefined),
	customerAlreadyExists: jest.fn().mockResolvedValue(undefined),
	customersAlreadyExists: jest.fn().mockResolvedValue(undefined),
	findAllCustomers: jest.fn().mockResolvedValue(undefined),
	countAllCustomers: jest.fn().mockResolvedValue(undefined),
	findAllCustomerByPage: jest.fn().mockResolvedValue(undefined),
	findOneCustomerByCustomerCode: jest.fn().mockResolvedValue(undefined),
	updateCustomer: jest.fn().mockResolvedValue(undefined),
	deleteCustomer: jest.fn().mockResolvedValue(undefined),
	createCustomerBulk: jest.fn().mockResolvedValue(undefined)
}));

jest.mock('class-transformer')
	.fn()
	.mockImplementation(() => {
		return {
			plainToInstance: jest.fn().mockImplementation((value) => Promise.resolve(value))
		};
	});

describe('CustomersMicroserviceService', () => {
	let app: TestingModule;
	let customersMicroserviceService: CustomersMicroserviceService;
	let customerMicroserviceRepository: CustomerMicroserviceRepository;

	beforeEach(async () => {
		app = await Test.createTestingModule({
			imports: [ConfigModule.forRoot()],
			controllers: [],
			providers: [
				CustomersMicroserviceService,
				{
					provide: CustomerMicroserviceRepository,
					useClass: CustomerMicroserviceRepositoryMock
				}
			]
		}).compile();

		customersMicroserviceService = app.get<CustomersMicroserviceService>(CustomersMicroserviceService);
		customerMicroserviceRepository = app.get<CustomerMicroserviceRepository>(CustomerMicroserviceRepository);
	});

	describe('createCustomer', () => {
		it('should create new customer and return an ResponseTypeDto class instance', async () => {
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

			const expectedForCreateCustomerRepository: boolean = true;
			const expectedForCreateCustomerService: ResponseTypeDto = new ResponseTypeDto();

			expectedForCreateCustomerService.statusCode = HttpStatus.CREATED;
			expectedForCreateCustomerService.message = 'Customer with customer code [6899] successfully created';

			jest.spyOn(customerMicroserviceRepository, 'createCustomer').mockResolvedValue(
				expectedForCreateCustomerRepository
			);

			const result = await customersMicroserviceService.createCustomer(body);

			expect(result).toBeInstanceOf(ResponseTypeDto);
			expect(result).toEqual(expectedForCreateCustomerService);
		});

		it('should not create new customer and return an ResponseTypeDto class instance', async () => {
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

			const expectedForCreateCustomerRepository: boolean = false;
			const expectedForCreateCustomerService: ResponseTypeDto = new ResponseTypeDto();

			expectedForCreateCustomerService.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
			expectedForCreateCustomerService.message = 'Customer not created';

			jest.spyOn(customerMicroserviceRepository, 'createCustomer').mockResolvedValue(
				expectedForCreateCustomerRepository
			);

			const result = await customersMicroserviceService.createCustomer(body);

			expect(result).toBeInstanceOf(ResponseTypeDto);
			expect(result).toEqual(expectedForCreateCustomerService);
		});
	});

	describe('findAllCustomers', () => {
		it('should find all customers given a page number and limit per page', async () => {
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

			jest.spyOn(customerMicroserviceRepository, 'findAllCustomers').mockResolvedValue(expected);

			const result = await customersMicroserviceService.findAllCustomers(query);

			expect(result).toBeInstanceOf(FindAllCustomersResponseDto);
			expect(result).toEqual(expected);
		});
	});

	describe('findOneCustomerByCustomerCode', () => {
		it('should find one customer given customer code number', async () => {
			const param = 6899;

			const expected: Customer = {
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

			jest.spyOn(customerMicroserviceRepository, 'findOneCustomerByCustomerCode').mockResolvedValue(expected);

			const result = await customersMicroserviceService.findOneCustomerByCustomerCode(param);

			expect(result).toEqual(expected);
		});
	});

	describe('updateCustomer', () => {
		it('should update one customer given body data', async () => {
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

			const expectedForUpdateCustomerRepository: boolean = true;
			const expectedForUpdateCustomerService: ResponseTypeDto = new ResponseTypeDto();

			expectedForUpdateCustomerService.statusCode = HttpStatus.OK;
			expectedForUpdateCustomerService.message = 'Customer with customer code [6899] successfully updated';

			jest.spyOn(customerMicroserviceRepository, 'updateCustomer').mockResolvedValue(
				expectedForUpdateCustomerRepository
			);

			const result = await customersMicroserviceService.updateCustomer(body);

			expect(result).toBeInstanceOf(ResponseTypeDto);
			expect(result).toEqual(expectedForUpdateCustomerService);
		});

		it('should not update one customer given body data', async () => {
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

			const expectedForUpdateCustomerRepository: boolean = false;
			const expectedForUpdateCustomerService: ResponseTypeDto = new ResponseTypeDto();

			expectedForUpdateCustomerService.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
			expectedForUpdateCustomerService.message = 'Customer not updated';

			jest.spyOn(customerMicroserviceRepository, 'updateCustomer').mockResolvedValue(
				expectedForUpdateCustomerRepository
			);

			const result = await customersMicroserviceService.updateCustomer(body);

			expect(result).toBeInstanceOf(ResponseTypeDto);
			expect(result).toEqual(expectedForUpdateCustomerService);
		});
	});

	describe('deleteCustomer', () => {
		it('should deletes one customer given customer code number and taxvat number', async () => {
			const query = new DeleteCustomerDto();

			query.customer_code = 6899;
			query.taxvat = '54528658000115';

			const expectedForDeleteCustomerRepository: boolean = true;
			const expectedForDeleteCustomerService: ResponseTypeDto = new ResponseTypeDto();

			expectedForDeleteCustomerService.statusCode = HttpStatus.OK;
			expectedForDeleteCustomerService.message =
				'Customer with customer code [6899] and taxvat [54528658000115] successfully deleted';

			jest.spyOn(customerMicroserviceRepository, 'deleteCustomer').mockResolvedValue(
				expectedForDeleteCustomerRepository
			);

			const result = await customersMicroserviceService.deleteCustomer(query);

			expect(result).toBeInstanceOf(ResponseTypeDto);
			expect(result).toEqual(expectedForDeleteCustomerService);
		});

		it('should not delete one customer given customer code number and taxvat number', async () => {
			const query = new DeleteCustomerDto();

			query.customer_code = 6899;
			query.taxvat = '54528658000115';

			const expectedForDeleteCustomerRepository: boolean = false;
			const expectedForDeleteCustomerService: ResponseTypeDto = new ResponseTypeDto();

			expectedForDeleteCustomerService.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
			expectedForDeleteCustomerService.message = 'Customer not deleted';

			jest.spyOn(customerMicroserviceRepository, 'deleteCustomer').mockResolvedValue(
				expectedForDeleteCustomerRepository
			);

			const result = await customersMicroserviceService.deleteCustomer(query);

			expect(result).toBeInstanceOf(ResponseTypeDto);
			expect(result).toEqual(expectedForDeleteCustomerService);
		});
	});

	describe('createCustomerBulk', () => {
		it('should create customers in bulk operation', async () => {
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

			jest.spyOn(customerMicroserviceRepository, 'createCustomerBulk').mockResolvedValue(undefined);

			const result = await customersMicroserviceService.createCustomerBulk(bulkData);

			expect(result).toBeUndefined();
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
