import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsInt, IsPositive, Min, Max } from 'class-validator';

export class FindAllCustomersDto {
	@ApiProperty({ type: 'number', minimum: 1, required: false })
	@IsOptional()
	@IsNotEmpty()
	@IsInt()
	@IsPositive()
	@Min(1)
	page: number;

	@ApiProperty({ type: 'number', minimum: 1, maximum: 50, required: false })
	@IsOptional()
	@IsNotEmpty()
	@IsInt()
	@IsPositive()
	@Min(1)
	@Max(50)
	limit: number;
}
