import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class CustomerAddressDto {
	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@IsNotEmpty()
	@Length(1, 255)
	street: string;

	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@Length(1, 255)
	number: string;

	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@IsNotEmpty()
	@Length(1, 255)
	complement: string;

	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@IsNotEmpty()
	@Length(1, 255)
	district: string;

	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@IsNotEmpty()
	@Length(1, 255)
	city: string;

	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@IsNotEmpty()
	@Length(1, 255)
	postal_code: string;

	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@IsNotEmpty()
	@Length(1, 255)
	uf: string;

	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@IsNotEmpty()
	@Length(1, 255)
	country: string;
}
