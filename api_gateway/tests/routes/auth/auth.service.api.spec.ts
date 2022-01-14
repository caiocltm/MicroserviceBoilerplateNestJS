import { ConfigService } from '@nestjs/config';
import { AuthAPIService } from '../../../src/routes/auth/auth.api.service';
import { AuthAPIController } from '../../../src/routes/auth/auth.api.controller';
import { UserCredentialsDto } from '../../../src/routes/auth/dto/user-credentials.dto';
import { AccessTokenDto } from '../../../src/routes/auth/dto/access-token.dto';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { ResponseTypeDto } from '../../../src/dto/response-type.dto';

const UserRepositoryMock: any = {
	validatePassword: jest.fn().mockResolvedValue(undefined),
	createUser: jest.fn().mockResolvedValue(undefined),
	hashPassword: jest.fn().mockResolvedValue(undefined),
	findUserByUsername: jest.fn().mockResolvedValue(undefined)
};

const JwtServiceMock: any = {
	sign: jest.fn().mockResolvedValue(undefined)
};

const AuthAPIServiceMock: any = {
	login: jest.fn().mockResolvedValue(undefined)
};

describe('AuthAPIService', () => {
	let authAPIController: AuthAPIController;
	let authAPIService: AuthAPIService;
	let configService: ConfigService;

	beforeEach(async () => {
		configService = new ConfigService();
		authAPIService = new AuthAPIService(configService, UserRepositoryMock, JwtServiceMock);
	});

	describe('createUser', () => {
		it('should successfully create a new API user', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const expected: ResponseTypeDto = new ResponseTypeDto();

			expected.statusCode = HttpStatus.CREATED;
			expected.message = 'API user [teste_unitario] successfully registered';

			jest.spyOn(UserRepositoryMock, 'createUser').mockResolvedValue(expected);

			const result = await authAPIService.createUser(body);

			expect(result).toBeInstanceOf(ResponseTypeDto);
			expect(result).toEqual(expected);
		});
	});

	describe('login', () => {
		it('should successfully return access token value given valid credentials', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const expectedForValidatePassword: string = 'teste_unitario';
			const expectedForJwtSign: string = 'JWT_TOKEN';
			const expectedForLogin = new AccessTokenDto();

			expectedForLogin.expiresIn = '2000';
			expectedForLogin.accessToken = expectedForJwtSign;

			jest.spyOn(Date.prototype, 'getTime').mockReturnValue(1000);
			jest.spyOn(UserRepositoryMock, 'validatePassword').mockResolvedValue(expectedForValidatePassword);
			jest.spyOn(configService, 'get').mockReturnValue('1');
			jest.spyOn(JwtServiceMock, 'sign').mockReturnValue(expectedForJwtSign);

			const result = await authAPIService.login(body);

			expect(result).toBeInstanceOf(AccessTokenDto);
			expect(result).toEqual(expectedForLogin);
		});

		it('should not successfully return access token value given invalid credentials and throw exception', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const expectedForValidatePassword: string = null;
			const expected: UnauthorizedException = new UnauthorizedException('Invalid credentials.');

			jest.spyOn(UserRepositoryMock, 'validatePassword').mockResolvedValue(expectedForValidatePassword);

			const result = authAPIService.login(body);

			expect(result).rejects.toBeInstanceOf(UnauthorizedException);
			expect(result).rejects.toEqual(expected);
		});
	});
});
