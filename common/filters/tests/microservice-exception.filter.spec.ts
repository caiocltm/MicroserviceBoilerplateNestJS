import { RpcException } from '@nestjs/microservices';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { MicroserviceExceptionFilter } from '../microservice.exception.filter';

describe('Microservice Exception Filter', () => {
	let microserviceExceptionFilter: MicroserviceExceptionFilter;
	let rpcException: RpcException;
	let httpException: HttpException;
	let typeError: TypeError;

	beforeEach(async () => {
		jest.spyOn(Logger, 'log').mockImplementation(() => ({}));
		jest.spyOn(Logger, 'warn').mockImplementation(() => ({}));
		jest.spyOn(Logger, 'error').mockImplementation(() => ({}));

		microserviceExceptionFilter = new MicroserviceExceptionFilter();
	});

	describe('catch', () => {
		it('should catch RpcException, log and ack the message given RabbitMQ context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder"
                            }`,
											'utf-8'
										),
										properties: {
											correlationId: 'a6a6a6a6a6a6a66a6a6a'
										}
									};
								}
							};
						}
					};
				}
			};

			rpcException = new RpcException({
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'UNAUTHORIZED'
			});

			expect(await microserviceExceptionFilter.catch(rpcException, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch RpcException, log and return exception given Redis context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								args: ['createOrder']
							};
						}
					};
				}
			};

			rpcException = new RpcException({
				statusCode: HttpStatus.UNAUTHORIZED,
				message: 'UNAUTHORIZED'
			});

			expect(await microserviceExceptionFilter.catch(rpcException, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch HttpException, log and ack the message given RabbitMQ context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder"
                            }`,
											'utf-8'
										),
										properties: {
											correlationId: 'a6a6a6a6a6a6a66a6a6a'
										}
									};
								}
							};
						}
					};
				}
			};

			httpException = new HttpException({ message: 'Error' }, HttpStatus.UNAUTHORIZED);

			expect(await microserviceExceptionFilter.catch(httpException, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch HttpException, log and return exception given Redis context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								args: ['createOrder']
							};
						}
					};
				}
			};

			httpException = new HttpException({ message: 'Error' }, HttpStatus.UNAUTHORIZED);

			expect(await microserviceExceptionFilter.catch(httpException, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch TypeError, log and ack the message given RabbitMQ context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder"
                            }`,
											'utf-8'
										),
										properties: {
											correlationId: 'a6a6a6a6a6a6a66a6a6a'
										}
									};
								}
							};
						}
					};
				}
			};

			typeError = new TypeError('Type error');

			expect(await microserviceExceptionFilter.catch(typeError, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch TypeError, log and ack the message given RabbitMQ context and no content data', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {};
								}
							};
						}
					};
				}
			};

			typeError = new TypeError('Type error');

			expect(await microserviceExceptionFilter.catch(typeError, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch HttpException, log and return exception given Redis context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								args: ['createOrder']
							};
						}
					};
				}
			};

			typeError = new TypeError('Type error');

			expect(await microserviceExceptionFilter.catch(typeError, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch HttpException, log and return exception given Redis context and no operation found', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								args: []
							};
						}
					};
				}
			};

			typeError = new TypeError('Type error');

			expect(await microserviceExceptionFilter.catch(typeError, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch throwed error and return given RabbitMQ context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "catchError"
                            }`,
											'utf-8'
										),
										properties: {
											correlationId: 'a6a6a6a6a6a6a66a6a6a'
										}
									};
								}
							};
						}
					};
				}
			};

			jest.spyOn(microserviceExceptionFilter, 'getMessage').mockImplementation(() => {
				throw new TypeError('Error');
			});

			try {
				await microserviceExceptionFilter.catch({}, argumentsHost);
			} catch (error) {
				expect(error).toBeInstanceOf(Observable);
			}
		});

		it('should catch throwed error and return given Redis context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								args: ['catchError']
							};
						}
					};
				}
			};

			jest.spyOn(microserviceExceptionFilter, 'getMessage').mockImplementation(() => {
				throw new TypeError('Error');
			});

			try {
				await microserviceExceptionFilter.catch({}, argumentsHost);
			} catch (error) {
				expect(error).toBeInstanceOf(Observable);
			}
		});

		it('should catch RpcException, log and ack the message given RabbitMQ context and no exception throwed', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder"
                            }`,
											'utf-8'
										),
										properties: {
											correlationId: 'a6a6a6a6a6a6a66a6a6a'
										}
									};
								}
							};
						}
					};
				}
			};

			expect(await microserviceExceptionFilter.catch(null, argumentsHost)).toBeInstanceOf(Observable);
		});

		it('should catch throwed exception and ack the message', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder"
                            }`,
											'utf-8'
										),
										properties: {
											correlationId: 'a6a6a6a6a6a6a66a6a6a'
										}
									};
								}
							};
						}
					};
				}
			};

			try {
				await microserviceExceptionFilter.catch(null, argumentsHost);
			} catch (error) {
				expect(error).toBeInstanceOf(TypeError);
			}
		});
	});

	describe('getOperationCacheKey', () => {
		it('should return operation+key cache', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder",
                                "data": {
                                    "message_id": "5s6a6s9s9e9t9yt9dsdasdaa69a949ada"
                                }
                            }`,
											'utf-8'
										)
									};
								}
							};
						}
					};
				}
			};

			typeError = new TypeError('Type error');

			await microserviceExceptionFilter.catch(typeError, argumentsHost);

			expect(microserviceExceptionFilter.getOperationCacheKey()).toEqual(
				'createOrder---5s6a6s9s9e9t9yt9dsdasdaa69a949ada'
			);
		});
	});

	describe('getOperation', () => {
		it('should return operation', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder",
                                "data": {
                                    "message_id": "5s6a6s9s9e9t9yt9dsdasdaa69a949ada"
                                }
                            }`,
											'utf-8'
										)
									};
								}
							};
						}
					};
				}
			};

			typeError = new TypeError('Type error');

			await microserviceExceptionFilter.catch(typeError, argumentsHost);

			expect(microserviceExceptionFilter.getOperation()).toEqual('createOrder');
		});
	});

	describe('ackMessage', () => {
		it('should ack message given RabbitMQ context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder",
                                "data": {
                                    "message_id": "5s6a6s9s9e9t9yt9dsdasdaa69a949ada"
                                }
                            }`,
											'utf-8'
										)
									};
								}
							};
						}
					};
				}
			};

			typeError = new TypeError('Type error');

			await microserviceExceptionFilter.catch(typeError, argumentsHost);

			expect(microserviceExceptionFilter.ackMessage()).toBeUndefined();
		});
	});

	describe('nackMessage', () => {
		it('should nack message given RabbitMQ context', async () => {
			const argumentsHost: any = {
				switchToRpc: () => {
					return {
						getContext: () => {
							return {
								getChannelRef: () => {
									return {
										ack: () => {
											return {};
										},
										nack: () => {
											return {};
										}
									};
								},
								getMessage: () => {
									return {
										content: Buffer.from(
											`{
                                "pattern": "createOrder",
                                "data": {
                                    "message_id": "5s6a6s9s9e9t9yt9dsdasdaa69a949ada"
                                }
                            }`,
											'utf-8'
										)
									};
								}
							};
						}
					};
				}
			};

			typeError = new TypeError('Type error');

			await microserviceExceptionFilter.catch(typeError, argumentsHost);

			expect(microserviceExceptionFilter.nackMessage()).toBeUndefined();
		});
	});
});
