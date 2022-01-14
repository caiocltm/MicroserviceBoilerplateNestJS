import { Schema } from 'mongoose';
import { User, UserSchema } from './user.schema';

const APIGatewaySchemas: Array<{ name: string; schema: Schema }> = [{ name: User.name, schema: UserSchema }];

export default APIGatewaySchemas;
