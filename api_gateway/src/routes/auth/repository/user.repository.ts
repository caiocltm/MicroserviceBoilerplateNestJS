import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { UserCredentialsDto } from '../dto/user-credentials.dto';
import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ResponseTypeDto } from '@api_gateway';

@Injectable()
export class UserRepository {
	constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

	async createUser(userCredentialsDto: UserCredentialsDto): Promise<ResponseTypeDto> {
		const { username, password } = userCredentialsDto;

		const user = new User();

		user.username = username;
		user.salt = await bcrypt.genSalt();
		user.password = await this.hashPassword(password, user.salt);

		try {
			const result = await this.userModel.create(user);

			if (!result) throw new HttpException('Cannot save the user', HttpStatus.INTERNAL_SERVER_ERROR);

			const response = new ResponseTypeDto();

			response.statusCode = HttpStatus.CREATED;
			response.message = `API user [${user.username}] successfully registered`;

			return response;
		} catch (error) {
			if (error.code === 11000) {
				// duplicated username
				throw new HttpException('Username already exists.', HttpStatus.CONFLICT);
			}

			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	async validatePassword(userCredentialsDto: UserCredentialsDto): Promise<string | null> {
		const { username, password } = userCredentialsDto;

		const user = await this.findUserByUsername({ username });
		const hash = await this.hashPassword(password, user.salt);

		if (user && hash === user.password) return user.username;

		return null;
	}

	async hashPassword(password: string, salt: string): Promise<string> {
		return bcrypt.hash(password, salt);
	}

	async findUserByUsername({ username }): Promise<User> {
		return this.userModel.findOne({ username }).exec();
	}
}
