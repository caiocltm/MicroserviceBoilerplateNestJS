import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class DeleteCustomerDto {
	@ApiProperty({ type: 'number' })
	@IsNotEmpty()
	@IsNumber()
	customer_code: number;

	@ApiProperty({ type: 'string', minLength: 11, maxLength: 14 })
	@IsNotEmpty()
	@IsString()
	@Length(11, 14)
	taxvat: string;
}
