import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({ index: true, unique: true, required: true, trim: true })
	username: string;

	@Prop({ required: true, trim: true })
	password: string;

	@Prop({ required: true, trim: true })
	salt: string;

	@Prop({ required: true, default: Date.now() })
	createdAt: number;

	@Prop({ required: true, default: Date.now() })
	updatedAt: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
