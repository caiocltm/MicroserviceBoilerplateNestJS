import { Schema } from 'mongoose';
import { Customer, CustomerSchema } from './customer.schema';

const MicroserviceCustomersSchemas: Array<{ name: string; schema: Schema }> = [
	{ name: Customer.name, schema: CustomerSchema }
];

export default MicroserviceCustomersSchemas;
