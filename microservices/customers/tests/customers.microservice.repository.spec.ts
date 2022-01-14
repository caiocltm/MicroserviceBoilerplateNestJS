import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateCustomerDto } from '../src/dto/create-customer.dto';
import { DeleteCustomerDto } from '../src/dto/delete-customer.dto';
import { FindAllCustomersResponseDto } from '../src/dto/find-all-customers-response.dto';
import { FindAllCustomersDto } from '../src/dto/find-all-customers.dto';
import { UpdateCustomerDto } from '../src/dto/update-customer.dto';
import { CustomerMicroserviceRepository } from '../src/repository/customer.microservice.repository';
import { Customer, CustomerDocument } from '../src/schemas/customer.schema';

describe('CustomerMicroserviceRepository', () => {
	let customerMicroserviceRepository: CustomerMicroserviceRepository;
	let app: TestingModule;
	let customerModel: Model<CustomerDocument>;

	beforeEach(async () => {
		app = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(Customer.name),
					useValue: Model
				},
				CustomerMicroserviceRepository
			]
		}).compile();

		customerModel = app.get<Model<CustomerDocument>>(getModelToken(Customer.name));
		customerMicroserviceRepository = app.get<CustomerMicroserviceRepository>(CustomerMicroserviceRepository);
	});

	describe('createCustomer', () => {
		it('should successfully create a new customer and return true', async () => {
			const newCustomer = new CreateCustomerDto();

			newCustomer.customer_code = 6899;
			newCustomer.name = 'Caio Cesar';
			newCustomer.taxvat = '54528658000115';
			newCustomer.address = {
				street: 'Rua do Teste Unitario',
				number: '458',
				complement: 'AP 11 Bloco V',
				district: 'PéGrande',
				city: 'Santos',
				postal_code: '11455559',
				uf: 'SP',
				country: 'Brasil'
			};

			const expected: boolean = true;

			const expectedForCustomerCreate: any = {
				_id: '595ds9d5a9sd59s5f9sd5f959dsf'
			};

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(false);
			jest.spyOn(customerModel, 'create').mockImplementation(() => Promise.resolve(expectedForCustomerCreate));

			const result = await customerMicroserviceRepository.createCustomer(newCustomer);

			expect(result).toEqual(expected);
		});

		it('should not successfully create a new customer given empty response sent by database and return false', async () => {
			const newCustomer = new CreateCustomerDto();

			newCustomer.customer_code = 6899;
			newCustomer.name = 'Caio Cesar';
			newCustomer.taxvat = '54528658000115';
			newCustomer.address = {
				street: 'Rua do Teste Unitario',
				number: '458',
				complement: 'AP 11 Bloco V',
				district: 'PéGrande',
				city: 'Santos',
				postal_code: '11455559',
				uf: 'SP',
				country: 'Brasil'
			};

			const expected: boolean = false;

			const expectedForCustomerCreate: any = {};

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(false);
			jest.spyOn(customerModel, 'create').mockImplementation(() => Promise.resolve(expectedForCustomerCreate));

			const result = await customerMicroserviceRepository.createCustomer(newCustomer);

			expect(result).toEqual(expected);
		});

		it('should not create a new customer given provided customer already exists', async () => {
			const newCustomer = new CreateCustomerDto();

			newCustomer.customer_code = 6899;
			newCustomer.name = 'Caio Cesar';
			newCustomer.taxvat = '54528658000115';
			newCustomer.address = {
				street: 'Rua do Teste Unitario',
				number: '458',
				complement: 'AP 11 Bloco V',
				district: 'PéGrande',
				city: 'Santos',
				postal_code: '11455559',
				uf: 'SP',
				country: 'Brasil'
			};

			const expectedForCustomerAlreadyExists: boolean = true;
			const expectedForCreateCustomer: RpcException = new RpcException({
				statusCode: HttpStatus.CONFLICT,
				message: `Customer with customer code [${newCustomer.customer_code}] and taxvat [${newCustomer.taxvat}] already exists`
			});

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(
				expectedForCustomerAlreadyExists
			);

			try {
				await customerMicroserviceRepository.createCustomer(newCustomer);
			} catch (error) {
				expect(error).toBeInstanceOf(RpcException);
				expect(error).toEqual(expectedForCreateCustomer);
			}
		});
	});

	describe('customerAlreadyExists', () => {
		it('should return true given customer found in the database', async () => {
			const expected: boolean = true;

			// @ts-ignore
			jest.spyOn(customerModel, 'count').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => Promise.resolve(1))
				};
			});

			const result = await customerMicroserviceRepository.customerAlreadyExists({
				customer_code: 6899,
				taxvat: '54528658000115'
			});

			expect(result).toEqual(expected);
		});

		it('should return false given customer not found in the database', async () => {
			const expected: boolean = false;

			// @ts-ignore
			jest.spyOn(customerModel, 'count').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => 0)
				};
			});

			const result = await customerMicroserviceRepository.customerAlreadyExists({
				customer_code: 6899,
				taxvat: '54528658000115'
			});

			expect(result).toEqual(expected);
		});
	});

	describe('customersAlreadyExists', () => {
		it('should return Set given customers found in the database', async () => {
			const expected: Set<string> = new Set(['6899-54528658000115']);

			const customersFound: Partial<Customer>[] = [
				{
					customer_code: 6899,
					taxvat: '54528658000115'
				}
			];

			// @ts-ignore
			jest.spyOn(customerModel, 'find').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => Promise.resolve(customersFound))
				};
			});

			const result = await customerMicroserviceRepository.customersAlreadyExists([6899], ['54528658000115']);

			expect(result).toEqual(expected);
		});

		it('should return empty Set given no customers found in the database', async () => {
			const expected: Set<string> = new Set();

			const customersFound: Partial<Customer>[] = [];

			// @ts-ignore
			jest.spyOn(customerModel, 'find').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => Promise.resolve(customersFound))
				};
			});

			const result = await customerMicroserviceRepository.customersAlreadyExists([6899], ['54528658000115']);

			expect(result).toEqual(expected);
		});
	});

	describe('findAllCustomers', () => {
		it('should find all customers in the database and return FindAllCustomersResponseDto class instance', async () => {
			const query: FindAllCustomersDto = new FindAllCustomersDto();

			query.page = 1;
			query.limit = 50;

			const customersFound: Partial<Customer>[] = [
				{
					customer_code: 6899,
					taxvat: '54528658000115'
				}
			];

			const totalFound = 1;

			const expected: FindAllCustomersResponseDto = new FindAllCustomersResponseDto();

			expected.customers = customersFound;
			expected.page_info = {
				current_page: query.page,
				page_size: query.limit,
				total_pages: Math.ceil(totalFound / query.limit)
			};
			expected.total_count = totalFound;

			jest.spyOn(customerMicroserviceRepository, 'countAllCustomers').mockResolvedValue(totalFound);
			jest.spyOn(customerMicroserviceRepository, 'findAllCustomerByPage').mockResolvedValue(customersFound);

			const result = await customerMicroserviceRepository.findAllCustomers(query);

			expect(result).toBeInstanceOf(FindAllCustomersResponseDto);
			expect(result).toEqual(expected);
		});

		it('should not found customers in the database and throw RpcException exception', async () => {
			const query: FindAllCustomersDto = new FindAllCustomersDto();

			query.page = 1;
			query.limit = 50;

			const totalFound = 0;

			const expected: RpcException = new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'Found no customer(s)'
			});

			jest.spyOn(customerMicroserviceRepository, 'countAllCustomers').mockResolvedValue(totalFound);

			try {
				await customerMicroserviceRepository.findAllCustomers(query);
			} catch (error) {
				expect(error).toBeInstanceOf(RpcException);
				expect(error).toEqual(expected);
			}
		});
	});

	describe('countAllCustomers', () => {
		it('should count all customers stored in the database', async () => {
			const expected: number = 1;

			// @ts-ignore
			jest.spyOn(customerModel, 'count').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => expected)
				};
			});

			const result = await customerMicroserviceRepository.countAllCustomers();

			expect(result).toEqual(expected);
		});
	});

	describe('findAllCustomerByPage', () => {
		it('should find all customers in the database given page number and limit per page', async () => {
			const customersFound: Partial<Customer>[] = [
				{
					customer_code: 6899,
					taxvat: '54528658000115',
					name: 'Test unitario',
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

			// @ts-ignore
			jest.spyOn(customerModel, 'find').mockImplementation(() => {
				return {
					exec: jest.fn().mockResolvedValue(customersFound)
				};
			});

			const result = await customerMicroserviceRepository.findAllCustomerByPage(1, 50);

			expect(result).toEqual(customersFound);
		});
	});

	describe('findOneCustomerByCustomerCode', () => {
		it('should find one customer in the database given customer code number', async () => {
			const customerFound: Customer = {
				customer_code: 6899,
				taxvat: '54528658000115',
				name: 'Test unitario',
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

			// @ts-ignore
			jest.spyOn(customerModel, 'findOne').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => Promise.resolve(customerFound))
				};
			});

			const result = await customerMicroserviceRepository.findOneCustomerByCustomerCode(6899);

			expect(result).toEqual(customerFound);
		});

		it('should not find one customer in the database given customer code number', async () => {
			const customerFound: Customer = null;

			// @ts-ignore
			jest.spyOn(customerModel, 'findOne').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => Promise.resolve(customerFound))
				};
			});

			const expected: RpcException = new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: 'Customer with customer code [6899] not found'
			});

			try {
				await customerMicroserviceRepository.findOneCustomerByCustomerCode(6899);
			} catch (error) {
				expect(error).toBeInstanceOf(RpcException);
				expect(error).toEqual(expected);
			}
		});
	});

	describe('updateCustomer', () => {
		it('should successfully update customer', async () => {
			const customerToUpdate = new UpdateCustomerDto();

			customerToUpdate.customer_code = 6899;
			customerToUpdate.taxvat = '54528658000115';
			customerToUpdate.address = {
				street: 'Rua do Teste Unitario',
				number: '458',
				complement: 'AP 11 Bloco V',
				district: 'PéGrande',
				city: 'Santos',
				postal_code: '11455559',
				uf: 'SP',
				country: 'Brasil'
			};

			const expected: boolean = true;

			const expectedForCustomerUpdate: any = {
				modifiedCount: 1
			};

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(true);
			// @ts-ignore
			jest.spyOn(customerModel, 'updateOne').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => Promise.resolve(expectedForCustomerUpdate))
				};
			});

			const result = await customerMicroserviceRepository.updateCustomer(customerToUpdate);

			expect(result).toEqual(expected);
		});

		it('should not update customer given modified count equal to zero', async () => {
			const customerToUpdate = new UpdateCustomerDto();

			customerToUpdate.customer_code = 6899;
			customerToUpdate.taxvat = '54528658000115';
			customerToUpdate.address = {
				street: 'Rua do Teste Unitario',
				number: '458',
				complement: 'AP 11 Bloco V',
				district: 'PéGrande',
				city: 'Santos',
				postal_code: '11455559',
				uf: 'SP',
				country: 'Brasil'
			};

			const expected: boolean = false;

			const expectedForCustomerUpdate: any = {
				modifiedCount: 0
			};

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(true);
			// @ts-ignore
			jest.spyOn(customerModel, 'updateOne').mockImplementation(() => {
				return {
					exec: jest.fn().mockImplementation(() => Promise.resolve(expectedForCustomerUpdate))
				};
			});

			const result = await customerMicroserviceRepository.updateCustomer(customerToUpdate);

			expect(result).toEqual(expected);
		});

		it('should not update customer given provided customer not exists in the database', async () => {
			const customerToUpdate = new CreateCustomerDto();

			customerToUpdate.customer_code = 6899;
			customerToUpdate.name = 'Caio Cesar';
			customerToUpdate.taxvat = '54528658000115';
			customerToUpdate.address = {
				street: 'Rua do Teste Unitario',
				number: '458',
				complement: 'AP 11 Bloco V',
				district: 'PéGrande',
				city: 'Santos',
				postal_code: '11455559',
				uf: 'SP',
				country: 'Brasil'
			};

			const expectedForCustomerAlreadyExists: boolean = false;

			const expectedForCreateUpdate: RpcException = new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: `Customer with customer code [${customerToUpdate.customer_code}] and taxvat [${customerToUpdate.taxvat}] not found`
			});

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(
				expectedForCustomerAlreadyExists
			);

			try {
				await customerMicroserviceRepository.updateCustomer(customerToUpdate);
			} catch (error) {
				expect(error).toBeInstanceOf(RpcException);
				expect(error).toEqual(expectedForCreateUpdate);
			}
		});
	});

	describe('deleteCustomer', () => {
		it('should successfully delete customer', async () => {
			const customerToDelete = new DeleteCustomerDto();

			customerToDelete.customer_code = 6899;
			customerToDelete.taxvat = '54528658000115';

			const expected: boolean = true;

			const expectedForCustomerDelete: any = {
				deletedCount: 1
			};

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(true);
			jest.spyOn(customerModel, 'deleteOne').mockResolvedValue(expectedForCustomerDelete);

			const result = await customerMicroserviceRepository.deleteCustomer(customerToDelete);

			expect(result).toEqual(expected);
		});

		it('should not delete customer given delete count equal to zero', async () => {
			const customerToDelete = new DeleteCustomerDto();

			customerToDelete.customer_code = 6899;
			customerToDelete.taxvat = '54528658000115';

			const expected: boolean = false;

			const expectedForCustomerDelete: any = {
				deletedCount: 0
			};

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(true);
			jest.spyOn(customerModel, 'deleteOne').mockResolvedValue(expectedForCustomerDelete);

			const result = await customerMicroserviceRepository.deleteCustomer(customerToDelete);

			expect(result).toEqual(expected);
		});

		it('should not delete customer given provided customer not exists in the database', async () => {
			const customerToDelete = new DeleteCustomerDto();

			customerToDelete.customer_code = 6899;
			customerToDelete.taxvat = '54528658000115';

			const expectedForCustomerAlreadyExists: boolean = false;

			const expectedForCreateDelete: RpcException = new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: `Customer with customer code [${customerToDelete.customer_code}] and taxvat [${customerToDelete.taxvat}] not found`
			});

			jest.spyOn(customerMicroserviceRepository, 'customerAlreadyExists').mockResolvedValue(
				expectedForCustomerAlreadyExists
			);

			try {
				await customerMicroserviceRepository.deleteCustomer(customerToDelete);
			} catch (error) {
				expect(error).toBeInstanceOf(RpcException);
				expect(error).toEqual(expectedForCreateDelete);
			}
		});
	});

	describe('createCustomerBulk', () => {
		it('should successfully create a new customers', async () => {
			const newCustomers: CreateCustomerDto[] = [
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
				},
				{
					customer_code: 6100,
					name: 'Caio Lopes',
					taxvat: '54528658000215',
					address: {
						street: 'Rua do Teste Integracao',
						number: '666',
						complement: 'AP 11 Bloco G',
						district: 'Cida',
						city: 'Grande',
						postal_code: '11955559',
						uf: 'AM',
						country: 'Brasil'
					}
				}
			];

			const expectedForCustomersAlreadyExists: any = new Set(['6100-54528658000215']);
			const expectedForBulkOperationExecution: any = {
				ok: 1,
				nInserted: 1
			};

			jest.spyOn(customerMicroserviceRepository, 'customersAlreadyExists').mockResolvedValue(
				expectedForCustomersAlreadyExists
			);

			// @ts-ignore
			customerModel.collection = {
				initializeOrderedBulkOp: jest.fn().mockImplementation(() => {
					return {
						batches: [{}],
						insert: function () {
							return this;
						},
						execute: jest.fn().mockResolvedValue(expectedForBulkOperationExecution)
					};
				})
			};

			const result = await customerMicroserviceRepository.createCustomerBulk(newCustomers);

			expect(result).toBeUndefined();
		});

		it('should not successfully create a new customers', async () => {
			const newCustomers: CreateCustomerDto[] = [
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
				},
				{
					customer_code: 6100,
					name: 'Caio Lopes',
					taxvat: '54528658000215',
					address: {
						street: 'Rua do Teste Integracao',
						number: '666',
						complement: 'AP 11 Bloco G',
						district: 'Cida',
						city: 'Grande',
						postal_code: '11955559',
						uf: 'AM',
						country: 'Brasil'
					}
				}
			];

			const expectedForCustomersAlreadyExists: any = new Set(['6100-54528658000215']);
			const expectedForBulkOperationExecution: any = {
				ok: 0,
				nInserted: 0
			};

			jest.spyOn(customerMicroserviceRepository, 'customersAlreadyExists').mockResolvedValue(
				expectedForCustomersAlreadyExists
			);

			// @ts-ignore
			customerModel.collection = {
				initializeOrderedBulkOp: jest.fn().mockImplementation(() => {
					return {
						batches: [{}],
						insert: function () {
							return this;
						},
						execute: jest.fn().mockResolvedValue(expectedForBulkOperationExecution)
					};
				})
			};

			const result = await customerMicroserviceRepository.createCustomerBulk(newCustomers);

			expect(result).toBeUndefined();
		});

		it('should not execute bulk operation given all customers provided already exists in the database', async () => {
			const newCustomers: CreateCustomerDto[] = [
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
				},
				{
					customer_code: 6100,
					name: 'Caio Lopes',
					taxvat: '54528658000215',
					address: {
						street: 'Rua do Teste Integracao',
						number: '666',
						complement: 'AP 11 Bloco G',
						district: 'Cida',
						city: 'Grande',
						postal_code: '11955559',
						uf: 'AM',
						country: 'Brasil'
					}
				}
			];

			const expectedForCustomersAlreadyExists: any = new Set(['6100-54528658000215', '6899-54528658000115']);

			jest.spyOn(customerMicroserviceRepository, 'customersAlreadyExists').mockResolvedValue(
				expectedForCustomersAlreadyExists
			);

			// @ts-ignore
			customerModel.collection = {
				initializeOrderedBulkOp: jest.fn().mockImplementation(() => {
					return {
						batches: [],
						insert: function () {
							return this;
						}
					};
				})
			};

			const result = await customerMicroserviceRepository.createCustomerBulk(newCustomers);

			expect(result).toBeUndefined();
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
