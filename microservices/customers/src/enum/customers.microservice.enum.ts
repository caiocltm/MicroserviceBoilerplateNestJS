export enum MicroserviceName {
	CUSTOMERS = 'customers_microservice'
}

export enum CustomersMicroservicePatterns {
	CREATE_CUSTOMER = 'customers_microservice.createCustomer',

	FIND_ALL_CUSTOMERS = 'customers_microservice.findAllCustomers',

	FIND_ONE_CUSTOMER_BY_CUSTOMER_CODE = 'customers_microservice.findOneCustomerByCustomerCode',

	UPDATE_CUSTOMER = 'customers_microservice.updateCustomer',

	DELETE_CUSTOMER = 'customers_microservice.deleteCustomer',

	CREATE_CUSTOMER_BULK = 'customers_microservice.createCustomerBulk'
}
