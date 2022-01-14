import { BadRequestException, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { APIGatewayExceptionFilter } from '../api-gateway-exception.filter';

describe('API Gateway Exception Filter', () => {
	let apiGatewayExceptionFilter: APIGatewayExceptionFilter;

	beforeEach(async () => {
		apiGatewayExceptionFilter = new APIGatewayExceptionFilter();
	});

	describe('Catch', () => {
		it('should log Http exception on New Relic Logs and return exception', async () => {
			const argumentsHost: any = {
				switchToHttp: () => {
					return {
						getResponse: () => {
							return {
								status: () => {
									return {
										json: () => ({})
									};
								}
							};
						},
						getRequest: () => ({})
					};
				}
			};

			const exception = new HttpException('Validation error', HttpStatus.BAD_REQUEST);

			expect(await apiGatewayExceptionFilter.catch(exception, argumentsHost)).toBeUndefined();
		});

		it('should log Bad request exception on New Relic Logs and return exception', async () => {
			const argumentsHost: any = {
				switchToHttp: () => {
					return {
						getResponse: () => {
							return {
								status: () => {
									return {
										json: () => ({})
									};
								}
							};
						},
						getRequest: () => ({})
					};
				}
			};

			const exception = new BadRequestException({ message: ['Validation error'] });

			expect(await apiGatewayExceptionFilter.catch(exception, argumentsHost)).toBeUndefined();
		});

		it('should log exception on New Relic Logs and return exception', async () => {
			const argumentsHost: any = {
				switchToHttp: () => {
					return {
						getResponse: () => {
							return {
								status: () => {
									return {
										json: () => ({})
									};
								}
							};
						},
						getRequest: () => ({})
					};
				}
			};

			const exception: any = { statusCode: 400, message: ['Validation error'] };

			expect(await apiGatewayExceptionFilter.catch(exception, argumentsHost)).toBeUndefined();
		});

		it('should log exception on New Relic Logs and return exception', async () => {
			const argumentsHost: any = {
				switchToHttp: () => {
					return {
						getResponse: () => {
							return {
								status: () => {
									return {
										json: () => ({})
									};
								}
							};
						},
						getRequest: () => ({})
					};
				}
			};

			const exception: any = {};

			expect(await apiGatewayExceptionFilter.catch(exception, argumentsHost)).toBeUndefined();
		});
	});
});
