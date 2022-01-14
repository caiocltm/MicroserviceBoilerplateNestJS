import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNotEmptyObject, IsNumber, IsString, Length, ValidateNested } from 'class-validator';
import { CustomerAddressDto } from './customer-address.dto';

export class CreateCustomerDto {
	@ApiProperty({ type: 'number' })
	@IsNotEmpty()
	@IsNumber()
	customer_code: number;

	@ApiProperty({ type: 'string', minLength: 1, maxLength: 255 })
	@IsNotEmpty()
	@IsString()
	@Length(1, 255)
	name: string;

	@ApiProperty({ type: 'string', minLength: 11, maxLength: 14 })
	@IsNotEmpty()
	@IsString()
	@Length(11, 14)
	taxvat: string;

	@ApiProperty({ type: CustomerAddressDto })
	@IsNotEmpty()
	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => CustomerAddressDto)
	address: CustomerAddressDto;
}
