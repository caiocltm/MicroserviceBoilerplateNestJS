import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessTokenDto } from './dto/access-token.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { JwtPayload } from './jwt/jwt.payload';
import { UserRepository } from './repository/user.repository';
import { ResponseTypeDto } from '../../dto/response-type.dto';

@Injectable()
export class AuthAPIService {
	constructor(
		protected configService: ConfigService,
		private userRepository: UserRepository,
		private jwtService: JwtService
	) {}

	async createUser(userCredentialsDto: UserCredentialsDto): Promise<ResponseTypeDto> {
		return this.userRepository.createUser(userCredentialsDto);
	}

	async login(userCredentialsDto: UserCredentialsDto): Promise<AccessTokenDto> {
		const username = await this.userRepository.validatePassword(userCredentialsDto);

		if (!username) {
			throw new UnauthorizedException('Invalid credentials.');
		}

		// Value parsed to milliseconds.
		const expiresIn = (
			new Date().getTime() +
			parseInt(this.configService.get<string>('JWT_TOKEN_EXPIRATION_TIME')) * 1000
		).toString();

		const payload: JwtPayload = { username };

		const accessToken = this.jwtService.sign(payload);

		const response = new AccessTokenDto();

		response.expiresIn = expiresIn;
		response.accessToken = accessToken;

		return response;
	}
}
