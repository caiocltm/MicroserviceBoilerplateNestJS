import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
	public static DEFAULT_PROJECTION: string[] = ['-_id', 'customer_code', 'name', 'taxvat', 'address'];

	@Prop({ required: true, trim: true })
	customer_code: number;

	@Prop({ required: true, trim: true })
	name: string;

	@Prop({ required: true, trim: true })
	taxvat: string;

	@Prop(
		raw({
			street: { type: String, trim: true },
			number: { type: String, trim: true },
			complement: { type: String, trim: true },
			district: { type: String, trim: true },
			city: { type: String, trim: true },
			postal_code: { type: String, trim: true },
			uf: { type: String, trim: true },
			country: { type: String, trim: true }
		})
	)
	address: Record<string, any>;
}

const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index({ customer_code: 1, taxvat: 1 }, { unique: true });

export { CustomerSchema };
