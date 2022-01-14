import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthAPIController } from './auth.api.controller';
import { AuthAPIService } from './auth.api.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserRepository } from './repository/user.repository';
import { MongoDBModule } from '@microservices_config';
import { APIGatewayName } from '../../enum/auth.api_gateway.enum';
import APIGatewaySchemas from './schemas/api-gateway.schemas';

const configService = new ConfigService();

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.register({
			secret: configService.get('JWT_SECRET_PHRASE'),
			signOptions: {
				expiresIn: Number(configService.get('JWT_TOKEN_EXPIRATION_TIME'))
			}
		}),
		MongoDBModule.register(APIGatewayName.AUTH, APIGatewaySchemas)
	],
	controllers: [AuthAPIController],
	providers: [AuthAPIService, JwtStrategy, UserRepository],
	exports: [AuthAPIService, JwtStrategy, PassportModule]
})
export class AuthAPIModule {}
