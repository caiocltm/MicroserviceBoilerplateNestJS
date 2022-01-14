import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
	@ApiProperty({ type: 'string' })
	@IsString()
	@IsNotEmpty()
	accessToken: string;

	@ApiProperty({ type: 'string', description: 'Value in milliseconds' })
	@IsString()
	@IsNotEmpty()
	expiresIn: string;
}
