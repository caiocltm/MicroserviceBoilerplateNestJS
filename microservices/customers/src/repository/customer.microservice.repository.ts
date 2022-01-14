import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { DeleteCustomerDto } from '../dto/delete-customer.dto';
import { FindAllCustomersResponseDto } from '../dto/find-all-customers-response.dto';
import { FindAllCustomersDto } from '../dto/find-all-customers.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { Customer, CustomerDocument } from '../schemas/customer.schema';

@Injectable()
export class CustomerMicroserviceRepository {
	constructor(@InjectModel(Customer.name) private readonly customerModel: Model<CustomerDocument>) {}

	async createCustomer(newCustomer: CreateCustomerDto): Promise<boolean> {
		if (
			await this.customerAlreadyExists({ customer_code: newCustomer.customer_code, taxvat: newCustomer.taxvat })
		) {
			throw new RpcException({
				statusCode: HttpStatus.CONFLICT,
				message: `Customer with customer code [${newCustomer.customer_code}] and taxvat [${newCustomer.taxvat}] already exists`
			});
		}

		const result = await this.customerModel.create(newCustomer);

		return result._id ? true : false;
	}

	async customerAlreadyExists({
		customer_code,
		taxvat
	}: {
		customer_code: number;
		taxvat: string;
	}): Promise<boolean> {
		return (await this.customerModel.count({ customer_code, taxvat }).exec()) > 0 ? true : false;
	}

	async customersAlreadyExists(customers: number[], taxvat: string[]): Promise<Set<string>> {
		const customersFound = await this.customerModel
			.find({ customer_code: { $in: customers }, taxvat: { $in: taxvat } }, ['-_id', 'customer_code', 'taxvat'])
			.exec();

		if (!customersFound.length) return new Set();

		return new Set(customersFound.map((c) => `${c.customer_code}-${c.taxvat}`));
	}

	async findAllCustomers(query: FindAllCustomersDto): Promise<FindAllCustomersResponseDto> {
		const totalFound = await this.countAllCustomers();

		if (!totalFound) {
			throw new RpcException({ statusCode: HttpStatus.NOT_FOUND, message: 'Found no customer(s)' });
		}

		const customersFound = await this.findAllCustomerByPage(query.page, query.limit);

		const findAllCustomersResponse = new FindAllCustomersResponseDto();

		findAllCustomersResponse.customers = customersFound;
		findAllCustomersResponse.page_info = {
			current_page: query.page,
			page_size: query.limit,
			total_pages: Math.ceil(totalFound / query.limit)
		};
		findAllCustomersResponse.total_count = totalFound;

		return findAllCustomersResponse;
	}

	async countAllCustomers(): Promise<number> {
		return this.customerModel.count().exec();
	}

	async findAllCustomerByPage(page: number, limit: number): Promise<Partial<Customer>[]> {
		return this.customerModel
			.find(null, Customer.DEFAULT_PROJECTION, {
				skip: limit * (page - 1),
				limit
			})
			.exec();
	}

	async findOneCustomerByCustomerCode(customer_code: number): Promise<Customer> {
		const customerFound = await this.customerModel.findOne({ customer_code }, Customer.DEFAULT_PROJECTION).exec();

		if (!customerFound) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: `Customer with customer code [${customer_code}] not found`
			});
		}

		return customerFound;
	}

	async updateCustomer(customerToUpdate: UpdateCustomerDto): Promise<boolean> {
		if (
			!(await this.customerAlreadyExists({
				customer_code: customerToUpdate.customer_code,
				taxvat: customerToUpdate.taxvat
			}))
		) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: `Customer with customer code [${customerToUpdate.customer_code}] and taxvat [${customerToUpdate.taxvat}] not found`
			});
		}

		const result = await this.customerModel
			.updateOne(
				{ customer_code: customerToUpdate.customer_code, taxvat: customerToUpdate.taxvat },
				{ $set: customerToUpdate },
				{ timestamps: true }
			)
			.exec();

		return result.modifiedCount ? true : false;
	}

	async deleteCustomer(customerToDelete: DeleteCustomerDto): Promise<boolean> {
		if (
			!(await this.customerAlreadyExists({
				customer_code: customerToDelete.customer_code,
				taxvat: customerToDelete.taxvat
			}))
		) {
			throw new RpcException({
				statusCode: HttpStatus.NOT_FOUND,
				message: `Customer with customer code [${customerToDelete.customer_code}] and taxvat [${customerToDelete.taxvat}] not found`
			});
		}

		const result = await this.customerModel.deleteOne({
			customer_code: customerToDelete.customer_code,
			taxvat: customerToDelete.taxvat
		});

		return result.deletedCount ? true : false;
	}

	async createCustomerBulk(customersToCreate: CreateCustomerDto[]): Promise<void> {
		const bulkOperation = this.customerModel.collection.initializeOrderedBulkOp();

		const customersThatAlreadyExists = await this.customersAlreadyExists(
			customersToCreate.map((c) => c.customer_code),
			customersToCreate.map((c) => c.taxvat)
		);

		let bulkOperationsCount = 0;

		for (const customerToCreate of customersToCreate) {
			if (!customersThatAlreadyExists.has(`${customerToCreate.customer_code}-${customerToCreate.taxvat}`)) {
				bulkOperation.insert(customerToCreate);

				bulkOperationsCount++;
			}
		}

		if (!bulkOperation.batches.length) {
			Logger.log('Found no bulk operations to execute', 'CreateCustomerBulk');

			return;
		}

		const bulkOperationResult = await bulkOperation.execute();

		Logger.log(
			`Bulk operation(s) [${bulkOperationsCount}] successfully executed [${
				bulkOperationResult.ok ? true : false
			}] - Inserted [${bulkOperationResult.nInserted}]`,
			'CreateCustomerBulk'
		);
	}
}
