import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Customer } from '../schemas/customer.schema';

export class FindAllCustomersResponseDto {
	@ApiProperty({ type: [PartialType(Customer)] })
	customers: Partial<Customer>[];

	@ApiProperty({
		type: 'object',
		example: {
			current_page: 'number',
			page_size: 'number',
			total_pages: 'number'
		}
	})
	page_info: {
		current_page: number;
		page_size: number;
		total_pages: number;
	};

	@ApiProperty({ type: 'number' })
	total_count: number;
}
