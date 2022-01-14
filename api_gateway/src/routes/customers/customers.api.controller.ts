import {
	Controller,
	Post,
	Body,
	ValidationPipe,
	UsePipes,
	Get,
	Query,
	Param,
	Patch,
	Delete,
	UseGuards,
	ParseArrayPipe
} from '@nestjs/common';
import { CustomersAPIService } from './customers.api.service';
import {
	ApiTags,
	ApiInternalServerErrorResponse,
	ApiCreatedResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
	ApiOkResponse,
	ApiHeader,
	ApiNotFoundResponse,
	ApiConflictResponse,
	PartialType
} from '@nestjs/swagger';
import {
	CreateCustomerDto,
	Customer,
	DeleteCustomerDto,
	FindAllCustomersDto,
	FindAllCustomersResponseDto,
	UpdateCustomerDto
} from '@customer_microservice';
import { ResponseTypeDto } from '../../dto/response-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@ApiTags('Customers')
@Controller('customers')
@UseGuards(AuthGuard())
@ApiHeader({
	name: 'Authorization',
	description: 'Bearer {{ access_token }}',
	required: true
})
export class CustomersAPIController {
	constructor(private customersAPIService: CustomersAPIService) {}

	@Post('/create')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidUnknownValues: true }))
	@ApiCreatedResponse({ type: ResponseTypeDto })
	@ApiUnauthorizedResponse({ type: ResponseTypeDto })
	@ApiConflictResponse({ type: ResponseTypeDto })
	@ApiInternalServerErrorResponse({ type: ResponseTypeDto })
	@ApiBadRequestResponse({ type: ResponseTypeDto })
	createCustomer(@Body() body: CreateCustomerDto): Observable<ResponseTypeDto> {
		return this.customersAPIService.createCustomer(body);
	}

	@Get('/findAll')
	@UsePipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidUnknownValues: true,
			transformOptions: { enableImplicitConversion: true }
		})
	)
	@ApiOkResponse({ type: FindAllCustomersResponseDto })
	@ApiNotFoundResponse({ type: ResponseTypeDto })
	@ApiUnauthorizedResponse({ type: ResponseTypeDto })
	@ApiInternalServerErrorResponse({ type: ResponseTypeDto })
	@ApiBadRequestResponse({ type: ResponseTypeDto })
	findAllCustomers(@Query() query: FindAllCustomersDto): Observable<FindAllCustomersResponseDto> {
		return this.customersAPIService.findAllCustomers(query);
	}

	@Get('/findBy/:customerCode')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidUnknownValues: true }))
	@ApiOkResponse({ type: PartialType(Customer) })
	@ApiNotFoundResponse({ type: ResponseTypeDto })
	@ApiUnauthorizedResponse({ type: ResponseTypeDto })
	@ApiInternalServerErrorResponse({ type: ResponseTypeDto })
	@ApiBadRequestResponse({ type: ResponseTypeDto })
	findOneCustomerByCustomerCode(@Param('customerCode') customerCode: number): Observable<Partial<Customer>> {
		return this.customersAPIService.findOneCustomerByCustomerCode(customerCode);
	}

	@Patch('/update')
	@UsePipes(new ValidationPipe({ transform: true, whitelist: true, forbidUnknownValues: true }))
	@ApiOkResponse({ type: ResponseTypeDto })
	@ApiUnauthorizedResponse({ type: ResponseTypeDto })
	@ApiNotFoundResponse({ type: ResponseTypeDto })
	@ApiInternalServerErrorResponse({ type: ResponseTypeDto })
	@ApiBadRequestResponse({ type: ResponseTypeDto })
	updateCustomer(@Body() body: UpdateCustomerDto): Observable<ResponseTypeDto> {
		return this.customersAPIService.updateCustomer(body);
	}

	@Delete('/delete')
	@UsePipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidUnknownValues: true,
			transformOptions: { enableImplicitConversion: true }
		})
	)
	@ApiOkResponse({ type: ResponseTypeDto })
	@ApiUnauthorizedResponse({ type: ResponseTypeDto })
	@ApiNotFoundResponse({ type: ResponseTypeDto })
	@ApiInternalServerErrorResponse({ type: ResponseTypeDto })
	@ApiBadRequestResponse({ type: ResponseTypeDto })
	deleteCustomer(@Query() query: DeleteCustomerDto): Observable<ResponseTypeDto> {
		return this.customersAPIService.deleteCustomer(query);
	}

	@Post('/bulk/create')
	@UsePipes(
		new ParseArrayPipe({
			items: CreateCustomerDto,
			whitelist: true,
			forbidUnknownValues: true,
			transformOptions: { enableImplicitConversion: true }
		})
	)
	@ApiCreatedResponse({ type: ResponseTypeDto })
	@ApiUnauthorizedResponse({ type: ResponseTypeDto })
	@ApiNotFoundResponse({ type: ResponseTypeDto })
	@ApiInternalServerErrorResponse({ type: ResponseTypeDto })
	@ApiBadRequestResponse({ type: ResponseTypeDto })
	createCustomerBulk(@Body() customers: CreateCustomerDto[]): ResponseTypeDto {
		return this.customersAPIService.createCustomerBulk(customers);
	}
}
