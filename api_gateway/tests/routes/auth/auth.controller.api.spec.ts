import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthAPIService } from '../../../src/routes/auth/auth.api.service';
import { AuthAPIController } from '../../../src/routes/auth/auth.api.controller';
import { UserRepository } from '../../../src/routes/auth/repository/user.repository';
import { UserCredentialsDto } from '../../../src/routes/auth/dto/user-credentials.dto';
import { AccessTokenDto } from '../../../src/routes/auth/dto/access-token.dto';
import { JwtService } from '@nestjs/jwt';

const UserRepositoryMock: any = {
	validatePassword: jest.fn().mockResolvedValue(undefined),
	createUser: jest.fn().mockResolvedValue(undefined),
	hashPassword: jest.fn().mockResolvedValue(undefined),
	findUserByUsername: jest.fn().mockResolvedValue(undefined)
};

const JwtServiceMock: any = {
	sign: jest.fn().mockResolvedValue(undefined)
};

describe('AuthAPIController', () => {
	let authAPIController: AuthAPIController;
	let authAPIService: AuthAPIService;
	let configService: ConfigService;

	beforeEach(async () => {
		configService = new ConfigService();
		authAPIService = new AuthAPIService(configService, UserRepositoryMock, JwtServiceMock);
		authAPIController = new AuthAPIController(authAPIService);
	});

	describe('login', () => {
		it('should successfully login user given valid credentials', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const expected: AccessTokenDto = new AccessTokenDto();

			expected.expiresIn = '165987659897';
			expected.accessToken = 'ACCESSTOKEN';

			jest.spyOn(authAPIService, 'login').mockResolvedValue(expected);

			const result = await authAPIController.login(body);

			expect(result).toBeInstanceOf(AccessTokenDto);
			expect(result).toBe(expected);
		});
	});
});
