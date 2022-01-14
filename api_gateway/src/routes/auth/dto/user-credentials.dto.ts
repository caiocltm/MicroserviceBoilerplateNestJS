import { IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCredentialsDto {
	@ApiProperty({ type: 'string', minLength: 4, maxLength: 20 })
	@IsString()
	@MinLength(4)
	@MaxLength(20)
	username: string;

	@ApiProperty({ type: 'string', minLength: 8, maxLength: 30 })
	@IsString()
	@MinLength(8)
	@MaxLength(30)
	@Matches(/^((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Weak password.' })
	password: string;
}
