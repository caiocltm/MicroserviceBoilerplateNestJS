import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '../../../src/routes/auth/repository/user.repository';
import { UserCredentialsDto } from '../../../src/routes/auth/dto/user-credentials.dto';
import { ResponseTypeDto } from '../../../src/dto/response-type.dto';
import { User, UserDocument } from '../../../src/routes/auth/schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UserRepository', () => {
	let app: TestingModule;
	let userRepository: UserRepository;
	let userModel: Model<UserDocument>;

	beforeEach(async () => {
		app = await Test.createTestingModule({
			providers: [
				{
					provide: getModelToken(User.name),
					useValue: Model
				},
				UserRepository
			]
		}).compile();

		userModel = app.get<Model<UserDocument>>(getModelToken(User.name));
		userRepository = app.get<UserRepository>(UserRepository);
	});

	describe('createUser', () => {
		it('should successfully create a new API user', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const expected: ResponseTypeDto = new ResponseTypeDto();

			expected.statusCode = HttpStatus.CREATED;
			expected.message = 'API user [teste_unitario] successfully registered';

			const expectedForUserCreate: any = {
				_id: '595ds9d5a9sd59s5f9sd5f959dsf'
			};

			jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('SALT'));
			jest.spyOn(userRepository, 'hashPassword').mockResolvedValue('PASSWORD_HASH');
			jest.spyOn(userModel, 'create').mockImplementation(() => Promise.resolve(expectedForUserCreate));

			const result = await userRepository.createUser(body);

			expect(result).toBeInstanceOf(ResponseTypeDto);
			expect(result).toEqual(expected);
		});

		it('should not create a new API user given no response provided by database', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const expected: HttpException = new HttpException('Cannot save the user', HttpStatus.INTERNAL_SERVER_ERROR);

			const expectedForUserCreate: any = null;

			jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('SALT'));
			jest.spyOn(userRepository, 'hashPassword').mockResolvedValue('PASSWORD_HASH');
			jest.spyOn(userModel, 'create').mockImplementation(() => Promise.resolve(expectedForUserCreate));

			const result = userRepository.createUser(body);

			expect(result).rejects.toBeInstanceOf(HttpException);
			expect(result).rejects.toEqual(expected);
		});

		it('should not create a new API user given username already exists in the database', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const expected: HttpException = new HttpException('Username already exists.', HttpStatus.CONFLICT);

			const expectedForUserCreate: any = {
				code: 11000,
				message: 'Username already exists'
			};

			jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('SALT'));
			jest.spyOn(userRepository, 'hashPassword').mockResolvedValue('PASSWORD_HASH');
			jest.spyOn(userModel, 'create').mockImplementation(() => Promise.reject(expectedForUserCreate));

			const result = userRepository.createUser(body);

			expect(result).rejects.toBeInstanceOf(HttpException);
			expect(result).rejects.toEqual(expected);
		});

		it('should not create a new API user given unknown error provided by the database', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const expected: HttpException = new HttpException('Unknown error', HttpStatus.INTERNAL_SERVER_ERROR);

			const expectedForUserCreate: any = {
				code: 99999,
				message: 'Unknown error'
			};

			jest.spyOn(bcrypt, 'genSalt').mockImplementation(() => Promise.resolve('SALT'));
			jest.spyOn(userRepository, 'hashPassword').mockResolvedValue('PASSWORD_HASH');
			jest.spyOn(userModel, 'create').mockImplementation(() => Promise.reject(expectedForUserCreate));

			const result = userRepository.createUser(body);

			expect(result).rejects.toBeInstanceOf(HttpException);
			expect(result).rejects.toEqual(expected);
		});
	});

	describe('validatePassword', () => {
		it('should successfully validate password given valid user credentials', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'Test@unitario123';

			const userFound = new User();

			userFound.username = body.username;
			userFound.password = body.password;
			userFound.salt = 'SALT';
			userFound.updatedAt = 165959987997;
			userFound.createdAt = 165959987997;

			const expectedForFindUserByUsername = userFound;
			const expectedForValidatePassword = userFound.username;

			jest.spyOn(userRepository, 'findUserByUsername').mockResolvedValue(expectedForFindUserByUsername);
			jest.spyOn(userRepository, 'hashPassword').mockResolvedValue(userFound.password);

			const result = await userRepository.validatePassword(body);

			expect(result).toBe(expectedForValidatePassword);
		});

		it('should not successfully validate password given invalid user credentials', async () => {
			const body = new UserCredentialsDto();

			body.username = 'teste_unitario';
			body.password = 'WRONG_PASSWORD';

			const userFound = new User();

			userFound.username = body.username;
			userFound.password = 'CORRECT_PASSWORD';
			userFound.salt = 'SALT';
			userFound.updatedAt = 165959987997;
			userFound.createdAt = 165959987997;

			jest.spyOn(userRepository, 'findUserByUsername').mockResolvedValue(userFound);
			jest.spyOn(userRepository, 'hashPassword').mockResolvedValue(body.password);

			const result = await userRepository.validatePassword(body);

			expect(result).toBeNull();
		});
	});

	describe('hashPassword', () => {
		it('should return the hash given user password and salt', async () => {
			const expected = 'PASSWORD_HASH';

			jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve(expected));

			const result = await userRepository.hashPassword('PASSWORD', 'SALT');

			expect(result).toBe(expected);
		});
	});

	describe('findUserByUsername', () => {
		it('should return a user given username', async () => {
			const username = 'teste_unitario';
			const expected = new User();

			expected.username = username;
			expected.password = 'PASSWORD';
			expected.salt = 'SALT';
			expected.updatedAt = 165959987997;
			expected.createdAt = 165959987997;

			// @ts-ignore
			jest.spyOn(userModel, 'findOne').mockImplementation(() => {
				return {
					exec: jest.fn().mockResolvedValue(expected)
				};
			});

			const result = await userRepository.findUserByUsername({ username });

			expect(result).toBe(expected);
		});
	});

	afterAll(async () => {
		await app.close();
	});
});
