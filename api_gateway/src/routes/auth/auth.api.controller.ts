import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import {
	ApiBadGatewayResponse,
	ApiCreatedResponse,
	ApiInternalServerErrorResponse,
	ApiTags,
	ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { ResponseTypeDto } from '../../dto/response-type.dto';
import { AuthAPIService } from './auth.api.service';
import { AccessTokenDto } from './dto/access-token.dto';
import { UserCredentialsDto } from './dto/user-credentials.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthAPIController {
	constructor(private authAPIService: AuthAPIService) {}

	@Post('/login')
	@ApiCreatedResponse({ type: AccessTokenDto })
	@ApiUnauthorizedResponse({ type: ResponseTypeDto })
	@ApiBadGatewayResponse({ type: ResponseTypeDto })
	@ApiInternalServerErrorResponse({ type: ResponseTypeDto })
	async login(@Body(ValidationPipe) userCredentialsDto: UserCredentialsDto): Promise<AccessTokenDto> {
		return this.authAPIService.login(userCredentialsDto);
	}
}
