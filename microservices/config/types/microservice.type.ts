import { APIGatewayName } from '@api_gateway';
import { MicroserviceName } from '@customer_microservice';

export type MicroserviceType = APIGatewayName.AUTH | MicroserviceName.CUSTOMERS;
