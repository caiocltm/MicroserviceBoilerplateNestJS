import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../../src/routes/auth/jwt/jwt.strategy';
import { UserRepository } from '../../../src/routes/auth/repository/user.repository';
import { UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../../../src/routes/auth/jwt/jwt.payload';
import { User } from '../../../src/routes/auth/schemas/user.schema';

export const UserRepositoryMock = jest.fn(() => ({
	validatePassword: jest.fn().mockResolvedValue(undefined),
	createUser: jest.fn().mockResolvedValue(undefined),
	hashPassword: jest.fn().mockResolvedValue(undefined),
	findUserByUsername: jest.fn().mockResolvedValue(undefined)
}));

describe('JWTStrategy', () => {
	let app: TestingModule;
	let jwtStrategy: JwtStrategy;
	let userRepository: UserRepository;

	beforeEach(async () => {
		app = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot(),
				PassportModule.register({ defaultStrategy: 'jwt' }),
				JwtModule.register({
					secret: 'a9s9df9sd5f9sd5f9sdasd',
					signOptions: {
						expiresIn: Number('5000')
					}
				})
			],
			controllers: [],
			providers: [
				JwtStrategy,
				{
					provide: UserRepository,
					useClass: UserRepositoryMock
				}
			]
		}).compile();

		userRepository = app.get<UserRepository>(UserRepository);
		jwtStrategy = app.get<JwtStrategy>(JwtStrategy);
	});

	describe('validate', () => {
		it('should successfully validate user', async () => {
			const payload: JwtPayload = {
				username: 'teste_unitario'
			};

			payload.username = 'teste_unitario';

			const expectedForFindUserByUsername: User = new User();

			expectedForFindUserByUsername.username = 'teste_unitario';
			expectedForFindUserByUsername.password = 'PASSWORD';
			expectedForFindUserByUsername.salt = 'PASSWORD_SALT';
			expectedForFindUserByUsername.createdAt = 15454659595;
			expectedForFindUserByUsername.updatedAt = 15454659595;

			const expected: User = expectedForFindUserByUsername;

			jest.spyOn(userRepository, 'findUserByUsername').mockResolvedValue(expectedForFindUserByUsername);

			const result = await jwtStrategy.validate(payload);

			expect(result).toBeInstanceOf(User);
			expect(result).toEqual(expected);
		});

		it('should not successfully validate user and throw an UnauthorizedException', async () => {
			const payload: JwtPayload = {
				username: 'teste_unitario'
			};

			jest.spyOn(userRepository, 'findUserByUsername').mockResolvedValue(null);

			const result = jwtStrategy.validate(payload);

			expect(result).rejects.toBeInstanceOf(UnauthorizedException);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
