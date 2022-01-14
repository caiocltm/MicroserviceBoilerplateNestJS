import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt.payload';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(protected configService: ConfigService, private userRepository: UserRepository) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_SECRET_PHRASE')
		});
	}

	async validate(payload: JwtPayload) {
		const { username } = payload;
		const user = await this.userRepository.findUserByUsername({ username });

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
